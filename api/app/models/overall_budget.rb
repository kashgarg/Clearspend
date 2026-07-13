class OverallBudget < ApplicationRecord
  belongs_to :user

  validates :monthly_limit, presence: true, numericality: { greater_than: 0 }
  validates :user_id, uniqueness: true
end
