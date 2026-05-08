import { Client } from './client.js';
import { Tax } from './resources/tax.js';

export class Lunio {
  constructor(apiKey, config = {}) {
    this.client = new Client(apiKey, config);
    this.tax = new Tax(this.client);
  }
}

export default Lunio;