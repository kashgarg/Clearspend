# Demo data for Clearspend. Safe to re-run: clears transactions/budgets and
# rebuilds sample spend while keeping the demo user and accounts stable.

demo_user = User.find_or_create_by!(email: "demo@clearspend.app") do |user|
  user.name = "Wintr Skyes"
end

demo_user.update!(name: "Wintr Skyes") if demo_user.name != "Wintr Skyes"

checking = Account.find_or_create_by!(user: demo_user, name: "Checking") do |account|
  account.account_type = "checking"
end

credit_card = Account.find_or_create_by!(user: demo_user, name: "Credit Card") do |account|
  account.account_type = "credit_card"
end

category_budgets = {
  "Groceries" => 450,
  "Rent" => 1_800,
  "Subscriptions" => 80,
  "Dining Out" => 250,
  "Transport" => 150,
  "Utilities" => 200,
  "Entertainment" => 120,
  "Shopping" => 200
}

categories = category_budgets.map do |name, monthly_limit|
  category = Category.find_or_create_by!(name: name)
  budget = category.budget || category.build_budget
  budget.update!(monthly_limit: monthly_limit)
  category
end

Transaction.delete_all

today = Date.current
month_start = today.beginning_of_month
prev_month_start = (today - 1.month).beginning_of_month

sample_transactions = [
  # Current month
  [checking, "Groceries", 64.32, "FreshCo", month_start + 1],
  [checking, "Groceries", 48.90, "No Frills", month_start + 4],
  [credit_card, "Groceries", 72.15, "Loblaws", month_start + 8],
  [checking, "Groceries", 39.40, "Farm Boy", month_start + 12],
  [credit_card, "Groceries", 55.80, "Metro", month_start + 16],
  [checking, "Groceries", 28.75, "Corner Market", month_start + 20],
  [checking, "Rent", 1_800.00, "Maple Property Mgmt", month_start],
  [credit_card, "Subscriptions", 15.99, "Netflix", month_start + 2],
  [credit_card, "Subscriptions", 11.99, "Spotify", month_start + 2],
  [credit_card, "Subscriptions", 9.99, "iCloud", month_start + 3],
  [credit_card, "Subscriptions", 22.00, "Adobe", month_start + 5],
  [credit_card, "Dining Out", 42.50, "The Local Kitchen", month_start + 3],
  [credit_card, "Dining Out", 18.75, "Tim Hortons", month_start + 6],
  [credit_card, "Dining Out", 56.20, "Sushi Bar", month_start + 10],
  [checking, "Dining Out", 24.00, "Sweetgreen", month_start + 14],
  [credit_card, "Dining Out", 33.40, "Pizzeria Napoli", month_start + 18],
  [checking, "Transport", 3.35, "TTC", month_start + 1],
  [checking, "Transport", 3.35, "TTC", month_start + 5],
  [credit_card, "Transport", 48.00, "Uber", month_start + 7],
  [checking, "Transport", 120.00, "Presto Monthly", month_start + 1],
  [checking, "Utilities", 95.40, "Toronto Hydro", month_start + 9],
  [checking, "Utilities", 62.15, "Enbridge Gas", month_start + 11],
  [credit_card, "Entertainment", 28.00, "Cineplex", month_start + 13],
  [credit_card, "Entertainment", 45.00, "Concert Tickets", month_start + 17],
  [credit_card, "Shopping", 89.99, "Uniqlo", month_start + 4],
  [credit_card, "Shopping", 34.50, "Amazon", month_start + 15],
  [checking, "Shopping", 52.00, "Canadian Tire", month_start + 19],
  # Prior month (a bit of history)
  [checking, "Groceries", 58.20, "FreshCo", prev_month_start + 6],
  [credit_card, "Groceries", 71.40, "Loblaws", prev_month_start + 18],
  [checking, "Rent", 1_800.00, "Maple Property Mgmt", prev_month_start],
  [credit_card, "Subscriptions", 15.99, "Netflix", prev_month_start + 2],
  [credit_card, "Subscriptions", 11.99, "Spotify", prev_month_start + 2],
  [credit_card, "Dining Out", 38.00, "Burger Place", prev_month_start + 9],
  [credit_card, "Dining Out", 22.50, "Cafe Nero", prev_month_start + 21],
  [checking, "Transport", 120.00, "Presto Monthly", prev_month_start + 1],
  [checking, "Utilities", 88.00, "Toronto Hydro", prev_month_start + 10],
  [credit_card, "Entertainment", 16.99, "Steam", prev_month_start + 14],
  [credit_card, "Shopping", 64.00, "Winners", prev_month_start + 22]
]

categories_by_name = categories.index_by(&:name)

sample_transactions.each do |account, category_name, amount, merchant, date|
  Transaction.create!(
    account: account,
    category: categories_by_name.fetch(category_name),
    amount: amount,
    merchant: merchant,
    date: date
  )
end

puts "Seeded #{User.count} user, #{Account.count} accounts, #{Category.count} categories, " \
     "#{Budget.count} budgets, #{Transaction.count} transactions."
