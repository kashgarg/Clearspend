module Api
  class BudgetSummariesController < ApplicationController
    include Concerns::MonthRange

    def show
      user = demo_user
      month_range = resolve_month_range
      spent = Transaction.joins(:account)
                         .where(accounts: { user_id: user.id }, date: month_range)
                         .sum(:amount)
                         .to_f
      overall = user.overall_budget
      monthly_limit = overall&.monthly_limit&.to_f

      render json: {
        month: month_param(month_range),
        spent: spent,
        monthly_limit: monthly_limit,
        remaining: monthly_limit ? (monthly_limit - spent).round(2) : nil,
        overall_budget: overall && {
          id: overall.id,
          monthly_limit: monthly_limit
        }
      }
    end

    private

    def demo_user
      User.find_by!(email: "demo@clearspend.app")
    end
  end
end
