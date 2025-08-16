import { Router } from "express";
import { bookController } from "./book.controller";

const bookRoutes = Router();

bookRoutes.post("/", bookController.createBook);
bookRoutes.get("/", bookController.getAllBooks);
bookRoutes.get("/:bookId", bookController.getBookById);
bookRoutes.delete("/:bookId", bookController.deleteBookById);

export default bookRoutes;
