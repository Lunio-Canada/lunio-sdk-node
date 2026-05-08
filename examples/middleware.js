import Lunio from '../src/index.js';

const lunio = new Lunio(process.env.LUNIO_API_KEY || 'ln_live_your_api_key', { debug: true });

// Add logging middleware
lunio.use(async (ctx, next) => {
  console.log(`Starting request: ${ctx.request.method} ${ctx.request.url}`);
  await next();
  if (ctx.response) {
    console.log(`Response received: ${ctx.response.status}, Request ID: ${ctx.response.requestId}`);
  }
});

async function middlewareExample() {
  try {
    const rates = await lunio.tax.getRates();
    console.log('Tax rates with metadata:', rates);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

middlewareExample();