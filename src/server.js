import express, { json } from "express";
import cors from "cors";
import mongoose from "mongoose";
import reportsRouter from "./routes/reports.js";

const app = express();
const PORT = 3000;

mongoose.connect("mongodb://localhost/reports");
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected to Mongo Database"));

app.use(json());
app.use(cors());

app.use("/reports", reportsRouter);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
