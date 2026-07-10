import type { Transaction } from '../types'
import { formatDate, formatMoney } from '../lib/format'

type RecentTransactionsProps = {
  transactions: Transaction[]
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  const recent = transactions.slice(0, 12)

  return (
    <section className="transactions-section">
      <div className="section-heading">
        <h2>Recent</h2>
        <p>Latest activity across your accounts</p>
      </div>

      {recent.length === 0 ? (
        <p className="empty">No transactions this month yet.</p>
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
