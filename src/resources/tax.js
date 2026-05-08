import { LunioSDKError } from '../errors.js';

/**
 * Tax API methods.
 */
export class Tax {
  /**
   * @param {Client} client - HTTP client instance.
   */
  constructor(client) {
    this.client = client;
  }

  /**
   * Get the current Canadian tax rates for all provinces.
   * @returns {Promise<import('../types/index.d.ts').TaxRatesResponse>} Tax rates data.
   */
  async getRates() {
    return this.client.request('GET', '/tax/rates');
  }

  /**
   * Calculate the tax amount for a given province and pre-tax amount.
   * @param {Object} params - Parameters.
   * @param {string} params.province_code - Province code (e.g., 'NL', 'ON').
   * @param {number} params.amount - Pre-tax amount (must be finite number).
   * @returns {Promise<import('../types/index.d.ts').TaxCalculateResponse>} Calculation result.
   */
  async calculate({ province_code, amount }) {
    if (!province_code || typeof province_code !== 'string') {
      throw new LunioSDKError('Province code is required and must be a string');
    }
    if (typeof amount !== 'number' || !isFinite(amount)) {
      throw new LunioSDKError('Amount is required and must be a finite number');
    }
    return this.client.request('POST', '/tax/calculate', { province_code, amount });
  }

  /**
   * Reverse calculate the pre-tax amount from a total including tax.
   * @param {Object} params - Parameters.
   * @param {string} params.province_code - Province code (e.g., 'NL', 'ON').
   * @param {number} params.total - Total amount including tax (must be finite number).
   * @returns {Promise<import('../types/index.d.ts').TaxReverseResponse>} Reverse calculation result.
   */
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