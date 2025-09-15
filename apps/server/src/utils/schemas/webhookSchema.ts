import { Methods } from 'prisma/generated/enums';
import z from 'zod';

export const validWebHook = z.object({
    title: z.string(),
    method: z.enum(Methods),
    header: z.string(),
    path: z.string().optional(),
    secret: z.string().optional() ,
})