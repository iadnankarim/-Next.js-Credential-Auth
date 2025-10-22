import { z } from 'zod';

export const formSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Name must be at least 2 character long' })
    .max(50, { message: 'Name cannot exceed 50 character' }),

  //   email: z.string().email({ message: 'Please Enter a valid email address' }).min(2).max(50),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' })
    .min(5, { message: 'Email must be at least 5 characters long' })
    .max(50, { message: 'Email cannot exceed 50 characters' }),

  password: z
    .string()
    .min(8, { message: 'Name must be at least 8 character long' })
    .max(50, { message: 'Name cannot exceed 50 character' }),
});

export const signInFormSchema = formSchema.pick({
  email: true,
  password: true,
});
