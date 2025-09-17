import { Methods } from '@workflow-gen/db';
import z from 'zod';

export const validWebHook = z.object({
    id: z.uuidv4(),
    title: z.string(),
    method: z.enum(Methods),
    header: z.string(),
    path: z.string().min(3),
    secret: z.string().optional() ,
})