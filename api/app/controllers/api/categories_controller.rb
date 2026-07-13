module Api
  class CategoriesController < ApplicationController
    include Concerns::MonthRange

    def index
      month_range = resolve_month_range
      categories = Category.includes(:budget).order(:name)

      render json: categories.map { |category| category_json(category, month_range) }
    end

    private

    def category_json(category, month_range)
      spent = category.spent_in(month_range).to_f
      monthly_limit = category.budget&.monthly_limit&.to_f

      {
        id: category.id,
        name: category.name,
        spent: spent,
        budget: category.budget && {
          id: category.budget.id,
          monthly_limit: monthly_limit,
          remaining: monthly_limit ? (monthly_limit - spent).round(2) : nil
        }
      }
    end
  end
end
