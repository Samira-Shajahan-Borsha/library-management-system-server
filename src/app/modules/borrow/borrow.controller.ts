import { Request, Response } from "express";
import { Borrow } from "./borrow.model";
import { Book } from "../book/book.model";

const borrowBook = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    const isBookAvailable = await Book.checkBookAvailability(
      payload?.book,
      payload?.quantity
    );

    if (!isBookAvailable) {
      return res.status(409).json({
        success: false,
        message: "Insufficient copies available. Unable to borrow the book.",
        error: "No copies left for this book",
      });
    }

    const data = await Borrow.create(payload);

    await Book.updateBookAvailability(payload?.book);

    res.status(201).json({
      success: true,
      message: "Book borrowed successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to borrow a book",
      success: false,
      error,
    });
  }
};

export const borrowController = {
  borrowBook,
};
