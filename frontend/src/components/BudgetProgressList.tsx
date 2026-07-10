import type { Category } from '../types'
import { formatMoney } from '../lib/format'

type BudgetProgressListProps = {
  categories: Category[]
}

function usageTone(ratio: number) {
  if (ratio >= 1) return 'over'
  if (ratio >= 0.8) return 'warn'
  return 'ok'
}

export function BudgetProgressList({ categories }: BudgetProgressListProps) {
  return (
    <section className="budget-section">
      <div className="section-heading">
        <h2>This month</h2>
        <p>Spend against each category budget</p>
      </div>

      <ul className="budget-list">
        {categories.map((category, index) => {
          const limit = category.budget?.monthly_limit ?? 0
          const ratio = limit > 0 ? category.spent / limit : 0
          const width = Math.min(ratio * 100, 100)
          const tone = usageTone(ratio)

          return (
            <li
              key={category.id}
              className="budget-row"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className="budget-row-top">
                <span className="budget-name">{category.name}</span>
                <span className="budget-amounts">
                  {formatMoney(category.spent)}
                  <span className="budget-limit">
                    {limit > 0 ? ` / ${formatMoney(limit)}` : ''}
                  </span>
                </span>
              </div>
              <div
                className="budget-track"
                role="progressbar"
                aria-valuemin={0}
                aria-valuemax={limit || 100}
                aria-valuenow={category.spent}
                aria-label={`${category.name} budget`}
              >
                <div
                  className={`budget-fill budget-fill--${tone}`}
                  style={{ width: `${width}%` }}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
