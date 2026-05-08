/**
 * Configuration options for the Lunio SDK.
 */
export interface LunioConfig {
  /** Override the default base URL for the API. */
  baseUrl?: string;
  /** Request timeout in milliseconds. Default: 30000 */
  timeoutMs?: number;
  /** Maximum retry attempts for transient failures. Default: 2 */
  maxRetries?: number;
  /** Enable debug logging. Default: false */
  debug?: boolean;
}

/**
 * Response from the tax rates endpoint.
 */
export interface TaxRatesResponse {
  [key: string]: any;
}

/**
 * Response from the tax calculate endpoint.
 */
export interface TaxCalculateResponse {
  [key: string]: any;
}

/**
 * Response from the tax reverse endpoint.
 */
export interface TaxReverseResponse {
  [key: string]: any;
}

/**
 * Shape of LunioAPIError instances.
 */
export interface LunioAPIErrorShape {
  /** Error message. */
  message: string;
  /** HTTP status code. */
  status: number;
  /** API error code, if provided. */
  code?: string;
  /** Additional error details, if provided. */
  details?: any;
  /** Raw response body, if available. */
  body?: any;
  /** Request ID from the API response headers. */
  requestId?: string;
}

/**
 * Main Lunio SDK class.
 */
export declare class Lunio {
  /**
   * Create a new Lunio SDK instance.
   * @param apiKey - Your Lunio API key.
   * @param config - Optional configuration options.
   */
  constructor(apiKey: string, config?: LunioConfig);

  /** Tax-related API methods. */
  tax: Tax;
}

/**
 * Tax API methods.
 */
export declare class Tax {
  /**
   * Get the current Canadian tax rates.
   * @returns Promise resolving to tax rates data.
   */
  getRates(): Promise<TaxRatesResponse>;

  /**
   * Calculate tax for a given province and amount.
   * @param params - Calculation parameters.
   * @param params.province_code - Province code (e.g., 'NL', 'ON').
   * @param params.amount - Pre-tax amount (must be finite number).
   * @returns Promise resolving to calculation result.
   */
  calculate(params: { province_code: string; amount: number }): Promise<TaxCalculateResponse>;

  /**
   * Reverse calculate the pre-tax amount from a total including tax.
   * @param params - Reverse calculation parameters.
   * @param params.province_code - Province code (e.g., 'NL', 'ON').
   * @param params.total - Total amount including tax (must be finite number).
   * @returns Promise resolving to reverse calculation result.
   */
  reverse(params: { province_code: string; total: number }): Promise<TaxReverseResponse>;
}

/**
 * API error thrown by the SDK.
 */
export declare class LunioAPIError extends Error {
  constructor(message: string, status: number, code?: string, details?: any, body?: any, requestId?: string);
  /** HTTP status code. */
  status: number;
  /** API error code, if provided. */
  code?: string;
  /** Additional error details, if provided. */
  details?: any;
  /** Raw response body, if available. */
  body?: any;
  /** Request ID from the API response headers. */
  requestId?: string;
}

/**
 * SDK error thrown by the SDK.
 */
export declare class LunioSDKError extends Error {
  constructor(message: string);
}

export default Lunio;