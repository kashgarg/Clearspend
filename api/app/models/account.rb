class Account < ApplicationRecord
  belongs_to :user
  has_many :transactions, dependent: :destroy

  validates :name, presence: true
  validates :account_type, presence: true
end
