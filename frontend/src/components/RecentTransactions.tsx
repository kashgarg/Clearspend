import type { Category, Transaction } from '../types'
import { formatDate, formatMoney } from '../lib/format'
import { CategoryFilter } from './CategoryFilter'

type RecentTransactionsProps = {
  transactions: Transaction[]
  categories: Category[]
  selectedCategoryId: number | null
  onCategoryFilterChange: (categoryId: number | null) => void
}

export function RecentTransactions({
  transactions,
  categories,
  selectedCategoryId,
  onCategoryFilterChange,
}: RecentTransactionsProps) {
  const recent = transactions.slice(0, 12)
  const selectedName = categories.find((category) => category.id === selectedCategoryId)?.name

  return (
    <section className="transactions-section">
      <div className="section-heading section-heading--row">
        <div>
          <h2>Recent</h2>
          <p>
            {selectedName
              ? `Showing ${selectedName} this month`
              : 'Latest activity across your accounts'}
          </p>
        </div>
        <CategoryFilter
          categories={categories}
          selectedCategoryId={selectedCategoryId}
          onChange={onCategoryFilterChange}
        />
      </div>

      {recent.length === 0 ? (
        <p className="empty">
          {selectedName
            ? `No ${selectedName} transactions this month.`
            : 'No transactions this month yet.'}
        </p>
      ) : (
        <ul className="transaction-list">
          {recent.map((transaction, index) => (
            <li
              key={transaction.id}
              className="transaction-row"
              style={{ animationDelay: `${index * 35}ms` }}
            >
              <div className="transaction-main">
                <span className="transaction-merchant">{transaction.merchant}</span>
                <span className="transaction-meta">
                  {transaction.category.name} · {formatDate(transaction.date)}
                </span>
              </div>
              <span className="transaction-amount">
                {formatMoney(transaction.amount)}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
