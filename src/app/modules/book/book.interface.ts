import { Model } from "mongoose";

export interface IBook {
  title: string;
  author: string;
  genre:
    | "FICTION"
    | "NON_FICTION"
    | "SCIENCE"
    | "HISTORY"
    | "BIOGRAPHY"
    | "FANTASY";
  isbn: string;
  description: string;
  copies: number;
  available: boolean;
}

export interface BookStaticModel extends Model<IBook> {
  checkBookAvailability(bookId: string, quantity: number): Promise<boolean>;
  updateBookAvailability(bookId: string): Promise<any>;
}