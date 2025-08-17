import { Request, Response } from "express";
import { Borrow } from "./borrow.model";
import { Book } from "../book/book.model";
import z from "zod";

const borrowBookSchema = z.object({
  book: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  dueDate: z.string().refine(
    (dateStr) => {
      const dueDate = new Date(dateStr);
      if (isNaN(dueDate.getTime())) return false;

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate >= today;
    },
    {
      message:
        "Due date must be a valid date in YYYY-MM-DD or ISO format and cannot be in the past",
    }
  ),
});

const borrowBook = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    await borrowBookSchema.parseAsync(payload);

    const bookFound = await Book.findById(payload.book);
    if (!bookFound) {
      return res.status(404).json({
        success: false,
        message: "Book not found. Unable to borrow the book.",
        error: `No book exists in the database with ID: ${payload.book}`,
      });
    }

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

const getBorrowedBooksSummary = async (req: Request, res: Response) => {
  try {
    const summary = await Borrow.aggregate([
      {
        $group: {
          _id: "$book",
          totalQuantity: { $sum: "$quantity" },
        },
      },
      {
        $lookup: {
          from: "books",
          localField: "_id",
          foreignField: "_id",
          as: "bookDetails",
        },
      },
      { $unwind: "$bookDetails" },
      {
        $project: {
          _id: 0,
          book: {
            title: "$bookDetails.title",
            isbn: "$bookDetails.isbn",
          },
          totalQuantity: 1,
        },
      },
    ]);

    res.status(200).json({
      success: true,
      message: "Borrowed books summary retrieved successfully",
      data: summary,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve borrowed books summary",
      error,
    });
  }
};

export const borrowController = {
  borrowBook,
  getBorrowedBooksSummary,
};
