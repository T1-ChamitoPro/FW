import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts'
import { formatCurrency } from '../../utils/formatters'

interface CategoryData {
  name: string
  value: number
}

interface DashboardChartsProps {
  categoryData: CategoryData[]
  totalIngresos: number
  totalGastos: number
}

const COLORS = ['#22d3ee', '#f59e0b', '#10b981', '#ec4899', '#8b5cf6', '#3b82f6']

export const DashboardCharts = ({ categoryData, totalIngresos, totalGastos }: DashboardChartsProps) => {
  const barData = [
    { name: 'Ingresos', monto: totalIngresos, fill: '#10b981' },
    { name: 'Gastos', monto: totalGastos, fill: '#ef4444' },
  ]

  return (
    <div className="charts-row">
      {/* Gastos por Categoría */}
      <div className="chart-card card">
        <h3 className="chart-title">Gastos por Categoría</h3>
        <div style={{ height: '220px' }}>
          {categoryData.length === 0 ? (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--neutral-500)', fontSize: '0.85rem' }}>
              Sin gastos registrados este mes
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value">
                  {categoryData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--neutral-900)', borderColor: 'var(--neutral-700)', borderRadius: '8px', color: '#fff' }}
                  formatter={(value) => [formatCurrency(Number(value) || 0), 'Monto'] as [string, string]} 
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Ingresos vs Gastos */}
      <div className="chart-card card">
        <h3 className="chart-title">Ingresos vs Gastos</h3>
        <div style={{ height: '220px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
              <XAxis dataKey="name" stroke="var(--neutral-400)" tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: 'var(--neutral-900)', borderColor: 'var(--neutral-700)', borderRadius: '8px', color: '#fff' }}
                formatter={(value) => [formatCurrency(Number(value) || 0), 'Total'] as [string, string]} 
              />
              <Bar dataKey="monto" radius={[8, 8, 0, 0]} barSize={48} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}