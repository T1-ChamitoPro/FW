import { useState } from 'react'
import { formatCurrency } from '../../utils/formatters'

interface BudgetCardProps {
  totalGastos: number
  limitePresupuesto: number
  onUpdateLimit: (nuevoLimite: number) => Promise<void>
}

export const BudgetCard = ({ totalGastos, limitePresupuesto, onUpdateLimit }: BudgetCardProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const [nuevoLimite, setNuevoLimite] = useState<string>('')
  const [loading, setLoading] = useState(false)

  const porcentaje = limitePresupuesto > 0 
    ? Math.min(Math.round((totalGastos / limitePresupuesto) * 100), 100) 
    : 0

  const handleStartEditing = () => {
    setNuevoLimite(String(limitePresupuesto))
    setIsEditing(true)
  }

  const handleSave = async () => {
    const val = Number(nuevoLimite)
    if (isNaN(val) || val <= 0) return

    setLoading(true)
    try {
      await onUpdateLimit(val)
      setIsEditing(false)
    } catch (err) {
      console.error('Error al actualizar límite:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="budget-card card">
      <div className="budget-header">
        <div>
          <h3 className="budget-title">Presupuesto Mensual</h3>
          <p className="budget-subtitle">Gastos acumulados este mes</p>
        </div>

        {isEditing ? (
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              type="number"
              className="form-input"
              style={{ width: '150px', padding: '0.35rem 0.6rem' }}
              value={nuevoLimite}
              onChange={(e) => setNuevoLimite(e.target.value)}
              disabled={loading}
              autoFocus
            />
            <button 
              onClick={handleSave} 
              className="btn btn-primary btn-sm"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar'}
            </button>
            <button 
              onClick={() => setIsEditing(false)} 
              className="btn btn-ghost btn-sm"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        ) : (
          <button onClick={handleStartEditing} className="btn btn-ghost btn-sm">
            Editar límite ({formatCurrency(limitePresupuesto)})
          </button>
        )}
      </div>

      <div className="budget-bar-track">
        <div 
          className="budget-bar-fill" 
          style={{ 
            width: `${porcentaje}%`,
            background: porcentaje > 90 
              ? 'linear-gradient(90deg, #ef4444, #f59e0b)' 
              : 'linear-gradient(90deg, var(--primary-500), var(--accent-400))'
          }} 
        />
      </div>

      <div className="budget-meta">
        <span>{formatCurrency(totalGastos)} ({porcentaje}%)</span>
        <span>Límite {formatCurrency(limitePresupuesto)}</span>
      </div>
    </div>
  )
}