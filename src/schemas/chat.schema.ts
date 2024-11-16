import { z } from "zod";

const chat = z.object({
    message: z.string().min(1).max(1000),
});

const ChatSchemas = {
    chat,
};

export default ChatSchemas;