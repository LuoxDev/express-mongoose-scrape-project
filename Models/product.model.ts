import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  type: string;
  name: string;
  image: string;
  rating: string;
  productPage: string;
}

export const ProductSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    name: { type: String, required: true },
    image: String,
    rating: String,
    productPage: String,
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>('Product', ProductSchema);
export default Product;
