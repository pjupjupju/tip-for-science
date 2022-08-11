/**
 */
class RunLock {
  runLocks: Map<string, boolean>;

  constructor() {
    this.runLocks = new Map();

    this.getLock = this.getLock.bind(this);
    this.lock = this.lock.bind(this);
    this.unlock = this.unlock.bind(this);
  }

  lock(questionAndRunIdAndGeneration: string) {
    this.runLocks.set(questionAndRunIdAndGeneration, true);
  }

  unlock(questionAndRunIdAndGeneration: string) {
    this.runLocks.delete(questionAndRunIdAndGeneration);
  }

  getLock(questionAndRunIdAndGeneration: string): boolean {
    return this.runLocks.get(questionAndRunIdAndGeneration) || false;
  }
}

export { RunLock };
