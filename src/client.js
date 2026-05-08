import { readFileSync } from 'fs';
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
    const { baseUrl = 'https://lunio.ca/api/v1', timeoutMs = 30000, maxRetries = 2, debug = false, middlewares = [] } = config;
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
    this.maxRetries = maxRetries;
    this.debug = debug;
    this.middlewares = middlewares;

    // Read version from package.json
    try {
      const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url)));
      this.version = pkg.version;
    } catch {
      this.version = 'unknown';
    }
  }

  async request(method, path, body = null) {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': `@lunio-canada/sdk/${this.version}`,
    };

    if (this.debug) {
      console.log(`[Lunio SDK] ${method} ${url}`);
    }

    // Middleware before request
    const ctx = { request: { method, url, headers: { ...headers }, body }, response: null };
    for (const mw of this.middlewares) {
      await mw(ctx, () => {});
    }

    let attempt = 0;
    let finalResponse = null;
    while (attempt <= this.maxRetries) {
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

      try {
        finalResponse = await fetch(url, options);
        clearTimeout(timeoutId);

        const requestId = finalResponse.headers.get('x-request-id') || finalResponse.headers.get('x-lunio-request-id');
        ctx.response = {
          status: finalResponse.status,
          headers: Object.fromEntries(finalResponse.headers),
          requestId,
          retryCount: attempt
        };

        if (!finalResponse.ok) {
          let errorData = null;
          try {
            errorData = await finalResponse.json();
          } catch (e) {
            // Ignore JSON parse errors
          }
          const apiError = new LunioAPIError(
            `API request failed: ${finalResponse.status} ${finalResponse.statusText}`,
            finalResponse.status,
            errorData?.code,
            errorData?.details,
            errorData,
            requestId
          );

          if (this.isRetryable(finalResponse.status)) {
            if (attempt < this.maxRetries) {
              attempt++;
              if (this.debug) {
                console.log(`[Lunio SDK] Retry ${attempt}/${this.maxRetries} for ${finalResponse.status}`);
              }
              await this.delay(100 * Math.pow(2, attempt - 1));
              continue;
            } else {
              if (this.debug) {
                console.log(`[Lunio SDK] Max retries exhausted for ${finalResponse.status}`);
              }
            }
          }
          throw apiError;
        }

        if (this.debug) {
          console.log(`[Lunio SDK] Response ${finalResponse.status}`);
        }

        const data = await finalResponse.json();

        // Middleware after response
        ctx.response.body = data;
        for (const mw of [...this.middlewares].reverse()) {
          await mw(ctx, () => {});
        }

        // Add metadata if debug
        if (this.debug) {
          return { ...data, _meta: { requestId, status: finalResponse.status, headers: ctx.response.headers, retryCount: attempt } };
        }
        return data;
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
          } else {
            if (this.debug) {
              console.log(`[Lunio SDK] Max retries exhausted for network error`);
            }
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