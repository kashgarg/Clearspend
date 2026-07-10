# Clearspend

A full-stack budgeting app: Ruby on Rails API + React/TypeScript frontend. Log transactions, track spend vs. budget by category, and see it on a clean dashboard.

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
bin/rails db:prepare
bin/rails db:seed
bin/rails server
```

The API listens on [http://localhost:3000](http://localhost:3000).
