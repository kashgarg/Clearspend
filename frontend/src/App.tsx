import { useEffect, useState } from 'react'
import {
  createTransaction,
  fetchAccounts,
  fetchBudgetSummary,
  fetchCategories,
  fetchTransactions,
  updateCategoryBudget,
  updateOverallBudget,
} from './api'
import { BudgetProgressList } from './components/BudgetProgressList'
import { CategoryBudgetPlanner } from './components/CategoryBudgetPlanner'
import { OverallBudgetGoal } from './components/OverallBudgetGoal'
import { RecentTransactions } from './components/RecentTransactions'
import { SpendByCategoryChart } from './components/SpendByCategoryChart'
import { TransactionForm } from './components/TransactionForm'
import { currentMonth } from './lib/format'
import type {
  Account,
  BudgetSummary,
  Category,
  CreateTransactionInput,
  Transaction,
} from './types'
import './App.css'

function App() {
  const [categories, setCategories] = useState<Category[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [accounts, setAccounts] = useState<Account[]>([])
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtering, setFiltering] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [savingOverall, setSavingOverall] = useState(false)
  const [savingCategoryId, setSavingCategoryId] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)
  const month = currentMonth()

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError(null)
        const [nextCategories, nextTransactions, nextAccounts, nextSummary] =
          await Promise.all([
            fetchCategories(month),
            fetchTransactions({ month }),
            fetchAccounts(),
            fetchBudgetSummary(month),
          ])
        if (!cancelled) {
          setCategories(nextCategories)
          setTransactions(nextTransactions)
          setAccounts(nextAccounts)
          setBudgetSummary(nextSummary)
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

  useEffect(() => {
    if (loading) return

    let cancelled = false

    async function loadFilteredTransactions() {
      try {
        setFiltering(true)
        const nextTransactions = await fetchTransactions({
          month,
          categoryId: selectedCategoryId ?? undefined,
        })
        if (!cancelled) setTransactions(nextTransactions)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to filter transactions')
        }
      } finally {
        if (!cancelled) setFiltering(false)
      }
    }

    void loadFilteredTransactions()
    return () => {
      cancelled = true
    }
  }, [selectedCategoryId, month, loading])

  async function handleSaveOverallGoal(monthlyLimit: number) {
    setSavingOverall(true)
    try {
      const updated = await updateOverallBudget(monthlyLimit)
      setBudgetSummary((current) => {
        const spent = current?.spent ?? 0
        return {
          month,
          spent,
          monthly_limit: updated.monthly_limit,
          remaining: Number((updated.monthly_limit - spent).toFixed(2)),
          overall_budget: {
            id: updated.id,
            monthly_limit: updated.monthly_limit,
          },
        }
      })
    } finally {
      setSavingOverall(false)
    }
  }

  async function handleSaveCategoryBudget(categoryId: number, monthlyLimit: number) {
    setSavingCategoryId(categoryId)
    try {
      const updated = await updateCategoryBudget(categoryId, monthlyLimit, month)
      setCategories((current) =>
        current.map((category) => (category.id === categoryId ? updated : category)),
      )
    } finally {
      setSavingCategoryId(null)
    }
  }

  async function handleCreateTransaction(input: CreateTransactionInput) {
    const account = accounts.find((item) => item.id === input.account_id)
    const category = categories.find((item) => item.id === input.category_id)
    if (!account || !category) {
      throw new Error('Pick a valid account and category.')
    }

    const tempId = -Date.now()
    const optimistic: Transaction = {
      id: tempId,
      amount: input.amount,
      merchant: input.merchant,
      date: input.date,
      account_id: input.account_id,
      category_id: input.category_id,
      account: {
        id: account.id,
        name: account.name,
        account_type: account.account_type,
      },
      category: {
        id: category.id,
        name: category.name,
      },
    }

    const previousTransactions = transactions
    const previousCategories = categories
    const previousSummary = budgetSummary

    const matchesFilter =
      selectedCategoryId == null || selectedCategoryId === input.category_id
    const inCurrentMonth = input.date.startsWith(month)

    if (matchesFilter) {
      setTransactions((current) => [optimistic, ...current])
    }

    if (inCurrentMonth) {
      setCategories((current) =>
        current.map((item) => {
          if (item.id !== input.category_id) return item
          const spent = Number((item.spent + input.amount).toFixed(2))
          const monthlyLimit = item.budget?.monthly_limit
          return {
            ...item,
            spent,
            budget: item.budget
              ? {
                  ...item.budget,
                  remaining:
                    monthlyLimit != null
                      ? Number((monthlyLimit - spent).toFixed(2))
                      : null,
                }
              : null,
          }
        }),
      )

      setBudgetSummary((current) => {
        if (!current) return current
        const spent = Number((current.spent + input.amount).toFixed(2))
        const monthlyLimit = current.monthly_limit
        return {
          ...current,
          spent,
          remaining:
            monthlyLimit != null ? Number((monthlyLimit - spent).toFixed(2)) : null,
        }
      })
    }

    setSubmitting(true)
    try {
      const created = await createTransaction(input)
      if (matchesFilter) {
        setTransactions((current) =>
          current.map((item) => (item.id === tempId ? created : item)),
        )
      }
    } catch (err) {
      setTransactions(previousTransactions)
      setCategories(previousCategories)
      setBudgetSummary(previousSummary)
      throw err
    } finally {
      setSubmitting(false)
    }
  }

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
          <OverallBudgetGoal
            summary={budgetSummary}
            saving={savingOverall}
            onSave={handleSaveOverallGoal}
          />
          <CategoryBudgetPlanner
            categories={categories}
            savingCategoryId={savingCategoryId}
            onSave={handleSaveCategoryBudget}
          />
          <TransactionForm
            accounts={accounts}
            categories={categories}
            submitting={submitting}
            onSubmit={handleCreateTransaction}
          />
          <BudgetProgressList categories={categories} />
          <SpendByCategoryChart categories={categories} />
          <div className={filtering ? 'is-filtering' : undefined}>
            <RecentTransactions
              transactions={transactions}
              categories={categories}
              selectedCategoryId={selectedCategoryId}
              onCategoryFilterChange={setSelectedCategoryId}
            />
          </div>
        </div>
      )}
    </main>
  )
}

export default App
