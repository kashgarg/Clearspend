import { useEffect, useState } from 'react'
import { fetchCategories, fetchTransactions } from './api'
import type { Category, Transaction } from './types'
import './App.css'

function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount)
}

function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const [nextCategories, nextTransactions] = await Promise.all([
          fetchCategories(),
          fetchTransactions(),
        ])
        if (!cancelled) {
          setCategories(nextCategories)
          setTransactions(nextTransactions)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load data')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="app">
      <header className="app-header">
        <h1>Clearspend</h1>
        <p>Budgeting that stays out of the way.</p>
      </header>

      {loading && <p className="status">Loading…</p>}
      {error && (
        <p className="status error">
          Couldn’t reach the API. Is <code>bin/rails server</code> running on port 3000?
        </p>
      )}

      {!loading && !error && (
        <div className="panels">
          <section>
            <h2>Categories</h2>
            <ul>
              {categories.map((category) => (
                <li key={category.id}>
                  <span>{category.name}</span>
                  <span>
                    {formatMoney(category.spent)}
                    {category.budget
                      ? ` / ${formatMoney(category.budget.monthly_limit)}`
                      : ''}
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>Recent transactions</h2>
            <ul>
              {transactions.slice(0, 10).map((transaction) => (
                <li key={transaction.id}>
                  <span>
                    {transaction.merchant}
                    <small>{transaction.category.name}</small>
                  </span>
                  <span>{formatMoney(transaction.amount)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
      )}
    </main>
  )
}

export default App
