import { z } from "zod";


export const blogZodSchema = z.object({
    title: z.string().min(1, "Title is required").max(150, "Title must be under 150 characters"),
    content: z.string().min(1, "Content is required").max(2000, "Content must be under 2000 characters"),
    authorName: z.string().min(1, "Author name is required").max(40, "Author name must be under 40 characters"),
    tags: z.array(z.string()).min(1, "At least one tags is required")
});