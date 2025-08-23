import { Request, Response } from "express";
import { Book } from "./book.model";
import z from "zod";

const createBookZodSchema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
  ]),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number().min(1, "Copies must be a positive number"),
  available: z.boolean().optional(),
});

export const updateBookZodSchema = z.object({
  title: z.string().optional(),
  author: z.string().optional(),
  genre: z
    .enum([
      "FICTION",
      "NON_FICTION",
      "SCIENCE",
      "HISTORY",
      "BIOGRAPHY",
      "FANTASY",
    ])
    .optional(),
  isbn: z.string().optional(),
  description: z.string().optional(),
  copies: z.number().min(0, "Copies can not be a negative number").optional(),
  available: z.boolean().optional(),
});

const createBook = async (req: Request, res: Response) => {
  try {
    const payload = req.body;

    await createBookZodSchema.parseAsync(payload);

    const data = await Book.create(payload);

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data,
    });
  } catch (error) {
    return res.status(400).json({
      message: "Failed to create a book",
      success: false,
      error,
    });
  }
};

const getAllBooks = async (req: Request, res: Response) => {
  try {
    const { filter, sort = "desc", limit } = req.query;
    // console.log(filter);

    const query = filter ? { genre: filter } : {};

    const sortDir = sort === "asc" ? 1 : -1;

    const limitValue = limit ? Number(limit) : 10;

    const data = await Book.find(query)
      .sort({ createdAt: sortDir })
      .limit(limitValue);

    res.status(200).json({
      success: true,
      message: "Books retrieved successfully",
      data,
    });
  } catch (error: unknown) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve books",
      error,
    });
  }
};

const getBookById = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    const data = await Book.findById(bookId);

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Book not found",
        error: `No book exists in the database with the given ID: ${bookId}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Book retrieved successfully",
      data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to retrieve book",
      error,
    });
  }
};

const updateBook = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    const payload = req.body;

    await updateBookZodSchema.parseAsync(payload);

    const data = await Book.findOneAndUpdate({ _id: bookId }, payload, {
      new: true,
      runValidators: true,
    });

    // console.log(data, "data from update book");

    if (!data) {
      res.status(404).json({
        success: false,
        message: "Book not found. Unable to update",
        error: `No book exists in the database with the given ID: ${bookId}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update book",
      error,
    });
  }
};

const deleteBookById = async (req: Request, res: Response) => {
  try {
    const { bookId } = req.params;

    const deletedBook = await Book.findByIdAndDelete(bookId);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: "Book not found. Unable to delete.",
        error: `No book exists in the database with the given ID: ${bookId}`,
      });
    }

    res.status(200).json({
      success: true,
      message: "Book deleted successfully",
      data: null,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete book.",
      error,
    });
  }
};

export const bookController = {
  createBook,
  getAllBooks,
  getBookById,
  updateBook,
  deleteBookById,
};
