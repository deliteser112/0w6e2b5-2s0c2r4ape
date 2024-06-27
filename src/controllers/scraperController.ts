import { Request, Response } from 'express';
import scraperService from '../services/scraperService';
import { QueryParams } from '../types/params';
import { DataOfScraping } from '../types/scraping';
import logger from '../utils/logger';
import { isEmptyQueryParams } from '../utils/validation';

const scrapeData = async (req: Request, res: Response): Promise<void> => {
  try {
    const isCronJob = req.query.isCronJob === 'true';

    const queryParams: QueryParams = {
      lastName: req.query.lastName as string,
      firstName: req.query.firstName as string,
      informalName: req.query.informalName as string,
      registrationNumber: req.query.registrationNumber as string,
      registrationClass: req.query.registrationClass as string,
      registrationStatus: req.query.registrationStatus as string,
      contactLensMentor: req.query.contactLensMentor as string,
      practiceName: req.query.practiceName as string,
      cityOrTown: req.query.cityOrTown as string,
      postalCode: req.query.postalCode as string,
      languageOfService: req.query.languageOfService as string,
      areaOfService: req.query.areaOfService as string,
    };

    logger(' ### Test Log ###');
    logger(`<-------- GET /scrape REQUEST is triggered ${isCronJob ? 'by cron-job ' : ''}--------->`);
    logger('Scraping Query parameters are ', queryParams);

    let data: unknown;

    if (!isCronJob && isEmptyQueryParams(queryParams)) {
      data = await scraperService.performGettingDataFromS3();
    } else {
      data = await scraperService.performScraping(queryParams);
    }

    if (isCronJob) {
      await scraperService.performStoringDataToS3(data as DataOfScraping);
    }

    logger('<-------- GET /scrape REQUEST is finished --------->');
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  scrapeData,
}