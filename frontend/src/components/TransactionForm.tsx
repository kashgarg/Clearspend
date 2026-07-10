import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Account, Category, CreateTransactionInput } from '../types'

type TransactionFormProps = {
  accounts: Account[]
  categories: Category[]
  submitting: boolean
  onSubmit: (input: CreateTransactionInput) => Promise<void>
}

export function TransactionForm({
  accounts,
  categories,
  submitting,
  onSubmit,
}: TransactionFormProps) {
  const today = new Date().toISOString().slice(0, 10)
  const [merchant, setMerchant] = useState('')
  const [amount, setAmount] = useState('')
  const [accountId, setAccountId] = useState(accounts[0]?.id ?? 0)
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? 0)
  const [date, setDate] = useState(today)
  const [formError, setFormError] = useState<string | null>(null)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const parsedAmount = Number(amount)
    if (!merchant.trim()) {
      setFormError('Enter a merchant.')
      return
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setFormError('Enter an amount greater than zero.')
      return
    }
    if (!accountId || !categoryId) {
      setFormError('Pick an account and category.')
      return
    }

    try {
      await onSubmit({
        merchant: merchant.trim(),
        amount: parsedAmount,
        account_id: accountId,
        category_id: categoryId,
        date,
      })
      setMerchant('')
      setAmount('')
      setDate(today)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save transaction.')
    }
  }

  return (
    <section className="form-section">
      <div className="section-heading">
        <h2>Add transaction</h2>
        <p>Log a purchase and watch budgets update right away</p>
      </div>

      <form className="transaction-form" onSubmit={handleSubmit}>
        <label>
          Merchant
          <input
            type="text"
            value={merchant}
            onChange={(event) => setMerchant(event.target.value)}
            placeholder="e.g. FreshCo"
            autoComplete="off"
            required
          />
        </label>

        <label>
          Amount
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="0.00"
            required
          />
        </label>

        <label>
          Category
          <select
            value={categoryId}
            onChange={(event) => setCategoryId(Number(event.target.value))}
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Account
          <select
            value={accountId}
            onChange={(event) => setAccountId(Number(event.target.value))}
          >
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </select>
        </label>

        <label>
          Date
          <input
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>

        <button type="submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Add transaction'}
        </button>

        {formError && <p className="form-error">{formError}</p>}
      </form>
    </section>
  )
}
