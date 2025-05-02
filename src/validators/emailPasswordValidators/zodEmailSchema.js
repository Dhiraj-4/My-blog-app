import { z } from "zod";


export const zodEmailSchema = z.object({
    email: z.string().email({ message: 'Invalid email address' })
});