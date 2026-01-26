import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

type Props = {
  data: Record<string, number>
}

const BloomChart = ({ data }: Props) => {
  const chartData = Object.entries(data).map(([key, value]) => ({
    bloom: key,
    count: value,
  }))

  return (
    <div className="bg-white p-5 rounded-xl border shadow-sm">
      <h3 className="text-sm font-semibold text-slate-700 mb-3">
        Bloom Level Distribution
      </h3>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="bloom" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export default BloomChart
