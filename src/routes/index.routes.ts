import { Router } from "express";
import ChatRouter from "./chat.routes";

const MainRouter = Router();
MainRouter.use(ChatRouter);
MainRouter.get("/health", (req, res) => {
    res.status(200).send("Server is up and running");
});
export default MainRouter;