class Category < ApplicationRecord
  has_many :transactions, dependent: :restrict_with_error
  has_one :budget, dependent: :destroy

  validates :name, presence: true, uniqueness: true

  def spent_in(month_range)
    transactions.where(date: month_range).sum(:amount)
  end
end
