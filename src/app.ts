import express, { Application, json } from "express";
import "express-async-errors";
import cors from 'cors';
import ErrorCatcher from "@/middlewares/errors.middleware";
import MainRouter from "./routes/index.routes";
import OpenAI from "openai";
const openai = new OpenAI();

const app = express();

app.use(cors());
app.use(json());
app.use(MainRouter);
// app.use(ErrorCatcher);
const PORT = process.env.PORT || 5000;

async function startChatGPT() {
  // const completion = await openai.chat.completions.create({
  //   model: "gpt-3.5-turbo",
  //   messages: [
  //     { role: "system", content: "You are a helpful assistant." },
  //     {
  //       role: "user",
  //       content: "How many stars are in the Milky Way?",
  //     },
  //   ],
  // });
  // console.log(JSON.stringify(completion, null, 2));
}


app.listen(PORT, () => {
  console.log(`--------------- Server is up and running on port ${PORT}`);
  startChatGPT();
});