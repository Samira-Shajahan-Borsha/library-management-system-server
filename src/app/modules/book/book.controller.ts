import { Request, Response } from "express";
import { Book } from "./book.model";
import z from "zod";

const createBookZodSchema = z.strictObject({
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
  copies: z.number().min(0, "Copies must be a positive number"),
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
  } catch (error: any) {
    return res.status(400).json({
      message: "Failed to create a book",
      success: false,
      error,
    });
  }
};

export const bookController = {
  createBook,
};
