import { LunioSDKError } from '../errors.js';

export class Tax {
  constructor(client) {
    this.client = client;
  }

  async getRates() {
    return this.client.request('GET', '/tax/rates');
  }

  async calculate({ province_code, amount }) {
    if (!province_code || typeof province_code !== 'string') {
      throw new LunioSDKError('Province code is required and must be a string');
    }
    if (typeof amount !== 'number' || !isFinite(amount)) {
      throw new LunioSDKError('Amount is required and must be a finite number');
    }
    return this.client.request('POST', '/tax/calculate', { province_code, amount });
  }

  async reverse({ province_code, total }) {
    if (!province_code || typeof province_code !== 'string') {
      throw new LunioSDKError('Province code is required and must be a string');
    }
    if (typeof total !== 'number' || !isFinite(total)) {
      throw new LunioSDKError('Total is required and must be a finite number');
    }
    return this.client.request('POST', '/tax/reverse', { province_code, total });
  }
}