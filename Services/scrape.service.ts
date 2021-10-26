import puppeteer from 'puppeteer';
import {productTypes} from '../Enums/productTypes.enum';
import {ScrapeLinks} from '../Enums/scrapeLinks.enum';
import Product, {IProduct} from '../Models/product.model';
import Article from '../Models/article.model';

export async function scrapeMostRecentProducts() {
  //Currently grabbing 5 most recent products
  const numberOfProducts = 5;
  const tweakersNumber = calcTweakersNumber(numberOfProducts);
  const browser = await puppeteer.launch();
  const types = Object.values(productTypes);
  const products: IProduct[] = [];

  const page = await browser.newPage();
  await page.goto('https://tweakers.net/');
  await acceptTweakersCookieForm(page);

  for (let indexOfTypes in types) {
    await page.goto(ScrapeLinks[types[indexOfTypes]]);
    for (let indexOfProducts = 1; indexOfProducts <= tweakersNumber; indexOfTypes) {
      const product = await getProductByTypeAndNumber(page, types[indexOfTypes], indexOfProducts);
      products.push(product);
      if (isNumberOdd(indexOfProducts) || indexOfProducts === 1) {
        indexOfProducts += 2;
      } else {
        indexOfProducts++;
      }
    }
  }
}

export async function scrapeLatestArticles() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const articles = [
    await getLatestArticleFromGameRant(page),
    await getLatestArticleFromGamespot(page),
    await getLatestArticleFromPcgamer(page),
  ];

  console.log(articles);
}

async function getProductByTypeAndNumber(page: puppeteer.Page, type: productTypes, number: number) {
  const [el] = await page.$x(`//*[@id="compareProductListing"]/table/tbody/tr[${number}]/td[1]/a/img`);
  const elItem = await el?.getProperty('src');
  const imgSrc = await elItem?.jsonValue();

  const [el2] = await page.$x(
    `/html/body/div[4]/div/div/div[2]/div/div[2]/div[3]/form/table/tbody/tr[${number}]/td[2]/p[1]/a`
  );
  const el2Item = await el2?.getProperty('textContent');
  const name = await el2Item?.jsonValue();

  const [el3] = await page.$x(
    `/html/body/div[4]/div/div/div[2]/div/div[2]/div[3]/form/table/tbody/tr[${number}]/td[5]/p[1]/a/span`
  );
  const el3Item = await el3?.getProperty('textContent');
  const score = await el3Item?.jsonValue();

  const [el4] = await page.$x(
    `/html/body/div[4]/div/div/div[2]/div/div[2]/div[3]/form/table/tbody/tr[${number}]/td[6]/p[2]/a`
  );
  const el4Item = await el4?.getProperty('href');
  const productPage = (await el4Item?.jsonValue()) + '/specificaties/';

  return new Product({
    type: type,
    name: name,
    image: imgSrc,
    rating: score,
    productPage: productPage,
  });
}

async function getLatestArticleFromGameRant(page: puppeteer.Page) {
  const source = 'https://gamerant.com/gaming/';
  await page.goto(source);

  const [el] = await page.$x(
    `/html/body/div[2]/div[4]/div/div[2]/section/div[2]/article[1]/a/div/figure/picture/source[1]`
  );
  const elItem = await el?.getProperty('srcset');
  const image = await elItem?.jsonValue();

  const [el2] = await page.$x(`/html/body/div[2]/div[4]/div/div[2]/section/div[2]/article[1]/h3/a`);
  const el2Item = await el2?.getProperty('textContent');
  const title = await el2Item?.jsonValue();

  const [el3] = await page.$x(`/html/body/div[2]/div[4]/div/div[2]/section/div[2]/article[1]/p`);
  const el3Item = await el3?.getProperty('textContent');
  const description = await el3Item?.jsonValue();

  return new Article({
    source: source,
    title: title,
    image: image,
    description: description,
  });
}

async function getLatestArticleFromGamespot(page: puppeteer.Page) {
  const source = 'https://www.gamespot.com/news/';
  await page.goto(source);

  const [el] = await page.$x(`//*[@id="wrapper"]/section/a[1]/div[1]/div/img`);
  const elItem = await el?.getProperty('src');
  const image = await elItem?.jsonValue();

  const [el2] = await page.$x(`//*[@id="wrapper"]/section/a[1]/div[2]/div/summary/h2`);
  const el2Item = await el2?.getProperty('textContent');
  const title = await el2Item?.jsonValue();

  const [el3] = await page.$x(`//*[@id="wrapper"]/section/a[1]/div[2]/div/summary/span`);
  const el3Item = await el3?.getProperty('textContent');
  const description = await el3Item?.jsonValue();

  return new Article({
    source: source,
    title: title,
    image: image,
    description: description,
  });
}

async function getLatestArticleFromPcgamer(page: puppeteer.Page) {
  const source = 'https://www.pcgamer.com/news/';
  await page.goto(source);

  const [el] = await page.$x(
    `//*[@id="content"]/section/div/div[2]/a[1]/article/div[1]/figure/div/div/picture/source[1]`
  );
  const elItem = await el?.getProperty('srcset');
  const image = await elItem?.jsonValue();

  const [el2] = await page.$x(`//*[@id="content"]/section/div/div[2]/a[1]/article/div[2]/header/h3`);
  const el2Item = await el2?.getProperty('textContent');
  const title = await el2Item?.jsonValue();

  const [el3] = await page.$x(`//*[@id="content"]/section/div/div[2]/a[1]/article/div[2]/p/text()`);
  const el3Item = await el3?.getProperty('textContent');
  const description = await el3Item?.jsonValue();

  return new Article({
    source: source,
    title: title,
    image: image,
    description: description,
  });
}

async function acceptTweakersCookieForm(page: puppeteer.Page): Promise<void> {
  const cookieAcceptBtn = await page.$('#cookieAcceptForm > button');
  await cookieAcceptBtn?.click().then(() => page.waitForTimeout(1000));
}

function calcTweakersNumber(number: number): number {
  return number + Math.floor(number / 2) + 1;
}

function isNumberOdd(number: number): boolean {
  return number % 2 == 0;
}
