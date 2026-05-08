# Lunio SDK for Node.js

The official Node.js SDK for the Lunio Developer API. This SDK provides a clean, production-ready interface for interacting with the Lunio API, allowing developers to integrate Canadian tax calculations without manually writing fetch requests.

This package is intended to be published as `@lunio-canada/sdk` on npm.

## TypeScript Support

This SDK includes TypeScript declarations for full type safety and autocomplete support. No additional dependencies required.

## Installation

```bash
npm install @lunio-canada/sdk
```

The SDK is compatible with both JavaScript and TypeScript projects.

## Requirements

- Node.js 18+

## Authentication

All API requests require authentication using a Bearer token. You can obtain an API key from your Lunio dashboard.

```javascript
import Lunio from '@lunio-canada/sdk';

const lunio = new Lunio('ln_live_your_api_key');
```

Or using environment variables:

```javascript
const lunio = new Lunio(process.env.LUNIO_API_KEY);
```

## Usage

### Get Tax Rates

Retrieve the current Canadian tax rates for all provinces.

```javascript
const rates = await lunio.tax.getRates();
console.log(rates);
```

### Calculate Tax

Calculate the tax amount for a given province and pre-tax amount.

```javascript
const calculation = await lunio.tax.calculate({
  province_code: 'NL', // Required: Province code (e.g., 'NL', 'ON')
  amount: 100           // Required: Pre-tax amount (number)
});

console.log(calculation);
```

### Reverse Calculate Tax

Calculate the pre-tax amount from a total including tax.

```javascript
const reverse = await lunio.tax.reverse({
  province_code: 'NL', // Required: Province code
  total: 115            // Required: Total amount including tax (number)
});

console.log(reverse);
```

### TypeScript Usage

```typescript
import Lunio, { LunioConfig } from '@lunio-canada/sdk';

const config: LunioConfig = {
  timeoutMs: 10000,
  maxRetries: 3,
  debug: true
};

const lunio = new Lunio('your_api_key', config);

async function calculateTax() {
  const result = await lunio.tax.calculate({
    province_code: 'NL',
    amount: 100
  });
  console.log(result);
}
```

## Configuration

You can pass an optional configuration object to customize the SDK behavior:

```javascript
const lunio = new Lunio('your_api_key', {
  baseUrl: 'https://lunio.ca/api/v1', // Override the default base URL
  timeoutMs: 30000,                   // Request timeout in milliseconds (default: 30000)
  maxRetries: 2,                      // Maximum retry attempts for transient failures (default: 2)
  debug: false                        // Enable debug logging (default: false)
});
```

## Middleware

Add request/response interceptors for logging, metrics, or custom behavior:

```javascript
lunio.use(async (ctx, next) => {
  console.log(`Request: ${ctx.request.method} ${ctx.request.url}`);
  await next();
  if (ctx.response) {
    console.log(`Response: ${ctx.response.status}`);
  }
});
```

## Request Metadata

When debug mode is enabled, responses include a `_meta` property with request details:

```javascript
const rates = await lunio.tax.getRates();
// rates._meta = { requestId, status, headers, retryCount }
```

## Utility Helpers

```javascript
import { isLunioAPIError, formatError, getRequestId } from '@lunio-canada/sdk';

try {
  // ...
} catch (error) {
  if (isLunioAPIError(error)) {
    console.log(formatError(error)); // Formatted error string
    console.log('Request ID:', getRequestId(error));
  }
}
```

## Error Handling

The SDK throws custom errors for better error handling:

```javascript
try {
  const rates = await lunio.tax.getRates();
} catch (error) {
  if (error.name === 'LunioAPIError') {
    console.log('API Error:', error.status, error.code, error.details, error.requestId);
    console.log('Response body:', error.body);
  } else if (error.name === 'LunioSDKError') {
    console.log('SDK Error:', error.message);
  } else {
    console.log('Unexpected error:', error.message);
  }
}
```

## API Base URL

The default API base URL is `https://lunio.ca/api/v1`.

## License

MIT