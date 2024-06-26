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

const winstonLogger = winston.createLogger({
  transports: [
    new WinstonCloudWatch(cloudWatchConfig)
  ]
});

const logger = (info: string, metaData?: unknown) => {
  console.log(info, metaData ?? '');

  const msg = info + JSON.stringify({ metaData });
  winstonLogger.info(msg);
}

export default logger;