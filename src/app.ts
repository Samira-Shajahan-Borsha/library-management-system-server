import express, { Application, NextFunction, Request, Response } from "express";
import routes from "./app/routes";

const app: Application = express();

app.use(express.json());

app.use("/api", routes);

app.get("/", (req: Request, res: Response, next: NextFunction) => {
  try {
    res.status(200).json({
      success: true,
      message: "Welcome to Library management system",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
    next();
  }
});

export default app;
