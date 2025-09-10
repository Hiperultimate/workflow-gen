import z from 'zod';

export const workflowPut = z.object({
    title: z.string().min(3),
    enabled: z.boolean(),
    nodes: z.json(),
    connections: z.json(),
})