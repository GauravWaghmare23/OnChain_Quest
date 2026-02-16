/**
 * Transaction Queue System
 * Prevents multiple concurrent blockchain requests
 * Serializes transactions to avoid race conditions
 */

type QueuedTransaction = {
  id: string;
  fn: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: Error) => void;
  retries: number;
};

class TransactionQueue {
  private queue: QueuedTransaction[] = [];
  private isProcessing = false;
  private maxRetries = 3;

  /**
   * Add a transaction to the queue
   */
  async enqueue<T>(fn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      const id = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      this.queue.push({
        id,
        fn,
        resolve,
        reject,
        retries: 0,
      });
      this.process();
    });
  }

  /**
   * Process queue serially
   */
  private async process(): Promise<void> {
    if (this.isProcessing || this.queue.length === 0) {
      return;
    }

    this.isProcessing = true;

    while (this.queue.length > 0) {
      const tx = this.queue.shift()!;

      try {
        console.log(`[TxQueue] Processing ${tx.id}`);
        const result = await tx.fn();
        tx.resolve(result);
      } catch (error) {
        const err = error instanceof Error ? error : new Error(String(error));

        // Retry logic for specific errors
        if (
          tx.retries < this.maxRetries &&
          (err.message.includes("Failed to fetch") ||
            err.message.includes("timeout") ||
            err.message.includes("congested"))
        ) {
          tx.retries++;
          const delay = 1000 * Math.pow(2, tx.retries - 1); // Exponential backoff

          console.warn(
            `[TxQueue] ${tx.id} failed, retrying in ${delay}ms (attempt ${tx.retries}/${this.maxRetries})`
          );

          // Re-queue the transaction
          this.queue.unshift(tx);

          // Wait before processing next
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          console.error(`[TxQueue] ${tx.id} failed after ${tx.retries} retries:`, err);
          tx.reject(err);
        }
      }
    }

    this.isProcessing = false;
  }

  /**
   * Get current queue size
   */
  getQueueSize(): number {
    return this.queue.length;
  }

  /**
   * Clear the queue
   */
  clear(): void {
    this.queue = [];
  }
}

// Singleton instance
export const txQueue = new TransactionQueue();

/**
 * Hook to use transaction queue
 */
export const useTransactionQueue = () => {
  return {
    enqueue: txQueue.enqueue.bind(txQueue),
    getQueueSize: txQueue.getQueueSize.bind(txQueue),
    clear: txQueue.clear.bind(txQueue),
  };
};
