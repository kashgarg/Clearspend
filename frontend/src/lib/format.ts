export function formatMoney(amount: number) {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount)
}

export function currentMonth(): string {
  const now = new Date()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  return `${now.getFullYear()}-${month}`
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('en-CA', {
    month: 'short',
    day: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}
