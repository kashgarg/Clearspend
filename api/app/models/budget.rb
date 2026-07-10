class Budget < ApplicationRecord
  belongs_to :category

  validates :monthly_limit, presence: true, numericality: { greater_than: 0 }
  validates :category_id, uniqueness: true
end
