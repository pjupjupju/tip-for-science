import { DynamoDB } from 'aws-sdk';
import { createQuestionRun, DynamoRun } from '../model';

const MAX_ONLINE_PER_RUN = 5;

// TODO: create reusable context type in server folder or server/types
interface ServerContext {
  dynamo: DynamoDB.DocumentClient;
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
  timeouts: Map<string, number>;
  dynamo: DynamoDB.DocumentClient;

  constructor(
    secondsToLive = 15,
    onlineThreshold = 5,
    { dynamo }: ServerContext
  ) {
    this.dynamo = dynamo;
    this.millisecondsToLive = secondsToLive * 1000;
    this.onlineThreshold = onlineThreshold;
    this.online = new Map();
    this.timeouts = new Map();

    this.getRunId = this.getRunId.bind(this);
    this.increment = this.increment.bind(this);
    this.decrement = this.decrement.bind(this);
    this.getOnlineData = this.getOnlineData.bind(this);
  }

  async getRunId(questionId: string, runs: DynamoRun[]): Promise<DynamoRun> {
    // We simplify run objects, sort them and filter out the full ones
    const sortedRuns = (runs.map((r: DynamoRun) => {
      const key = `${r.id}#R#${r.run}`;
      const cachedItem = this.online.get(key);
      if (!cachedItem) {
        this.online.set(key, 0);
        return [r.run, 0];
      }

      // TODO: debug run cache, because it might work weirdly
      // console.log(`RUN no. ${r.run}: `, cachedItem);

      return [r.run, cachedItem];
    }) as [number, number][])
      .sort((a: [number, number], b: [number, number]) => a[1] - b[1])
      .filter((r) => r[1] < MAX_ONLINE_PER_RUN);

    // If no runs are available, we create a new run
    if (sortedRuns.length === 0) {
      const run = await createQuestionRun(questionId, {
        dynamo: this.dynamo,
      });

      this.increment(`${questionId}#R#${(run as DynamoRun).run}`);

      return run as DynamoRun;
    }

    // If we find run to use, we increment online count and return the run object
    const runId = sortedRuns[0][0];
    this.increment(`${questionId}#R#${runId}`);

    return runs.find((r) => r.run === runId) as DynamoRun; // force as defined, because we know it is
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
