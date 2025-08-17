import { Router } from "express";
import { borrowController } from "./borrow.controller";

const borrowRoutes = Router();

borrowRoutes.post("/", borrowController.borrowBook);

export default borrowRoutes;