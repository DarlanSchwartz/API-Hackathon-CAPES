import db from "@/database/database.connection";
import { Post } from "@/protocols/post.types";

async function create(post: Post) {

}

async function getAll(limit: number, name: string) {

}


async function edit(newPost: Post, postId: number) {

}

async function remove(postId: number) {

}

const PostRepository = { create, getAll, edit, remove };

export default PostRepository;
