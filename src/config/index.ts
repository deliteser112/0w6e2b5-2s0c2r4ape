import dEnv from 'dotenv';

dEnv.config();
export default {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretKey: process.env.AWS_SECRET_ACCESS_KEY,
  scrapedDataS3BucketName: process.env.S3_BUCKET_NAME,
  scrapedDataS3BucketKey: process.env.S3_KEY_PREFIX,
};