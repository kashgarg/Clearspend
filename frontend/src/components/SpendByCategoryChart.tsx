import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { Category } from '../types'
import { formatMoney } from '../lib/format'

const CHART_COLORS = [
  '#1f6b52',
  '#3d8f72',
  '#5aa88a',
  '#2f5d4e',
  '#c4841d',
  '#b54a3a',
  '#6b7f76',
  '#8aa89a',
]

type SpendByCategoryChartProps = {
  categories: Category[]
}

type ChartSlice = {
  name: string
  value: number
}

function ChartTooltip({
  active,
  payload,
}: {
  active?: boolean
  payload?: Array<{ name: string; value: number }>
}) {
  if (!active || !payload?.length) return null
  const slice = payload[0]
  return (
    <div className="chart-tooltip">
      <strong>{slice.name}</strong>
      <span>{formatMoney(slice.value)}</span>
    </div>
  )
}

export function SpendByCategoryChart({ categories }: SpendByCategoryChartProps) {
  const data: ChartSlice[] = categories
    .filter((category) => category.spent > 0)
    .map((category) => ({
      name: category.name,
      value: Number(category.spent.toFixed(2)),
    }))
    .sort((a, b) => b.value - a.value)

  const total = data.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <section className="chart-section">
      <div className="section-heading">
        <h2>Spend mix</h2>
        <p>Where this month’s money went</p>
      </div>

      {data.length === 0 ? (
        <p className="empty">No spend to chart yet.</p>
      ) : (
        <div className="chart-layout">
          <div className="chart-canvas" aria-hidden="true">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={68}
                  outerRadius={100}
                  paddingAngle={2}
                  stroke="none"
                >
                  {data.map((slice, index) => (
                    <Cell
                      key={slice.name}
                      fill={CHART_COLORS[index % CHART_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            <div className="chart-center">
              <span className="chart-center-label">Total</span>
              <span className="chart-center-value">{formatMoney(total)}</span>
            </div>
          </div>

          <ul className="chart-legend">
            {data.map((slice, index) => (
              <li key={slice.name}>
                <span
                  className="chart-swatch"
                  style={{ background: CHART_COLORS[index % CHART_COLORS.length] }}
                />
                <span className="chart-legend-name">{slice.name}</span>
                <span className="chart-legend-value">{formatMoney(slice.value)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}
