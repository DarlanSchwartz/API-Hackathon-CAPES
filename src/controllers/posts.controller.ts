import { Request, Response } from "express";
import PostService from "@/services/post.services";
import { HttpStatus } from "@/protocols/error.types";

async function getAll(req: Request, res: Response) {

  return res.send();
}

async function create(req: Request, res: Response) {
  return res.sendStatus(HttpStatus.CREATED);
}

async function edit(req: Request, res: Response) {
  return res.sendStatus(HttpStatus.ACCEPTED);
}

async function remove(req: Request, res: Response) {
  return res.sendStatus(HttpStatus.ACCEPTED);
}

const PostController = { getAll, create, edit, remove };

export default PostController;