import { LunioAPIError, LunioSDKError } from './errors.js';

/**
 * Internal HTTP client for making API requests.
 */
export class Client {
  /**
   * @param {string} apiKey - API key.
   * @param {import('../types/index.d.ts').LunioConfig} config - Configuration.
   */
  constructor(apiKey, config = {}) {
    if (!apiKey) {
      throw new LunioSDKError('API key is required');
    }
    const { baseUrl = 'https://lunio.ca/api/v1', timeoutMs = 30000, maxRetries = 2, debug = false } = config;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
    this.maxRetries = maxRetries;
    this.debug = debug;
  }

  async request(method, path, body = null) {
    const url = `${this.baseUrl}${path}`;
    if (this.debug) {
      console.log(`[Lunio SDK] ${method} ${url}`);
    }

    let attempt = 0;
    while (attempt <= this.maxRetries) {
      const headers = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json',
      };

      const options = {
        method,
        headers,
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);
      options.signal = controller.signal;

      let response = null;
      try {
        response = await fetch(url, options);
        clearTimeout(timeoutId);

        const requestId = response.headers.get('x-request-id') || response.headers.get('x-lunio-request-id');

        if (!response.ok) {
          let errorData = null;
          try {
            errorData = await response.json();
          } catch (e) {
            // Ignore JSON parse errors
          }
          const apiError = new LunioAPIError(
            `API request failed: ${response.status} ${response.statusText}`,
            response.status,
            errorData?.code,
            errorData?.details,
            errorData,
            requestId
          );

          if (this.isRetryable(response.status)) {
            if (attempt < this.maxRetries) {
              attempt++;
              if (this.debug) {
                console.log(`[Lunio SDK] Retry ${attempt}/${this.maxRetries} for ${response.status}`);
              }
              await this.delay(100 * Math.pow(2, attempt - 1));
              continue;
            }
          }
          throw apiError;
        }

        if (this.debug) {
          console.log(`[Lunio SDK] Response ${response.status}`);
        }

        return await response.json();
      } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
          throw new LunioSDKError(`Request timed out after ${this.timeoutMs}ms`);
        }
        if (error instanceof LunioAPIError) {
          throw error;
        }
        // Network error
        if (this.isRetryable(null)) {
          if (attempt < this.maxRetries) {
            attempt++;
            if (this.debug) {
              console.log(`[Lunio SDK] Retry ${attempt}/${this.maxRetries} for network error`);
            }
            await this.delay(100 * Math.pow(2, attempt - 1));
            continue;
          }
        }
        throw new LunioSDKError(`Network error: ${error.message}`);
      }
    }
  }

  isRetryable(status) {
    if (status === null) return true; // Network error
    return status === 429 || status >= 500;
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}