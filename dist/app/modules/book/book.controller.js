"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookController = void 0;
const book_model_1 = require("./book.model");
const zod_1 = __importDefault(require("zod"));
const createBookZodSchema = zod_1.default.object({
    title: zod_1.default.string(),
    author: zod_1.default.string(),
    genre: zod_1.default.enum([
        "FICTION",
        "NON_FICTION",
        "SCIENCE",
        "HISTORY",
        "BIOGRAPHY",
        "FANTASY",
    ]),
    isbn: zod_1.default.string(),
    description: zod_1.default.string().optional(),
    copies: zod_1.default.number().min(0, "Copies must be a positive number"),
    available: zod_1.default.boolean().optional(),
});
const updateBookZodSchema = createBookZodSchema.partial();
const createBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        yield createBookZodSchema.parseAsync(payload);
        const data = yield book_model_1.Book.create(payload);
        res.status(201).json({
            success: true,
            message: "Book created successfully",
            data,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Failed to create a book",
            success: false,
            error,
        });
    }
});
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { filter, sort = "desc", limit } = req.query;
        // console.log(filter);
        const query = filter ? { genre: filter } : {};
        const sortDir = sort === "asc" ? 1 : -1;
        const limitValue = limit ? Number(limit) : 10;
        const data = yield book_model_1.Book.find(query)
            .sort({ createdAt: sortDir })
            .limit(limitValue);
        res.status(200).json({
            success: true,
            message: "Books retrieved successfully",
            data,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve books",
            error,
        });
    }
});
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const data = yield book_model_1.Book.findById(bookId);
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve book",
            error,
        });
    }
});
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const payload = req.body;
        yield updateBookZodSchema.parseAsync(payload);
        const data = yield book_model_1.Book.findByIdAndUpdate(bookId, payload, {
            new: true,
            runValidators: true,
        });
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
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to update book",
            error,
        });
    }
});
const deleteBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { bookId } = req.params;
        const deletedBook = yield book_model_1.Book.findByIdAndDelete(bookId);
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
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete book.",
            error,
        });
    }
});
exports.bookController = {
    createBook,
    getAllBooks,
    getBookById,
    updateBook,
    deleteBookById,
};
