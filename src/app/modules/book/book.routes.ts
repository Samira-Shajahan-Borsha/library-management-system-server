import { Router } from "express";
import { bookController } from "./book.controller";

const bookRoutes = Router();

bookRoutes.post("/", bookController.createBook);

export default bookRoutes;