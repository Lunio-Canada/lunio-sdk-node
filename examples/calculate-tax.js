import Lunio from '../src/index.js';

const apiKey = process.env.LUNIO_API_KEY || 'ln_live_your_api_key';

const lunio = new Lunio(apiKey);

async function calculateTax() {
  try {
const calculation = await lunio.tax.calculate({
  province_code: 'NL',
  amount: 100
});
    console.log('Tax calculation:', calculation);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

calculateTax();