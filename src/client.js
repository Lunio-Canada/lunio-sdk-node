import { LunioAPIError, LunioSDKError } from './errors.js';

export class Client {
  constructor(apiKey, baseUrl = 'https://lunio.ca/api/v1', timeoutMs = 30000) {
    if (!apiKey) {
      throw new LunioSDKError('API key is required');
    }
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
  }

  async request(method, path, body = null) {
    const url = `${this.baseUrl}${path}`;
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

    try {
      const response = await fetch(url, options);
      clearTimeout(timeoutId);

      if (!response.ok) {
        let errorData = null;
        try {
          errorData = await response.json();
        } catch (e) {
          // Ignore JSON parse errors
        }
        throw new LunioAPIError(
          `API request failed: ${response.status} ${response.statusText}`,
          response.status,
          errorData?.code,
          errorData?.details,
          errorData
        );
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
      throw new LunioSDKError(`Network error: ${error.message}`);
    }
  }
}