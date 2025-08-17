import mongoose from "mongoose";
import app from "./app";
import { config } from "./app/config";

async function main() {
  try {
    await mongoose.connect(config.DATABSE_URL as string);
    console.log("✅ Connected to database");
    app.listen(config.PORT, () => {
      console.log(`✅ Server is running on port: ${config.PORT}`);
    });
  } catch (error: unknown) {
    console.log("❌ Error from server: ", error);
  }
}

main();
