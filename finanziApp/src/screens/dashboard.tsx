import { useEffect, useState} from 'react'
import { useAuth } from '../hooks/useAuth'
import { transactionService } from '../services/transactionService'
import { userService } from '../services/userService'
import { categoryService } from '../services/categoryService'
import type { Categoria, NuevaTransaccionDTO, Transaccion } from '../types/database'
import { exportTransactionsToCSV } from '../utils/csvExport'

import { StatCards } from '../component/dashboard/StatCards'
import { BudgetCard } from '../component/dashboard/BudgetCard' 
import { DashboardCharts } from '../component/charts/DashboardChart' 
import { TransactionForm } from '../component/dashboard/TransactionForm' 
import { TransactionHistory } from '../component/dashboard/TransactionHistory' 

export default function Dashboard() {
  const { profile, refreshProfile, signOut } = useAuth()
  const [transacciones, setTransacciones] = useState<Transaccion[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [loading, setLoading] = useState(true)

  // Carga inicial al montar el perfil
  useEffect(() => {
    if (!profile) return

    let isMounted = true

    const loadInitialData = async () => {
      try {
        const [txData, catData] = await Promise.all([
          transactionService.getTransactions(profile.idUsuario),
          categoryService.getCategories(),
        ])

        if (isMounted) {
          setTransacciones(txData)
          setCategorias(catData)
        }
      } catch (err) {
        console.error('Error cargando datos iniciales:', err)
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

  loadInitialData()

    return () => {
      isMounted = false
    }
  }, [profile])

// Función reutilizable para refrescar datos desde handlers (sin interferir con el ciclo inicial)
  const refreshData = async () => {
    if (!profile) return
    try {
      const [txData, catData] = await Promise.all([
        transactionService.getTransactions(profile.idUsuario),
        categoryService.getCategories(),
      ])
      setTransacciones(txData)
      setCategorias(catData)
    } catch (err) {
      console.error('Error cargando datos del dashboard:', err)
    }
  }

useEffect(() => {
  if (!profile) return

  let isMounted = true

  const loadInitialData = async () => {
    try {
      const [txData, catData] = await Promise.all([
        transactionService.getTransactions(profile.idUsuario),
        categoryService.getCategories(),
      ])

      if (isMounted) {
        setTransacciones(txData)
        setCategorias(catData)
      }
    } catch (err) {
      console.error('Error cargando datos iniciales:', err)
    } finally {
      if (isMounted) {
        setLoading(false)
      }
    }
  }

  loadInitialData()

  return () => {
    isMounted = false
  }
}, [profile])

  const totalIngresos = transacciones
    .filter((t) => t.categoria?.tipo === 'INGRESO')
    .reduce((acc, curr) => acc + Number(curr.monto), 0)

  const totalGastos = transacciones
    .filter((t) => t.categoria?.tipo === 'EGRESO')
    .reduce((acc, curr) => acc + Number(curr.monto), 0)

  const balance = totalIngresos - totalGastos

  const categoryDataMap = transacciones
    .filter((t) => t.categoria?.tipo === 'EGRESO')
    .reduce((acc: { [key: string]: number }, curr) => {
      const catName = curr.categoria?.nombre || 'Otros'
      acc[catName] = (acc[catName] || 0) + Number(curr.monto)
      return acc
    }, {})

  const categoryData = Object.entries(categoryDataMap).map(([name, value]) => ({
    name,
    value,
  }))

  const handleCreateTransaction = async (data: NuevaTransaccionDTO) => {
    if (!profile) return
    await transactionService.createTransaction(profile.idUsuario, data)
    await refreshData()
  }

  const handleDeleteTransaction = async (id: number) => {
    await transactionService.deleteTransaction(id)
    await refreshData()
  }

  const handleUpdateLimit = async (nuevoLimite: number) => {
    if (!profile) return
    await userService.updateBudgetLimit(profile.idUsuario, nuevoLimite)
    await refreshProfile()
  }

  if (loading) {
    return <div className="dashboard" style={{ padding: '2rem', textAlign: 'center' }}>Cargando datos...</div>
  }

  return (
    <div className="dashboard">
      <header className="dash-header">
        <div className="dash-brand">
          <div className="brand-icon">F</div>
          <span className="brand-name">FINANZI APP</span>
        </div>
        <div className="dash-user">
          <span className="user-greeting">Hola, {profile?.nombre || 'Usuario'}</span>
          <button onClick={signOut} className="btn btn-secondary btn-sm">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <main className="dash-main">
        <StatCards totalIngresos={totalIngresos} totalGastos={totalGastos} balance={balance} />

        <BudgetCard
          totalGastos={totalGastos}
          limitePresupuesto={profile?.limite_presupuesto || 2000000}
          onUpdateLimit={handleUpdateLimit}
        />

        <DashboardCharts
          categoryData={categoryData}
          totalIngresos={totalIngresos}
          totalGastos={totalGastos}
        />

        <div className="content-row">
          <TransactionForm onSubmit={handleCreateTransaction} />
          <TransactionHistory
            transacciones={transacciones}
            categorias={categorias}
            onDelete={handleDeleteTransaction}
            onExportCSV={() => exportTransactionsToCSV(transacciones)}
          />
        </div>
      </main>
    </div>
  )
}