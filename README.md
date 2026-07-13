# Clearspend

A full-stack budgeting app with a Ruby on Rails API and a React/TypeScript dashboard. Log transactions, see spend vs. budget by category, and keep an eye on where the month is going.

## Features

- Active Record models on PostgreSQL: users, accounts, categories, budgets, overall budgets, transactions
- REST JSON API for accounts, categories (with live spend totals), transactions, and budget planning
- Set an overall monthly spending goal and editable per-category budget limits
- Dashboard with budget progress bars and a Recharts spend-by-category chart
- Transaction form with optimistic UI updates
- Category filter on the recent transactions list

## Stack

| Layer | Tech |
| --- | --- |
| API | Ruby on Rails (API mode), Active Record |
| Database | PostgreSQL |
| Frontend | React, TypeScript, Vite, Recharts |

## Project layout

```
Clearspend/
├── api/          # Rails API
├── frontend/     # Vite + React + TypeScript
└── README.md
```

## Prerequisites

- **Ruby 3.3** (Homebrew `ruby@3.3`)
- **PostgreSQL 14** (Homebrew `postgresql@14`)
- **Node 20** (via nvm)

### Ruby (Homebrew)

`ruby@3.3` is keg-only. Add it to your PATH (e.g. in `~/.zshrc`):

```bash
export PATH="/opt/homebrew/opt/ruby@3.3/bin:/opt/homebrew/lib/ruby/gems/3.3.0/bin:$PATH"
```

Then confirm:

```bash
ruby -v   # => ruby 3.3.x
gem -v
```

### PostgreSQL

```bash
brew services start postgresql@14
pg_isready -h localhost   # => accepting connections
```

You may also want Postgres tools on your PATH:

```bash
export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH"
```

### Node

```bash
nvm use 20
node -v   # => v20.x
npm -v
```

## Running the API

```bash
cd api
bundle install
bin/rails db:prepare
bin/rails db:seed
bin/rails server
```

The API listens on [http://localhost:3000](http://localhost:3000).

Useful endpoints:

- `GET /api/accounts`
- `GET /api/categories?month=YYYY-MM`
- `GET /api/transactions?month=YYYY-MM&category_id=`
- `POST /api/transactions`
- `GET /api/budget_summary?month=YYYY-MM`
- `PUT /api/overall_budget`
- `PUT /api/categories/:id/budget`

## Running the frontend

In a second terminal:

```bash
cd frontend
nvm use 20
npm install
npm run dev
```

The app listens on [http://localhost:5173](http://localhost:5173).
