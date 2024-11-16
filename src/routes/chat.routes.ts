import { Router } from "express";
import validateRequest from "../middlewares/validateSchema.middleware";
import ChatController from "../controllers/chat.controller";
import ChatSchemas from "../schemas/chat.schema";

const ChatRouter = Router();

ChatRouter.post("/chat", validateRequest(ChatSchemas.chat), ChatController.talk);
export default ChatRouter;