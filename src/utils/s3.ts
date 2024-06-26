import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { DataOfScraping } from '../types/scraping';
import config from '../config';

const s3Client = new S3Client({
  region: 'us-east-1',
  credentials: {
    accessKeyId: config.awsAccessKeyId, 
    secretAccessKey: config.awsSecretKey
  }
});

async function streamToString(stream: any): Promise<string> {
  const chunks = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk: any) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
  });
}

const getDataFromS3 = async (bucketName: string, key: string) => {
  const command = new GetObjectCommand({
    Bucket: bucketName,
    Key: key,
  });

  try {
    const { Body } = await s3Client.send(command);
    const bodyContents = await streamToString(Body);
    return JSON.parse(bodyContents);
  } catch (error) {
    console.error('Error fetching from S3:', error);
    throw new Error('Failed to fetch data from S3');
  }
}

const uploadDataToS3 = async (bucketName: string, key: string, data: DataOfScraping) => {
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: JSON.stringify(data),
    ContentType: 'application/json'
  });

  try {
    await s3Client.send(command);
    console.log('Data successfully uploaded to S3');
  } catch (error) {
    console.error('Failed to upload data to S3:', error);
    throw new Error('Failed to upload data to S3');
  }
}

export {
  getDataFromS3,
  uploadDataToS3,
}