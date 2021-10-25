import mongoose from 'mongoose';

export interface IArticle extends mongoose.Document {
  source: string;
  title: string;
  image: string;
  description: string;
}

const ArticleSchema = new mongoose.Schema(
  {
    source: { type: String, required: true },
    title: { type: String, required: true },
    image: String,
    description: String,
  },
  {
    timestamps: true,
  }
);

const Article = mongoose.model<IArticle>('Article', ArticleSchema);

export default Article;
