import { scrape } from '../utils/scraper';
import { QueryParams } from 'src/types/params';

const performScraping = async (queryParams: QueryParams) => {
  console.log('<-------- PerformScraping service is started --------->');
  return await scrape(queryParams);
};

export default {
  performScraping,
}