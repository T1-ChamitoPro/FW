import { useState, type FormEvent, type ChangeEvent } from 'react'
import '../theme/theme.css'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [remember, setRemember] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!email || !password) {
      setError('Por favor completa todos los campos.')
      return
    }

    setLoading(true)

    setTimeout(() => {
        setLoading(false)
        navigate('/dashboard')
    }, 1200)

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      setLoading(false)
      // Redirige a la pantalla principal o dashboard tras iniciar sesión
      navigate('/')
    } catch {
      setError('Ocurrió un error inesperado al iniciar sesión.')
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* Lado izquierdo — Brand / Visual */}
      <aside className="login-brand">
        <div className="login-brand-content">
          <div className="brand-logo">
            <div className="brand-icon">F</div>
            <span className="brand-name">FINANZI APP</span>
          </div>

          <h1 className="brand-title">
            Controla tu dinero
            <br />
            con claridad
          </h1>

          <p className="brand-subtitle">
            Gestiona tus finanzas personales de forma simple, segura y en un solo lugar.
          </p>

          <ul className="brand-features">
            <li>
              <span className="feature-icon">✓</span>
              Seguimiento de gastos en tiempo real
            </li>
            <li>
              <span className="feature-icon">✓</span>
              Reportes claros y fáciles de entender
            </li>
            <li>
              <span className="feature-icon">✓</span>
              Seguridad de nivel bancario
            </li>
          </ul>
        </div>

        <div className="brand-decoration">
          <div className="circle circle-1"></div>
          <div className="circle circle-2"></div>
          <div className="circle circle-3"></div>
        </div>
      </aside>

      {/* Lado derecho — Formulario */}
      <main className="login-form-wrapper">
        <div className="login-form-container">
          <div className="login-mobile-brand">
            <div className="brand-icon">F</div>
            <span className="brand-name">FINANZI APP</span>
          </div>

          <header className="login-header">
            <h2>Bienvenido de nuevo</h2>
            <p>Ingresa tus credenciales para continuar</p>
          </header>

          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="form-group">
              <div className="label-row">
                <label className="form-label" htmlFor="password">
                  Contraseña
                </label>
              </div>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showPassword ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <div className="form-group remember-row">
              <label className="form-check">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setRemember(e.target.checked)}
                />
                <span>Recordarme</span>
              </label>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Ingresando...
                </span>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <div className="login-divider">
            <span>o continúa con</span>
          </div>

          <p className="login-footer">
            ¿No tienes cuenta? <Link to="/register">Crear cuenta</Link>
          </p>
        </div>
      </main>
    </div>
  )
}