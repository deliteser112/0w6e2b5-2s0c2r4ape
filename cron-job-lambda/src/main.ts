import axios from 'axios';

const handler = async (event: any) => {
  const url = 'http://3.88.184.167:3000/scrape?isCronJob=true';

  try {
    const response = await axios.get(url);
    console.log('Scrape Successful:', response.data);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Scrape triggered successfully', data: response.data })
    };
  } catch (error) {
    console.error('Error triggering scrape:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to trigger scrape', error: error.message })
    };
  }
};

export default handler;