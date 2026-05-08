import { Client } from './client.js';
import { Tax } from './resources/tax.js';

export class Lunio {
  constructor(apiKey, config = {}) {
    const { baseUrl, timeoutMs } = config;
    this.client = new Client(apiKey, baseUrl, timeoutMs);
    this.tax = new Tax(this.client);
  }
}

export default Lunio;