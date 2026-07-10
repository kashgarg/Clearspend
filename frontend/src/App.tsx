import { useEffect, useState } from 'react'
import { fetchCategories, fetchTransactions } from './api'
import { BudgetProgressList } from './components/BudgetProgressList'
import { RecentTransactions } from './components/RecentTransactions'
import { currentMonth } from './lib/format'
import type { Category, Transaction } from './types'
import './App.css'

function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const month = currentMonth()

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const [nextCategories, nextTransactions] = await Promise.all([
          fetchCategories(month),
          fetchTransactions({ month }),
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
  }, [month])

  return (
    <main className="app">
      <header className="app-header">
        <h1 className="brand">Clearspend</h1>
        <p className="lede">Spend versus budget for {month}</p>
      </header>

      {loading && <p className="status">Loading your dashboard…</p>}
      {error && (
        <p className="status error">
          Couldn’t reach the API. Start it with <code>bin/rails server</code> in{' '}
          <code>api/</code>.
        </p>
      )}

      {!loading && !error && (
        <div className="dashboard">
          <BudgetProgressList categories={categories} />
          <RecentTransactions transactions={transactions} />
        </div>
      )}
    </main>
  )
}

export default App
