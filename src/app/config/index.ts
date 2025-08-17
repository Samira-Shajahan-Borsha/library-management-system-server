import dotenv from "dotenv";
import path from "path";

// console.log(process.cwd());
dotenv.config({ path: path.join(process.cwd(), ".env") });

export const config = {
  PORT: process.env.PORT,
  DATABSE_URL: process.env.DATABSE_URl,
};
