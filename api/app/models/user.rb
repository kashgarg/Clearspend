class User < ApplicationRecord
  has_many :accounts, dependent: :destroy
  has_one :overall_budget, dependent: :destroy

  validates :name, presence: true
  validates :email, presence: true, uniqueness: true
end
