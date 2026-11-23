
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts'

import '../Analytics.css'

function Analytics({ scans }) {

  // Prepare the last 7 days of scan activity
  const activityData = Array.from({ length: 7 }, (_, index) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - index))

    const dayScans = scans.filter(scan => {
      const scanDate = new Date(Number(scan.id))

      return (
        scanDate.getDate() === date.getDate() &&
        scanDate.getMonth() === date.getMonth() &&
        scanDate.getFullYear() === date.getFullYear()
      )
    })

    return {
      day: date.toLocaleDateString('en-US', {
        weekday: 'short'
      }),
      scans: dayScans.length
    }
  })

  // Prepare risk distribution
  const riskData = [
    {
      name: 'Low Risk',
      value: scans.filter(scan => scan.level === 'Low').length
    },
    {
      name: 'Medium Risk',
      value: scans.filter(scan => scan.level === 'Medium').length
    },
    {
      name: 'High Risk',
      value: scans.filter(scan => scan.level === 'High').length
    }
  ]

  const COLORS = ['#4ce3a0', '#f4ca6b', '#ff667c']

  return (
    <section className="analytics-section">

      <div className="analytics-heading">
        <p>SECURITY INTELLIGENCE</p>
        <h2>Threat Analytics</h2>
        <span>Visual overview of your security scanning activity.</span>
      </div>

      <div className="analytics-grid">

        {/* Scan Activity Chart */}
        <div className="analytics-card">

          <div className="analytics-card-heading">
            <h3>Scan Activity</h3>
            <span>Last 7 days</span>
          </div>

          <ResponsiveContainer width="100%" height={270}>
            <BarChart data={activityData}>

              <CartesianGrid
                stroke="#25314e"
                strokeDasharray="4 4"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                stroke="#8290aa"
              />

              <YAxis
                allowDecimals={false}
                stroke="#8290aa"
              />

              <Tooltip
                contentStyle={{
                  backgroundColor: '#11182b',
                  border: '1px solid #354777',
                  borderRadius: '8px',
                  color: '#ffffff'
                }}
              />

              <Bar
                dataKey="scans"
                name="URLs scanned"
                fill="#7865ff"
                radius={[6, 6, 0, 0]}
              />

            </BarChart>
          </ResponsiveContainer>

        </div>

        {/* Risk Distribution Chart */}
        <div className="analytics-card">

          <div className="analytics-card-heading">
            <h3>Risk Distribution</h3>
            <span>All scans</span>
          </div>

          {scans.length === 0 ? (
            <div className="analytics-empty">
              No scan data available yet.
            </div>
          ) : (

            <ResponsiveContainer width="100%" height={270}>
              <PieChart>

                <Pie
                  data={riskData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  innerRadius={65}
                  outerRadius={95}
                  paddingAngle={5}
                  label
                >
                  {riskData.map((entry, index) => (
                    <Cell
                      key={entry.name}
                      fill={COLORS[index]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  contentStyle={{
                    backgroundColor: '#11182b',
                    border: '1px solid #354777',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />

                <Legend />

              </PieChart>
            </ResponsiveContainer>

          )}

        </div>

      </div>
    </section>
  )
}

export default Analytics
