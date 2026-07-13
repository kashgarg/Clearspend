class CreateOverallBudgets < ActiveRecord::Migration[7.2]
  def change
    create_table :overall_budgets do |t|
      t.references :user, null: false, foreign_key: true, index: { unique: true }
      t.decimal :monthly_limit, null: false, precision: 10, scale: 2

      t.timestamps
    end
  end
end
