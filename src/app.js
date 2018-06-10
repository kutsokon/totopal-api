import chalk from "chalk";
import express from "express";
import mongoose from "mongoose";
import { Routes } from "./routes";

const app = express();
const PORT = process.env.PORT || 3000;
const mongoURI = "mongodb://localhost:27017/totopal";

mongoose.connect(mongoURI);
mongoose.connection.on("error", err => {
  console.error(err);
  console.log(
    "%s MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

app.use(express.json());
app.use("/v1", Routes);

app.listen(PORT, () => {
  console.log(`this server is listening on ${PORT}`);
});
