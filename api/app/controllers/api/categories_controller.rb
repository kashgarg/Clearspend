module Api
  class CategoriesController < ApplicationController
    def index
      month_range = resolve_month_range
      categories = Category.includes(:budget).order(:name)

      render json: categories.map { |category| category_json(category, month_range) }
    end

    private

    def resolve_month_range
      if params[:month].present?
        year, month = params[:month].to_s.split("-").map(&:to_i)
        Date.new(year, month, 1).all_month
      else
        Date.current.all_month
      end
    rescue ArgumentError, TypeError
      Date.current.all_month
    end

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
