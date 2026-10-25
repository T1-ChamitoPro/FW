import React, { useEffect, useState } from 'react'
import type { Categoria, NuevaTransaccionDTO, TipoTransaccion } from '../../types/database'
import { categoryService } from '../../services/categoryService'

interface TransactionFormProps {
  onSubmit: (data: NuevaTransaccionDTO) => Promise<void>
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [tipo, setTipo] = useState<TipoTransaccion>('EGRESO')
  const [monto, setMonto] = useState<string>('')
  const [categoriaId, setCategoriaId] = useState<number | ''>('')
  const [fecha, setFecha] = useState<string>(new Date().toISOString().slice(0, 10))
  const [descripcion, setDescripcion] = useState<string>('')
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await categoryService.getCategories(tipo)
        setCategorias(data)
        if (data.length > 0) {
          setCategoriaId(data[0].idCategoria)
        } else {
          setCategoriaId('')
        }
      } catch (err) {
        console.error('Error cargando categorías:', err)
      }
    }
    loadCategories()
  }, [tipo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!monto || Number(monto) <= 0 || !categoriaId) return

    setLoading(true)
    try {
      await onSubmit({
        monto: Number(monto),
        descripcion,
        fecha,
        idCategoria: Number(categoriaId),
        tipo,
      })
      setMonto('')
      setDescripcion('')
    } catch (err) {
      console.error('Error al guardar movimiento:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-card card">
      <h3 className="chart-title">Nuevo Movimiento</h3>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <div className="type-toggle">
            <button
              type="button"
              className={`type-btn ${tipo === 'EGRESO' ? 'active expense' : ''}`}
              onClick={() => setTipo('EGRESO')}
            >
              Gasto
            </button>
            <button
              type="button"
              className={`type-btn ${tipo === 'INGRESO' ? 'active income' : ''}`}
              onClick={() => setTipo('INGRESO')}
            >
              Ingreso
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">MONTO</label>
          <input
            type="number"
            step="0.01"
            className="form-input"
            placeholder="0.00"
            value={monto}
            onChange={(e) => setMonto(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">CATEGORÍA</label>
          <select
            className="form-select"
            value={categoriaId}
            onChange={(e) => setCategoriaId(Number(e.target.value))}
            required
          >
            {categorias.map((cat, idx) => (
              <option key={cat.idCategoria ?? `cat-${idx}`} value={cat.idCategoria}>
                {cat.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">FECHA</label>
          <input
            type="date"
            className="form-input"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">DESCRIPCIÓN</label>
          <input
            type="text"
            className="form-input"
            placeholder="Detalle (opcional)"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
          {loading ? 'Añadiendo...' : 'Añadir Transacción'}
        </button>
      </form>
    </div>
  )
}