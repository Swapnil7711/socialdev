import { z } from 'zod';


const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;


export const registerSchema = z.object({
    email: z.string().email(),
    firstName: z.string(),
    lastName: z.string(),
    gender: z.string().refine(g => ['male', 'female'].includes(g), {
      message: 'Gender must be either "male" or "female"',
    }),
    password: z.string().refine(password => passwordRegex.test(password), {
      message: 'Password must have at least one uppercase letter, one lowercase letter, one special character, and one number',
    }),
    repeatpassword: z.string(),
  }).refine(data => data.password === data.repeatpassword, {
    message: 'Passwords do not match',
  });

  export type registerSchemaType = z.infer<typeof registerSchema>