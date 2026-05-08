import Lunio, { LunioConfig } from '../src/index.js';

const config: LunioConfig = {
  timeoutMs: 10000,
  maxRetries: 3,
  debug: true
};

const lunio = new Lunio(process.env.LUNIO_API_KEY || 'ln_live_your_api_key', config);

async function typescriptExample() {
  try {
    const rates = await lunio.tax.getRates();
    console.log('Tax rates:', rates);

    const calculation = await lunio.tax.calculate({
      province_code: 'NL',
      amount: 100
    });
    console.log('Calculation:', calculation);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

typescriptExample();