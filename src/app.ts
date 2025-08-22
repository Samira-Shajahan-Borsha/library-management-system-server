import express, { Application, NextFunction, Request, Response } from "express";
import routes from "./app/routes";
import cors from "cors";

const app: Application = express();

app.use(express.json());

app.use(cors());

app.use("/api", routes);

app.get("/", (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      message: "Welcome to Library management system",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      error,
    });
  }
});

// Not found route middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    error: `Cannot ${req.method} ${req.originalUrl}`,
  });
  next();
});

app.use((err: unknown, req: Request, res: Response, _next: NextFunction) => {
  res.status(500).send("Something broke!");
});

export default app;
