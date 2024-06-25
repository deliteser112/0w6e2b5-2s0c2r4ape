import { Request, Response } from 'express';
import scraperService from '../services/scraperService';
import { QueryParams } from 'src/types/params';

const scrapeData = async (req: Request, res: Response): Promise<void> => {
  try {
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

    console.log('<-------- GET /scrape REQUEST is triggered --------->');
    console.log('Scraping Query parameter is ', queryParams);
    const data = await scraperService.performScraping(queryParams);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  scrapeData,
}