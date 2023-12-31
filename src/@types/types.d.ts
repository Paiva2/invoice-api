export type NewUser = {
  username: string
  password: string
  email: string
  total_balance?: string
}

export type User = {
  id: number | string
  username: string
  email: string
  hashed_password: string
  total_balance?: string
  totalInvoices?: number
}

export type JwtSchema = {
  auth: {
    id: number
    email: string
  }
  iat: number
  exp: number
}

export type UpdateUserProfileSchema = {
  email: string
  username?: string
  total_balance?: string
}

type ItemList = {
  id?: string
  item_name: string
  quantity: string
  price: string
  fkitemlistowner?: string
  total?: int
}

export type InvoiceSchema = {
  id?: string
  street_from: string
  city_from: string
  zipcode_from: string
  country_from: string
  name_to: string
  email_to: string
  street_to: string
  city_to: string
  zipcode_to: string
  country_to: string
  invoice_date: string
  status: string
  fkinvoiceowner: string
  item_list?: ItemList[] | QueryResult<ItemList[]>
}
