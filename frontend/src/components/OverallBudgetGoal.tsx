import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { BudgetSummary } from '../types'
import { formatMoney } from '../lib/format'

type OverallBudgetGoalProps = {
  summary: BudgetSummary | null
  saving: boolean
  onSave: (monthlyLimit: number) => Promise<void>
}

function usageTone(ratio: number) {
  if (ratio >= 1) return 'over'
  if (ratio >= 0.8) return 'warn'
  return 'ok'
}

export function OverallBudgetGoal({ summary, saving, onSave }: OverallBudgetGoalProps) {
  const [limitInput, setLimitInput] = useState('')
  const [formError, setFormError] = useState<string | null>(null)

  useEffect(() => {
    if (summary?.monthly_limit != null) {
      setLimitInput(String(summary.monthly_limit))
    }
  }, [summary?.monthly_limit])

  const limit = summary?.monthly_limit ?? 0
  const spent = summary?.spent ?? 0
  const ratio = limit > 0 ? spent / limit : 0
  const width = Math.min(ratio * 100, 100)
  const tone = usageTone(ratio)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setFormError(null)

    const parsed = Number(limitInput)
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setFormError('Enter a monthly goal greater than zero.')
      return
    }

    try {
      await onSave(parsed)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Could not save overall goal.')
    }
  }

  return (
    <section className="overall-budget-section">
      <div className="section-heading">
        <h2>Overall monthly goal</h2>
        <p>Your total spending target for the month</p>
      </div>

      <div className="overall-budget-progress">
        <div className="budget-row-top">
          <span className="budget-name">All spending</span>
          <span className="budget-amounts">
            {formatMoney(spent)}
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
          aria-valuenow={spent}
          aria-label="Overall monthly budget"
        >
          <div
            className={`budget-fill budget-fill--${tone}`}
            style={{ width: `${width}%` }}
          />
        </div>
        {summary?.remaining != null && (
          <p className="overall-remaining">
            {summary.remaining >= 0
              ? `${formatMoney(summary.remaining)} left this month`
              : `${formatMoney(Math.abs(summary.remaining))} over goal`}
          </p>
        )}
      </div>

      <form className="overall-budget-form" onSubmit={handleSubmit}>
        <label>
          Monthly goal
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={limitInput}
            onChange={(event) => setLimitInput(event.target.value)}
            required
          />
        </label>
        <button type="submit" disabled={saving}>
          {saving ? 'Saving…' : 'Save goal'}
        </button>
        {formError && <p className="form-error">{formError}</p>}
      </form>
    </section>
  )
}
