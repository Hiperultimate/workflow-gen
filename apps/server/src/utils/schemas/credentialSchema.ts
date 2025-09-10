import { Platform } from 'prisma/generated/enums';
import z from 'zod';

export const crendentialCreateSchema = z.object({
    title: z.string().min(3),
    platform : z.enum(Platform),
    data: z.json(),
})