type Resolver = () => void;

class AudioSemaphore {
  private permits: number;
  private queue: Resolver[] = [];

  constructor(initialPermits = 1) {
    this.permits = initialPermits;
  }

  private async acquire(): Promise<void> {
    if (this.permits > 0) {
      this.permits -= 1;
      return;
    }

    await new Promise<void>((resolve) => {
      this.queue.push(resolve);
    });
  }

  private release(): void {
    const next = this.queue.shift();
    if (next) {
      next();
      return;
    }

    this.permits += 1;
  }

  public async runExclusive<T>(fn: () => Promise<T> | T): Promise<T> {
    await this.acquire();
    try {
      return await fn();
    } finally {
      this.release();
    }
  }
}

export const audioSemaphore = new AudioSemaphore(1);
