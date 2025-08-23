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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Book = void 0;
const mongoose_1 = require("mongoose");
const bookSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, "Title is required"],
        trim: true,
    },
    author: {
        type: String,
        required: [true, "Author is required"],
        trim: true,
    },
    genre: {
        type: String,
        required: [true, "Genre is required"],
        enum: {
            values: [
                "FICTION",
                "NON_FICTION",
                "SCIENCE",
                "HISTORY",
                "BIOGRAPHY",
                "FANTASY",
            ],
            message: "{VALUE} is not acceptable",
        },
    },
    isbn: {
        type: String,
        unique: [true, "ISBN must be unique. This value already exists."],
        required: [true, "ISBN is required"],
    },
    description: {
        type: String,
        default: "",
    },
    copies: {
        type: Number,
        required: [true, "Copies is required"],
        min: [0, "Copies can not be a negative number"],
    },
    available: {
        type: Boolean,
        default: true,
    },
}, {
    versionKey: false,
    timestamps: true,
});
bookSchema.pre("findOneAndUpdate", function (next) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const update = this.getUpdate();
    // console.log(update, "update from pre hook");
    if (update.copies !== undefined) {
        update.available = update.copies > 0;
        this.setUpdate(update);
    }
    next();
});
// Update book availablity when book copies become 0
bookSchema.static("updateBookAvailability", function updateBookAvailability(bookId) {
    return __awaiter(this, void 0, void 0, function* () {
        if (bookId) {
            const book = yield exports.Book.findById(bookId);
            if ((book === null || book === void 0 ? void 0 : book.copies) === 0) {
                yield exports.Book.findByIdAndUpdate(bookId, { available: false }, { new: true });
            }
        }
    });
});
bookSchema.static("checkBookAvailability", function (bookId, quantity) {
    return __awaiter(this, void 0, void 0, function* () {
        const book = yield this.findById(bookId);
        // console.log(book, "checkBookAvailability from Book static method");
        if ((book === null || book === void 0 ? void 0 : book.available) && (book === null || book === void 0 ? void 0 : book.copies) >= quantity)
            return true;
        return false;
    });
});
exports.Book = (0, mongoose_1.model)("book", bookSchema);
