import { formatCurrency } from '../../utils/formatters'

interface StatCardsProps {
  totalIngresos: number
  totalGastos: number
  balance: number
}

export const StatCards = ({ totalIngresos, totalGastos, balance }: StatCardsProps) => {
  return (
    <div className="summary-cards">
      <div className="summary-card income card">
        <div className="summary-label">
          <span>INGRESOS TOTALES</span>
          <span className="summary-badge">IN</span>
        </div>
        <div className="summary-value">{formatCurrency(totalIngresos)}</div>
      </div>

      <div className="summary-card expense card">
        <div className="summary-label">
          <span>GASTOS TOTALES</span>
          <span className="summary-badge">OUT</span>
        </div>
        <div className="summary-value">{formatCurrency(totalGastos)}</div>
      </div>

      <div className="summary-card balance card">
        <div className="summary-label">
          <span>BALANCE DISPONIBLE</span>
          <span className="summary-badge">NET</span>
        </div>
        <div className="summary-value">{formatCurrency(balance)}</div>
      </div>
    </div>
  )
}