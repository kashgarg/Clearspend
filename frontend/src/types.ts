export type Account = {
  id: number
  name: string
  account_type: string
  user_id?: number
}

export type Budget = {
  id: number
  monthly_limit: number
  remaining: number | null
}

export type Category = {
  id: number
  name: string
  spent: number
  budget: Budget | null
}

export type Transaction = {
  id: number
  amount: number
  merchant: string
  date: string
  account_id: number
  category_id: number
  account: {
    id: number
    name: string
    account_type: string
  }
  category: {
    id: number
    name: string
  }
}

export type CreateTransactionInput = {
  account_id: number
  category_id: number
  amount: number
  merchant: string
  date: string
}
