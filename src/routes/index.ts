import express from 'express';
import scraperController from '../controllers/scraperController';

const router = express.Router();

router.get('/scrape', scraperController.scrapeData);

export default router;