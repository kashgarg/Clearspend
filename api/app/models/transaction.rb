class Transaction < ApplicationRecord
  belongs_to :account
  belongs_to :category

  validates :amount, presence: true, numericality: { greater_than: 0 }
  validates :merchant, presence: true
  validates :date, presence: true
end
