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
  city_from: z.string(),
  country_from: z.string(),
  street_from: z.string(),
  zipcode_from: z.string(),
  city_to: z.string(),
  country_to: z.string(),
  email_to: z.string(),
  name_to: z.string(),
  street_to: z.string(),
  zipcode_to: z.string(),
  invoice_date: z.string(),
  item_list: z.array(
    z.object({
      id: z.string().nullable(),
      item_name: z.string(),
      quantity: z.string(),
      price: z.string(),
    })
  ),
})
