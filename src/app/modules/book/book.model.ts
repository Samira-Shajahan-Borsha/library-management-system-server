import { model, Schema } from "mongoose";
import { BookStaticModel, IBook } from "./book.interface";

const bookSchema = new Schema<IBook, BookStaticModel>(
  {
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
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

bookSchema.pre("findOneAndUpdate", function (next) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const update = this.getUpdate() as any;

  // console.log(update, "update from pre hook");

  if (update.copies !== undefined) {
    update.available = update.copies > 0;
    this.setUpdate(update);
  }

  next();
});

// Update book availablity when book copies become 0
bookSchema.static(
  "updateBookAvailability",
  async function updateBookAvailability(bookId) {
    if (bookId) {
      const book = await Book.findById(bookId);
      if (book?.copies === 0) {
        await Book.findByIdAndUpdate(
          bookId,
          { available: false },
          { new: true }
        );
      }
    }
  }
);

bookSchema.static("checkBookAvailability", async function (bookId, quantity) {
  const book = await this.findById(bookId);
  // console.log(book, "checkBookAvailability from Book static method");

  if (book?.available && book?.copies >= quantity) return true;
  return false;
});

export const Book = model<IBook, BookStaticModel>("book", bookSchema);
