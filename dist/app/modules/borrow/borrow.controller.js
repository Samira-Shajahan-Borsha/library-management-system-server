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
exports.borrowController = void 0;
const borrow_model_1 = require("./borrow.model");
const book_model_1 = require("../book/book.model");
const zod_1 = __importDefault(require("zod"));
const borrowBookSchema = zod_1.default.object({
    book: zod_1.default.string(),
    quantity: zod_1.default.number().min(1, "Quantity must be at least 1"),
    dueDate: zod_1.default.string().refine((dateStr) => {
        const dueDate = new Date(dateStr);
        if (isNaN(dueDate.getTime()))
            return false;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);
        return dueDate >= today;
    }, {
        message: "Due date must be a valid date in YYYY-MM-DD or ISO format and cannot be in the past",
    }),
});
const borrowBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const payload = req.body;
        yield borrowBookSchema.parseAsync(payload);
        const bookFound = yield book_model_1.Book.findById(payload.book);
        if (!bookFound) {
            return res.status(404).json({
                success: false,
                message: "Book not found. Unable to borrow the book.",
                error: `No book exists in the database with ID: ${payload.book}`,
            });
        }
        const isBookAvailable = yield book_model_1.Book.checkBookAvailability(payload === null || payload === void 0 ? void 0 : payload.book, payload === null || payload === void 0 ? void 0 : payload.quantity);
        if (!isBookAvailable) {
            return res.status(409).json({
                success: false,
                message: "Insufficient copies available. Unable to borrow the book.",
                error: "No copies left for this book",
            });
        }
        const data = yield borrow_model_1.Borrow.create(payload);
        yield book_model_1.Book.updateBookAvailability(payload === null || payload === void 0 ? void 0 : payload.book);
        res.status(201).json({
            success: true,
            message: "Book borrowed successfully",
            data,
        });
    }
    catch (error) {
        return res.status(400).json({
            message: "Failed to borrow a book",
            success: false,
            error,
        });
    }
});
const getBorrowedBooksSummary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const summary = yield borrow_model_1.Borrow.aggregate([
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
    }
    catch (error) {
        // console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve borrowed books summary",
            error,
        });
    }
});
exports.borrowController = {
    borrowBook,
    getBorrowedBooksSummary,
};
