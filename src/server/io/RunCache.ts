import { DynamoDB } from 'aws-sdk';
import {
  createQuestionRun,
  createQuestionRunV2,
  DynamoRun,
  PostgresRun,
} from '../model';
import { Sql } from 'postgres';
import { SupabaseClient } from '@supabase/supabase-js';
import { MAX_GENERATION_NUMBER } from '../../config';

const MAX_ONLINE_PER_RUN = 500;

// TODO: create reusable context type in server folder or server/types
interface ServerContext {
  dynamo: DynamoDB.DocumentClient;
  sql: Sql;
  supabase: SupabaseClient;
}

type OnlineStats = {
  online: number;
};

/**
 * Cache which holds online active count for each Question and each Run
 * When threshold is met for online people per Run, new Run is created
 * When time elapses, we decrement/delete run and online count
 *
 * We only check on enabled runs and we return selected run object
 */
class RunCache {
  millisecondsToLive: number;
  onlineThreshold: number;
  online: Map<string, number>;
  timeouts: Map<string, ReturnType<typeof setTimeout>>;
  dynamo: DynamoDB.DocumentClient;
  sql: Sql;
  supabase: SupabaseClient;

  constructor(
    secondsToLive = 10,
    onlineThreshold = 5,
    { dynamo, sql, supabase }: ServerContext
  ) {
    this.dynamo = dynamo;
    this.sql = sql;
    this.supabase = supabase;
    this.millisecondsToLive = secondsToLive * 1000;
    this.onlineThreshold = onlineThreshold;
    this.online = new Map();
    this.timeouts = new Map();

    this.getRun = this.getRun.bind(this);
    this.getRunV2 = this.getRunV2.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.getOnlineData = this.getOnlineData.bind(this);
  }

  async getRun(questionId: string, runs: DynamoRun[]): Promise<DynamoRun> {
    // We simplify run objects, sort them and filter out the full ones
    const sortedRuns = (
      runs.map((r: DynamoRun) => {
        const key = `${r.id}#R#${r.run}`;
        const cachedItem = this.online.get(key);
        if (!cachedItem) {
          this.online.set(key, 0);
          return [r.run, 0];
        }

        // TODO: debug run cache, because it might work weirdly
        // console.log(`RUN no. ${r.run}: `, cachedItem);

        return [r.run, cachedItem];
      }) as [number, number][]
    )
      .sort((a: [number, number], b: [number, number]) => a[0] - b[0])
      .filter((r) => r[1] < MAX_ONLINE_PER_RUN);

    // If no runs are available, we create a new run
    if (sortedRuns.length === 0) {
      // TODO: maybe add new map here isUpdating[question] = true
      // and after await result set it to isUpdating[question] = false
      // if isUpdating question is true, recursively call get fresh run
      // which will somehow fetch the new run created

      const run = await createQuestionRun(questionId, {
        dynamo: this.dynamo,
        sql: this.sql,
        supabase: this.supabase,
      });

      this.increment(`${questionId}#R#${(run as DynamoRun).run}`);

      return run as DynamoRun;
    }

    // If we find run to use, we increment online count and return the run object
    const runId = sortedRuns[0][0];
    this.increment(`${questionId}#R#${runId}`);

    return runs.find((r) => r.run === runId) as DynamoRun; // force as defined, because we know it is
  }

  /**
   * Determines if a new run chain should be created based on probability
   * @param maxGenerations - Maximum number of generations for the question
   * @param generationSize - Size of each generation
   * @returns boolean indicating whether to create new run chain
   */
  private static shouldCreateNewRunChain(
    maxGenerations: number,
    generationSize: number
  ): boolean {
    const probability = 1 / (maxGenerations * generationSize);
    return Math.random() < probability;
  }

  async getRunV2(
    questionId: string,
    runs: PostgresRun[],
    userId: string
  ): Promise<PostgresRun> {
    // We simplify run objects, sort them and filter out the full ones
    const sortedRuns =
      // first we filter in case we returned no runs but an empty object with question settings
      (
        runs
          .filter((r) => r.id)
          .sort((a, b) =>
            a.createdAt.toString().localeCompare(b.createdAt.toString())
          )
          .map((r: PostgresRun) => {
            const key = r.id;
            const cachedItem = this.online.get(key);
            if (!cachedItem) {
              this.online.set(key, 0);
              return [r.runNum, 0];
            }

            // TODO: debug run cache, because it might work weirdly
            // console.log(`RUN no. ${r.run}: `, cachedItem);

            return [r.runNum, cachedItem];
          }) as [number, number][]
      )
        //  .sort((a: [number, number], b: [number, number]) => a[0] - b[0])
        .filter((r) => r[1] < MAX_ONLINE_PER_RUN);

    // If no runs are available, we create a new run
    if (
      sortedRuns.length === 0 ||
      RunCache.shouldCreateNewRunChain(
        MAX_GENERATION_NUMBER,
        runs[0].strategy.tipsPerGeneration
      )
    ) {
      // TODO: maybe add new map here isUpdating[question] = true
      // and after await result set it to isUpdating[question] = false
      // if isUpdating question is true, recursively call get fresh run
      // which will somehow fetch the new run created

      const run = await createQuestionRunV2(questionId, userId, {
        dynamo: this.dynamo,
        sql: this.sql,
        supabase: this.supabase,
      });

      this.increment(run.id);

      return run as PostgresRun;
    }

    // If we find run to use, we increment online count and return the run object
    const runNum = sortedRuns[0][0];
    const foundRun = runs.find((r) => r.runNum === runNum);
    this.increment(foundRun.id);

    return foundRun as PostgresRun; // force as defined, because we know it is
  }

  increment(key: string) {
    const timeout = this.timeouts.get(key);

    if (timeout) {
      clearTimeout(timeout);
    }

    this.online.set(key, (this.online.get(key) || 0) + 1);

    this.timeouts.set(
      key,
      setTimeout(() => this.decrement(key), this.millisecondsToLive)
    );
  }

  decrement(key: string) {
    const online = this.online.get(key) || 0;
    if (online > 0) {
      this.online.set(key, online - 1);

      if (online - 1 > 0) {
        this.timeouts.set(
          key,
          setTimeout(() => this.decrement(key), this.millisecondsToLive)
        );
      }
    }
  }

  getOnlineData(): OnlineStats {
    let sum = 0;

    this.online.forEach((value) => {
      sum += value;
    });

    return { online: sum };
  }
}

export { RunCache };
