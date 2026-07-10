class Category < ApplicationRecord
  has_many :transactions, dependent: :restrict_with_error
  has_one :budget, dependent: :destroy

  validates :name, presence: true, uniqueness: true
end
