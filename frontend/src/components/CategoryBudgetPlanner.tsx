import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { Category } from '../types'
import { formatMoney } from '../lib/format'

type CategoryBudgetPlannerProps = {
  categories: Category[]
  savingCategoryId: number | null
  onSave: (categoryId: number, monthlyLimit: number) => Promise<void>
}

export function CategoryBudgetPlanner({
  categories,
  savingCategoryId,
  onSave,
}: CategoryBudgetPlannerProps) {
  const [drafts, setDrafts] = useState<Record<number, string>>({})
  const [errors, setErrors] = useState<Record<number, string>>({})

  useEffect(() => {
    const next: Record<number, string> = {}
    for (const category of categories) {
      next[category.id] = String(category.budget?.monthly_limit ?? '')
    }
    setDrafts(next)
  }, [categories])

  async function handleSave(event: FormEvent<HTMLFormElement>, categoryId: number) {
    event.preventDefault()
    setErrors((current) => {
      const next = { ...current }
      delete next[categoryId]
      return next
    })

    const parsed = Number(drafts[categoryId])
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setErrors((current) => ({
        ...current,
        [categoryId]: 'Enter a limit greater than zero.',
      }))
      return
    }

    try {
      await onSave(categoryId, parsed)
    } catch (err) {
      setErrors((current) => ({
        ...current,
        [categoryId]:
          err instanceof Error ? err.message : 'Could not save category budget.',
      }))
    }
  }

  return (
    <section className="category-planner-section">
      <div className="section-heading">
        <h2>Category limits</h2>
        <p>Set a recurring monthly budget for each category</p>
      </div>

      <ul className="category-planner-list">
        {categories.map((category) => {
          const limit = category.budget?.monthly_limit
          const saving = savingCategoryId === category.id

          return (
            <li key={category.id} className="category-planner-row">
              <div className="category-planner-info">
                <span className="budget-name">{category.name}</span>
                <span className="category-planner-spent">
                  Spent {formatMoney(category.spent)}
                  {limit != null ? ` of ${formatMoney(limit)}` : ''}
                </span>
              </div>

              <form
                className="category-planner-form"
                onSubmit={(event) => void handleSave(event, category.id)}
              >
                <label>
                  <span className="sr-only">Monthly limit for {category.name}</span>
                  <input
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={drafts[category.id] ?? ''}
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [category.id]: event.target.value,
                      }))
                    }
                    required
                  />
                </label>
                <button type="submit" disabled={saving}>
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </form>

              {errors[category.id] && (
                <p className="form-error">{errors[category.id]}</p>
              )}
            </li>
          )
        })}
      </ul>
    </section>
  )
}
