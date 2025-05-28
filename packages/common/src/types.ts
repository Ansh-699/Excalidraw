import z from 'zod';


export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20).optional(),
    password: z.string().min(6).max(100),
    email: z.string().email(),
});


export const SigninSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(100),
});

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20),
});