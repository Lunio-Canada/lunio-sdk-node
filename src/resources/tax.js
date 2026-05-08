import { LunioSDKError } from '../errors.js';

export class Tax {
  constructor(client) {
    this.client = client;
  }

  async getRates() {
    return this.client.request('GET', '/tax/rates');
  }

  async calculate({ province, amount }) {
    if (!province || typeof province !== 'string') {
      throw new LunioSDKError('Province is required and must be a string');
    }
    if (typeof amount !== 'number' || isNaN(amount)) {
      throw new LunioSDKError('Amount is required and must be a number');
    }
    return this.client.request('POST', '/tax/calculate', { province, amount });
  }

  async reverse({ province, total }) {
    if (!province || typeof province !== 'string') {
      throw new LunioSDKError('Province is required and must be a string');
    }
    if (typeof total !== 'number' || isNaN(total)) {
      throw new LunioSDKError('Total is required and must be a number');
    }
    return this.client.request('POST', '/tax/reverse', { province, total });
  }
}