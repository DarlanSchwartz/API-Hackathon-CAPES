import { Router } from "express";
import validateRequest from "../middlewares/validateSchema.middleware";
import ChatController from "../controllers/chat.controller";
import ChatSchemas from "../schemas/chat.schema";
import validateFiles from "../middlewares/validateFiles.middleware";

const ChatRouter = Router();

ChatRouter.post("/chat", validateRequest(ChatSchemas.chat), validateFiles(), ChatController.talk);
export default ChatRouter;