import Lunio from '../src/index.js';

const apiKey = process.env.LUNIO_API_KEY || 'ln_live_your_api_key';

const lunio = new Lunio(apiKey);

async function reverseTax() {
  try {
const reverse = await lunio.tax.reverse({
  province_code: 'NL',
  total: 115
});
    console.log('Reverse tax calculation:', reverse);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

reverseTax();