import express from 'express';
import routes from './Routes/routes';
import mongoose from 'mongoose';
import {scrapeMostRecentProductsFromTweakers} from './Services/scrape.service';


const PORT = 8000;

const app = express();

app.use(express.json());

app.listen(PORT, async () => {
    console.log(`๐ Backend ๐งน: ๐บ https://localhost:${PORT} ๐ง`);

    await connect();
    await scrapeMostRecentProductsFromTweakers();
    routes(app);
});

async function connect() {
    const uri = 'mongodb://localhost:27017/database';

    try {
        await mongoose.connect(uri);
        console.log('> Mongodb : Connection established โ');
    } catch (error) {
        console.log(`๐จ Error ๐จ ${error}`);
    }
}
