Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    resources :transactions, only: [:index, :create]
    resources :categories, only: [:index]
    resources :accounts, only: [:index]
  end
end
