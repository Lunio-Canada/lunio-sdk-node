import { Client } from './client.js';
import { Tax } from './resources/tax.js';
import * as utils from './utils.js';

/**
 * Main Lunio SDK class for interacting with the Lunio Developer API.
 */
export class Lunio {
  /**
   * Create a new Lunio SDK instance.
   * @param {string} apiKey - Your Lunio API key.
   * @param {import('../types/index.d.ts').LunioConfig} [config={}] - Optional configuration options.
   */
  constructor(apiKey, config = {}) {
    this.middlewares = [];
    this.client = new Client(apiKey, { ...config, middlewares: this.middlewares });
    this.tax = new Tax(this.client);
  }

  /**
   * Add middleware for request/response interception.
   * @param {Function} fn - Middleware function with (ctx, next) signature.
   */
  use(fn) {
    this.middlewares.push(fn);
  }
}

export { isLunioAPIError, isLunioSDKError, formatError, getRequestId } from './utils.js';

export default Lunio;