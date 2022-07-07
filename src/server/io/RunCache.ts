import { DynamoDB } from 'aws-sdk';

// TODO: create reusable context type in server folder or server/types
interface ServerContext {
  dynamo: DynamoDB.DocumentClient;
}

type RunData = {
  online: number;
  timeout: number;
};

type QuestionData = {
  [rId: number]: RunData;
};

type RunCacheData = {
  [qId: string]: QuestionData;
};

/**
 * Cache which holds online active count for each Question and each Run
 * When threshold is met for online people per Run, new Run is created
 * When time elapses, we decrement/delete run and online count
 *
 * Always check for existing runs and whether they are still open
 */
class RunCache {
  millisecondsToLive: number;
  onlineThreshold: number;
  cache: RunCacheData | null;

  constructor(secondsToLive = 15, onlineThreshold = 5, { dynamo }: ServerContext) {
    this.millisecondsToLive = secondsToLive * 1000;
    this.onlineThreshold = onlineThreshold;
    // TODO: swap for real data
    this.cache = {
      '30b86d42-84aa-4ba7-9aa9-80b9c8f80cfa': {
        1: {
          online: 5,
          timeout: setTimeout(() => {
            console.log('finished');
          }, 10000000),
        },
        2: {
          online: 3,
          timeout: setTimeout(() => {
            console.log('finished');
          }, 10000000),
        },
      },
    };
    // this.resetCache = this.resetCache.bind(this);
    this.isCacheExpired = this.isCacheExpired.bind(this);
    // this.fetchDate = new Date(0);
  }
  isCacheExpired() {
    // return (this.fetchDate.getTime() + this.millisecondsToLive) < new Date().getTime();
    return false;
  }

  getRunId(qId: string): number {
    return 1;
  }

  getOnlineData() {
    return {
      onlineUsers:
        this.cache === null
          ? 0
          : Object.values(this.cache).reduce(
              (sum: number, item: QuestionData) => {
                return (
                  sum +
                  Object.values(item).reduce(
                    (online: number, run: RunData) => run.online + online,
                    0
                  )
                );
              },
              0
            ),
    };
  }

  /**
  getData() {
    if (!this.cache || this.isCacheExpired()) {
      console.log('expired - fetching new data');
      return this.fetchFunction()
        .then((data) => {
        this.cache = data;
        this.fetchDate = new Date();
        return data;
      });
    } else {
      console.log('cache hit');
      return Promise.resolve(this.cache);
    }
  }

  resetCache() {
   this.fetchDate = new Date(0);
  }
   */
}

export { RunCache };
