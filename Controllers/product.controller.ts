import {Request, Response} from 'express';
import Product, {IProduct} from '../Models/product.model';

export async function createProduct(req: Request, res: Response) {
    const product = new Product(req.body);

    product.save((error: any) => {
        if (error) {
            res.send(error);
        } else {
            res.send(product);
        }
    });
}

export async function showLastTenProducts(req: Request, res: Response) {
    const products = await Product.find().sort({createdAt: -1}).limit(10);

    if (products.length > 0) {
        res.send(products);
    } else {
        res.send('No products available');
    }
}

export async function importScrapedProducts(products: IProduct[]) {
    for (const product of products) {
        if (await validateScrapedProduct(product)) {
            product.save().catch(error => console.log(error));
            console.log('Product of type : ' + product.type + ' imported.')
        }
    }
}

async function validateScrapedProduct(product: IProduct) {
    const findProduct = await Product.find({name: product.name});
    return !!(!findProduct.length && product.name && product.type);
}
