module Api
  class CategoryBudgetsController < ApplicationController
    include Concerns::MonthRange

    def update
      category = Category.find(params[:category_id])
      budget = category.budget || category.build_budget
      month_range = resolve_month_range

      if budget.update(budget_params)
        spent = category.spent_in(month_range).to_f
        monthly_limit = budget.monthly_limit.to_f

        render json: {
          id: category.id,
          name: category.name,
          spent: spent,
          budget: {
            id: budget.id,
            monthly_limit: monthly_limit,
            remaining: (monthly_limit - spent).round(2)
          }
        }
      else
        render json: { errors: budget.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def budget_params
      params.require(:budget).permit(:monthly_limit)
    end
  end
end
