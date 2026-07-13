module Api
  class OverallBudgetsController < ApplicationController
    def update
      user = User.find_by!(email: "demo@clearspend.app")
      overall = user.overall_budget || user.build_overall_budget

      if overall.update(overall_budget_params)
        render json: {
          id: overall.id,
          monthly_limit: overall.monthly_limit.to_f
        }
      else
        render json: { errors: overall.errors.full_messages }, status: :unprocessable_entity
      end
    end

    private

    def overall_budget_params
      params.require(:overall_budget).permit(:monthly_limit)
    end
  end
end
