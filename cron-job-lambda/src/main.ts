import axios from 'axios';

const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const handler = async (event: any) => {
  const url = 'http://3.88.184.167:3000/scrape?isCronJob=true';

  try {
    axios.get(url);

    await delay(500);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Scrape triggered successfully' })
    };
  } catch (error) {
    console.error('Error triggering scrape:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to trigger scrape', error: error.message })
    };
  }
};

export {
  handler
};