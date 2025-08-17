import { Router } from "express";
import bookRoutes from "../modules/book/book.routes";
import borrowRoutes from "../modules/borrow/borrow.routes";

const routes = Router();

routes.use("/books", bookRoutes);
routes.use("/borrow", borrowRoutes);

export default routes;