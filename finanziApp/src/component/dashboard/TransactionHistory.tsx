import React, { useState } from 'react'
import type { Categoria, Transaccion } from '../../types/database'
import { formatCurrency, formatDate } from '../../utils/formatters'

interface TransactionHistoryProps {
  transacciones: Transaccion[]
  categorias: Categoria[]
  onDelete: (id: number) => Promise<void>
  onExportCSV: () => void
}

export const TransactionHistory: React.FC<TransactionHistoryProps> = ({
  transacciones,
  categorias,
  onDelete,
  onExportCSV,
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<string>('TODOS')
  const [filterCategory, setFilterCategory] = useState<string>('TODAS')

  const filteredTransactions = transacciones.filter((t) => {
    const catObj = t.categoria || t.CATEGORIA
    const matchSearch = (t.descripcion || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchType = filterType === 'TODOS' || catObj?.tipo === filterType
    const matchCat = filterCategory === 'TODAS' || t.idCategoria === Number(filterCategory)
    return matchSearch && matchType && matchCat
  })

  return (
    <div className="history-card card">
      <div className="history-header">
        <div>
          <h3 className="chart-title" style={{ margin: 0 }}>Historial Reciente</h3>
          <p className="history-count">Mostrando {filteredTransactions.length} de {transacciones.length}</p>
        </div>
        <button onClick={onExportCSV} className="btn btn-secondary btn-sm">
          Exportar CSV
        </button>
      </div>

      <div className="history-filters">
        <input
          type="text"
          className="form-input"
          placeholder="Buscar descripción..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="form-select filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="TODOS">Todos los tipos</option>
          <option value="INGRESO">Ingresos</option>
          <option value="EGRESO">Gastos</option>
        </select>

        <select
          className="form-select filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="TODAS">Todas las cat.</option>
          {categorias.map((cat, idx) => (
            <option key={cat.idCategoria ?? `cat-filter-${idx}`} value={cat.idCategoria}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>FECHA</th>
              <th>CATEGORÍA</th>
              <th>DESCRIPCIÓN</th>
              <th style={{ textAlign: 'right' }}>MONTO</th>
              <th style={{ textAlign: 'center' }}>ACCIÓN</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={5} className="empty-row">
                  No se encontraron transacciones.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((t) => {
                const catObj = t.categoria || t.CATEGORIA
                const esIngreso = catObj?.tipo === 'INGRESO'
                return (
                  <tr key={t.idTransaccion}>
                    <td>{formatDate(t.fecha)}</td>
                    <td>
                      <span className="category-pill">{catObj?.nombre || 'General'}</span>
                    </td>
                    <td className="desc-cell">{t.descripcion || '—'}</td>
                    <td style={{ textAlign: 'right' }} className={esIngreso ? 'amount-income' : 'amount-expense'}>
                      {esIngreso ? `+${formatCurrency(t.monto)}` : `-${formatCurrency(t.monto)}`}
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      <button onClick={() => onDelete(t.idTransaccion)} className="btn-delete">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}