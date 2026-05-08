import Lunio from '../src/index.js';

const lunio = new Lunio(process.env.LUNIO_API_KEY || 'ln_live_your_api_key');

async function errorHandlingExample() {
  try {
    // This will fail due to invalid province_code
    const calculation = await lunio.tax.calculate({
      province_code: '',
      amount: 100
    });
    console.log('Calculation:', calculation);
  } catch (error) {
    console.error('Error:', error.message);
    if (error.name === 'LunioAPIError') {
      console.error('Status:', error.status);
      console.error('Request ID:', error.requestId);
      console.error('Body:', error.body);
    }
  }
}

errorHandlingExample();