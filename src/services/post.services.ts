import { Post } from "@/protocols/post.types";

async function getAll(limit: number, name: string) {

}

async function create(post: Post): Promise<void> {

}

async function like(postId: number): Promise<void> {

}

async function update(postId: number, newPost: Post): Promise<void> {

}

async function remove(postId: number): Promise<void> {

}

const PostService = { getAll, create, like, remove, update };

export default PostService;