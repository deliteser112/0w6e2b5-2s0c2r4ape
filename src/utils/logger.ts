import winston from 'winston';
import WinstonCloudWatch from 'winston-cloudwatch';
import config from '../config';

const cloudWatchConfig = {
  logGroupName: 'NodeJSLogs',
  logStreamName: 'ScrapingServiceStream',
  awsRegion: 'us-east-1',
  awsAccessKeyId: config.awsAccessKeyId,
  awsSecretKey: config.awsSecretKey,
};

console.log('cloudWatchConfig', cloudWatchConfig);
const { format } = winston;

const customFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (Object.keys(metadata).length !== 0) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

const winstonLogger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.errors({ stack: true }),
    customFormat
  ),
  transports: [
    new WinstonCloudWatch(cloudWatchConfig)
  ]
});

const logger = (info: string, metaData?: unknown) => {
  console.log(info, metaData ?? '');
  winstonLogger.info(info, metaData ?? '');
}

export default logger;