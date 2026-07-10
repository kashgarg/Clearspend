module Api
  class TransactionsController < ApplicationController
    def index
      transactions = Transaction.includes(:account, :category).order(date: :desc, created_at: :desc)
      transactions = transactions.where(category_id: params[:category_id]) if params[:category_id].present?
      transactions = transactions.where(date: month_range) if params[:month].present?

      render json: transactions.map { |transaction| transaction_json(transaction) }
    end

    def create
      transaction = Transaction.new(transaction_params)

      if transaction.save
        render json: transaction_json(transaction), status: :created
      else
        render json: { errors: transaction.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def transaction_params
      params.require(:transaction).permit(:account_id, :category_id, :amount, :merchant, :date)
    end

    def month_range
      year, month = params[:month].to_s.split("-").map(&:to_i)
      Date.new(year, month, 1).all_month
    rescue ArgumentError, TypeError
      Date.current.all_month
    end

    def transaction_json(transaction)
      {
        id: transaction.id,
        amount: transaction.amount.to_f,
        merchant: transaction.merchant,
        date: transaction.date,
        account_id: transaction.account_id,
        category_id: transaction.category_id,
        account: {
          id: transaction.account.id,
          name: transaction.account.name,
          account_type: transaction.account.account_type
        },
        category: {
          id: transaction.category.id,
          name: transaction.category.name
        }
      }
    end
  end
end
