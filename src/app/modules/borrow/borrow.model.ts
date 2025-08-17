import { model, Schema } from "mongoose";
import { IBorrow } from "./borrow.interface";
import { Book } from "../book/book.model";

const borrowSchema = new Schema<IBorrow>(
  {
    book: {
      type: Schema.Types.ObjectId,
      ref: "book",
      required: [true, "Book reference is required"],
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [1, "Quantity can not be less than 0"],
    },
    dueDate: {
      type: Date,
      required: [true, "Due date is required"],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

// Update the book copies before borrow a book
borrowSchema.pre("save", async function (next) {
  try {
    const book = await Book.findById(this.book);

    if (!book) {
      throw new Error("Book not found");
    }
    
    const copies = (book.copies as number) - this.quantity;
    await Book.findByIdAndUpdate(this.book, { copies }, { new: true });
    next();
  } catch (error) {
    console.log(error);
  }
});

export const Borrow = model<IBorrow>("borrow", borrowSchema);
