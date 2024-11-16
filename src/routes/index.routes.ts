import { Router } from "express";
import ChatRouter from "./chat.routes";

const MainRouter = Router();
MainRouter.use(ChatRouter);
export default MainRouter;