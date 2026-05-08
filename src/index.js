import { Client } from './client.js';
import { Tax } from './resources/tax.js';

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
    this.client = new Client(apiKey, config);
    this.tax = new Tax(this.client);
  }
}

export default Lunio;