import { Request, Response } from "express";
import { HttpStatus } from "../protocols/error.types";
import ChatService from "../services/chat.service";

export default class ChatController {

  static async talk(req: Request, res: Response) {
    const response = await ChatService.talk(req.body.message, req.body.userId, req.file);
    return res.status(HttpStatus.CREATED).send(response);
  }
}