import { z } from "zod";

const chat = z.object({
    message: z.string(),
    userId: z.string().uuid(),
});

const ChatSchemas = {
    chat,
};

export default ChatSchemas;