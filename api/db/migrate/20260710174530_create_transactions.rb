class CreateTransactions < ActiveRecord::Migration[7.2]
  def change
    create_table :transactions do |t|
      t.references :account, null: false, foreign_key: true
      t.references :category, null: false, foreign_key: true
      t.decimal :amount, null: false, precision: 10, scale: 2
      t.string :merchant, null: false
      t.date :date, null: false

      t.timestamps
    end

    add_index :transactions, :date
  end
end
