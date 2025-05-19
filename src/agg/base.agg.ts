type TAggConfig<T> = {
  maxLength?: number;
  flushIntervalInSec?: number;
  flushHandler: (buff: T[]) => Promise<void>;
};

export class BaseAgg<T> {
  private _buff: T[];
  private _maxSize: number;
  private _flushIntervalInSec: number;
  private _flushInterval: NodeJS.Timeout;
  private _flushHandler: (buff: T[]) => Promise<void>;

  constructor(config: TAggConfig<T>) {
    this._buff = [];
    this._maxSize = config.maxLength || 10;
    this._flushIntervalInSec = config.flushIntervalInSec || 5;
    this._flushInterval = setInterval(
      this.flushAll.bind(this),
      this._flushIntervalInSec * 1000
    );
    this._flushHandler = config.flushHandler;
  }

  /**
   * push an item to the buffer
   */
  push(item: T) {
    this._buff.push(item);
    if (this._buff.length >= this._maxSize) {
      this.flushAll();
    }
  }

  /**
   * flush all items in the buffer
   */
  async flushAll() {
    const buffToFlush = this._buff;
    this._buff = [];
    await this._flushHandler(buffToFlush);
  }

  /**
   * flush all remaining items and clear the interval
   * used for graceful shutdown
   */
  async shutdown() {
    await this.flushAll();
    clearInterval(this._flushInterval);
  }
}
