Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :transactions, only: [:index, :create]
    resources :categories, only: [:index] do
      resource :budget, only: [:update], controller: "category_budgets"
    end
    resources :accounts, only: [:index]

    get "budget_summary", to: "budget_summaries#show"
    put "overall_budget", to: "overall_budgets#update"
  end
end
