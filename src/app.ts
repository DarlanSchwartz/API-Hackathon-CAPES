import express, { json } from "express";
import "express-async-errors";
import cors from 'cors';
import MainRouter from "./routes/index.routes";
import errorHandler from "./middlewares/errors.middleware";
const app = express();

app.use(cors());
app.use(json());
app.use(MainRouter);
app.use(errorHandler);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`--------------- Server is up and running on port ${PORT}`);
});