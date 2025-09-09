import z from "zod"

export const reqSignUp = z.object({
    email: z.email(),
    password : z.string().min(4).max(16),
})

