import { z } from "zod"

export const userRegisterSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must have at least 3 characters." }),
  email: z.string().min(3),
  password: z.string().min(6),
})

export const userLoginSchema = z.object({
  email: z.string().min(1),
  password: z.string().min(6),
})

export const userChangePasswordSchema = z.object({
  email: z.string().min(1),
  newPassword: z.string().min(6),
})

export const updateUserProfileSchema = z.object({
  username: z.string().min(1).nullable(),
  total_balance: z.string().nullable(),
})
