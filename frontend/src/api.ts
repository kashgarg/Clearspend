import type { Account, Category, CreateTransactionInput, Transaction } from './types'

const API_BASE_URL = 'http://localhost:3000/api'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
    ...init,
  })

  if (!response.ok) {
    let message = `Request failed with ${response.status}`
    try {
      const payload = (await response.json()) as { errors?: string[] }
      if (payload.errors?.length) message = payload.errors.join(', ')
    } catch {
      // keep default message
    }
    throw new Error(message)
  }

  return response.json() as Promise<T>
}

export function fetchCategories(month?: string): Promise<Category[]> {
  const query = month ? `?month=${encodeURIComponent(month)}` : ''
  return request<Category[]>(`/categories${query}`)
}

export function fetchTransactions(options?: {
  month?: string
  categoryId?: number
}): Promise<Transaction[]> {
  const params = new URLSearchParams()
  if (options?.month) params.set('month', options.month)
  if (options?.categoryId != null) params.set('category_id', String(options.categoryId))
  const query = params.toString() ? `?${params}` : ''
  return request<Transaction[]>(`/transactions${query}`)
}

export function fetchAccounts(): Promise<Account[]> {
  return request<Account[]>('/accounts')
}

export function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  return request<Transaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify({ transaction: input }),
  })
}
