import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type Props = {
  data: Record<string, number>
}

const COLORS = ["#6366f1", "#22c55e", "#f97316"]

const DifficultyChart = ({ data }: Props) => {
  const chartData = Object.entries(data).map(([key, value]) => ({
    name: key,
    value,
  }))

  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        Difficulty Distribution
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export default DifficultyChart
