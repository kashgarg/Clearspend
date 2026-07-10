module Api
  class AccountsController < ApplicationController
    def index
      accounts = Account.joins(:user)
                        .where(users: { email: "demo@clearspend.app" })
                        .order(:name)

      render json: accounts.map { |account| account_json(account) }
    end

    private

    def account_json(account)
      {
        id: account.id,
        name: account.name,
        account_type: account.account_type,
        user_id: account.user_id
      }
    end
  end
end
