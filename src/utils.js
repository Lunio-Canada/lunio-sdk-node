import { LunioAPIError, LunioSDKError } from './errors.js';

/**
 * Check if an error is a LunioAPIError.
 * @param {any} error - The error to check.
 * @returns {boolean} True if the error is a LunioAPIError.
 */
export function isLunioAPIError(error) {
  return error instanceof LunioAPIError;
}

/**
 * Check if an error is a LunioSDKError.
 * @param {any} error - The error to check.
 * @returns {boolean} True if the error is a LunioSDKError.
 */
export function isLunioSDKError(error) {
  return error instanceof LunioSDKError;
}

/**
 * Format an error for logging or display.
 * @param {Error} error - The error to format.
 * @returns {string} Formatted error string.
 */
export function formatError(error) {
  if (isLunioAPIError(error)) {
    return `LunioAPIError: ${error.message} (status: ${error.status}, code: ${error.code || 'none'}, requestId: ${error.requestId || 'none'})`;
  }
  if (isLunioSDKError(error)) {
    return `LunioSDKError: ${error.message}`;
  }
  return `Error: ${error.message}`;
}

/**
 * Extract request ID from a LunioAPIError.
 * @param {LunioAPIError} error - The API error.
 * @returns {string|null} The request ID or null.
 */
export function getRequestId(error) {
  return error.requestId || null;
}