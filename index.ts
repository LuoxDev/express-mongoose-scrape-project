import express from 'express';
import routes from './Routes/routes';
import mongoose from 'mongoose';
import { scrapeLatestArticles, scrapeMostRecentProducts } from './Services/scrape.service';

const PORT = 8000;

const app = express();

app.use(express.json());

app.listen(PORT, async () => {
  console.log(`🎃 Backend 🧹: 🐺 https://localhost:${PORT} 🧙`);

  await connect();
  scrapeMostRecentProducts();
  routes(app);
});

async function connect() {
  const uri = 'mongodb://localhost:27017/database';

  try {
    await mongoose.connect(uri);
    console.log('> Mongodb : Connection established ✅');
  } catch (error) {
    console.log(`🚨 Error 🚨 ${error}`);
  }
}
