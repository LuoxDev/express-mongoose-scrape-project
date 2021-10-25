import { Request, Response } from 'express';
import Product, { IProduct } from '../Models/product.model';

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
  const products = await Product.find().sort({ createdAt: -1 }).limit(10);

  if (products.length > 0) {
    res.send(products);
  } else {
    res.send('No products available');
  }
}
