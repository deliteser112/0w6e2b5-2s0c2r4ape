import express from 'express';
import bodyParser from 'body-parser';
import scraperRoutes from './routes';
import scraperService from './services/scraperService';


const host = process.env.HOST ?? 'localhost';
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

const app = express();

app.use(bodyParser.json());
app.use('/', scraperRoutes);

app.listen(3000, () => {
  console.log(`[ ready ] http://${host}:${port}`);
});
