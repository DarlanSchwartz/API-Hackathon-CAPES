import { Router } from "express";
import validateSchema from "@/middlewares/validateSchema.middleware";
import PostSchema from "@/schemas/posts.schemas";
import PostController from "@/controllers/posts.controller";

const postsRouter = Router();


export default postsRouter;