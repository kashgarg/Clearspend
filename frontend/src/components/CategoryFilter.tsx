import type { Category } from '../types'

type CategoryFilterProps = {
  categories: Category[]
  selectedCategoryId: number | null
  onChange: (categoryId: number | null) => void
}

export function CategoryFilter({
  categories,
  selectedCategoryId,
  onChange,
}: CategoryFilterProps) {
  return (
    <div className="category-filter">
      <label htmlFor="category-filter">Filter by category</label>
      <select
        id="category-filter"
        value={selectedCategoryId ?? ''}
        onChange={(event) => {
          const value = event.target.value
          onChange(value ? Number(value) : null)
        }}
      >
        <option value="">All categories</option>
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  )
}
