/**
 * Error thrown for API-related failures.
 */
export class LunioAPIError extends Error {
  /**
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code.
   * @param {string} [code] - API error code.
   * @param {any} [details] - Additional details.
   * @param {any} [body] - Raw response body.
   * @param {string} [requestId] - Request ID from headers.
   */
  constructor(message, status, code = null, details = null, body = null, requestId = null) {
    super(message);
    this.name = 'LunioAPIError';
    this.status = status;
    this.code = code;
    this.details = details;
    this.body = body;
    this.requestId = requestId;
  }
}

/**
 * Error thrown for SDK-related failures.
 */
export class LunioSDKError extends Error {
  /**
   * @param {string} message - Error message.
   */
  constructor(message) {
    super(message);
    this.name = 'LunioSDKError';
  }
}