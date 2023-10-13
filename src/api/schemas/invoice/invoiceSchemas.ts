import { z } from "zod"

export const registerNewInvoiceSchema = z.object({
  city_from: z.string().min(1),
  country_from: z.string().min(1),
  street_from: z.string().min(1),
  zipcode_from: z.string().min(1),
  city_to: z.string().min(1),
  country_to: z.string().min(1),
  email_to: z.string().min(1),
  name_to: z.string().min(1),
  street_to: z.string().min(1),
  zipcode_to: z.string().min(1),
  invoice_date: z.string().min(1),
  status: z.enum(["pending", "draft"]),
  item_list: z
    .array(
      z.object({
        item_name: z.string().min(1),
        quantity: z.string().min(1),
        price: z.string().min(1),
      })
    )
    .min(1),
})

export const updateInvoiceStatusSchema = z.object({
  newStatus: z.enum(["paid", "pending", "draft"]),
  invoiceId: z.string().min(1),
})

export const deleteUserInvoiceSchema = z.object({
  invoiceId: z.string().min(1),
})

export const updateInvoiceSchema = z.object({
  invoiceId: z.string().min(6, { message: "Invalid invoice id." }),
  city_from: z.string().optional(),
  country_from: z.string().optional(),
  street_from: z.string().optional(),
  zipcode_from: z.string().optional(),
  city_to: z.string().optional(),
  country_to: z.string().optional(),
  email_to: z.string().optional(),
  name_to: z.string().optional(),
  street_to: z.string().optional(),
  zipcode_to: z.string().optional(),
  invoice_date: z.string().optional(),
  item_list: z
    .array(
      z.object({
        id: z.string().optional(),
        item_name: z.string().min(1),
        quantity: z.string().min(1),
        price: z.string().min(1),
      })
    )
    .nonempty(),
})
