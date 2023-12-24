import { z } from 'zod';

export const registerSchema = z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    gender: z.string().refine(g => ['male', 'female'].includes(g), {
      message: 'Gender must be either "male" or "female"',
    }),
    password: z.string().min(8),
    repeatpassword: z.string(),
  }).refine(data => data.password === data.repeatpassword, {
    message: 'Passwords do not match',
  });

  export type registerSchemaType = z.infer<typeof registerSchema>