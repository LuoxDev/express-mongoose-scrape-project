import { Express, Request, Response } from 'express';
import * as ProductController from '../Controllers/product.controller';
import { ScrapeLinks } from '../Enums/scrapeLinks.enum';
import * as ScrapeService from '../Services/scrape.service';

function routes(app: Express) {
  app.get('/', (req: Request, res: Response) => res.send('API is working houston'));

  app.get('/products/latest', ProductController.showLastTenProducts);

  app.post('/products', ProductController.createProduct);
}

export default routes;
