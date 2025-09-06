import express from "express";
import router from "./src/Routes/user.routes.js";
import "dotenv/config";

import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(cookieParser());
app.use("/uploads", express.static("public/uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/job", router);
app.listen(process.env.PORT, async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_CONNECTION_STRING);
    console.log("server is starting");
  } catch (err) {
    console.log(`Error in starting server ${err}`);
  }
});
