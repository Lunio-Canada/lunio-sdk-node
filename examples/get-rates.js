import Lunio from '../src/index.js';

const lunio = new Lunio(process.env.LUNIO_API_KEY || 'ln_live_your_api_key');

const lunio = new Lunio(apiKey);

async function getRates() {
  try {
    const rates = await lunio.tax.getRates();
    console.log('Tax rates:', rates);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

getRates();