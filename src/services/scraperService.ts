import { scrape } from '../utils/scraper';
import { QueryParams } from '../types/params';
import { DataOfScraping } from '../types/scraping';
import { getDataFromS3, uploadDataToS3 } from '../utils/s3';
import config from '../config';
import logger from '../utils/logger';

const bucketName = config.scrapedDataS3BucketName;
const bucketKey = config.scrapedDataS3BucketKey;

const performScraping = async (queryParams: QueryParams) => {
  return await scrape(queryParams);
};

const performGettingDataFromS3 = async () => {
  logger('<-------- Getting S3 is started --------->');
  const data = await getDataFromS3(bucketName, bucketKey);
  logger('<-------- Getting S3 is finished --------->', data);
  return data;
}

const performStoringDataToS3 = async (data: DataOfScraping) => {
  logger('<-------- Updating S3 is started --------->', data);
  await uploadDataToS3(bucketName, bucketKey, data);
  logger('<-------- Updating S3 is finished --------->');
}

export default {
  performScraping,
  performGettingDataFromS3,
  performStoringDataToS3,
}