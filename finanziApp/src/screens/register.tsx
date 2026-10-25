import { useState, type FormEvent, type ChangeEvent } from 'react'
import '../theme/theme.css'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'

export default function Register() {
  const navigate = useNavigate()
  const [username, setUsername] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [confirmPassword, setConfirmPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [showConfirm, setShowConfirm] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    if (!username || !email || !password || !confirmPassword) {
      setError('Por favor completa todos los campos.')
      return
    }

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)

    try {
      // 1. Registro en Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username,
          },
        },
      })

      if (authError) {
        setError(authError.message)
        setLoading(false)
        return
      }

      // 2. Guardar datos adicionales en la tabla 'usuario' de la BD
      if (authData.user) {
        const { error: dbError } = await supabase.from('USUARIO').insert([
          {
            nombre: username,
            correo: email,
            contrasena: password,
          },
        ])

        if (dbError) {
          setError(`Error guardando datos de perfil: ${dbError.message}`)
          setLoading(false)
          return
        }
      }

      setLoading(false)
      navigate('/login')
    } catch {
      setError('Ocurrió un error inesperado al procesar el registro.')
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
            Empieza a controlar
            <br />
            tu dinero hoy
          </h1>

          <p className="brand-subtitle">
            Crea tu cuenta gratis y comienza a gestionar tus finanzas de forma simple y segura.
          </p>

          <ul className="brand-features">
            <li>
              <span className="feature-icon">✓</span>
              Registro rápido y sin complicaciones
            </li>
            <li>
              <span className="feature-icon">✓</span>
              Tus datos siempre protegidos
            </li>
            <li>
              <span className="feature-icon">✓</span>
              Acceso desde cualquier dispositivo
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
            <h2>Crear cuenta</h2>
            <p>Completa los datos para registrarte</p>
          </header>

          {error && (
            <div className="alert alert-error" role="alert">
              {error}
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="username">
                Nombre de usuario
              </label>
              <input
                id="username"
                type="text"
                className="form-input"
                placeholder="ej: juanperez"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

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
              <label className="form-label" htmlFor="password">
                Contraseña
              </label>
              <div className="password-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Mínimo 6 caracteres"
                  value={password}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  autoComplete="new-password"
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

            <div className="form-group">
              <label className="form-label" htmlFor="confirmPassword">
                Confirmar contraseña
              </label>
              <div className="password-wrapper">
                <input
                  id="confirmPassword"
                  type={showConfirm ? 'text' : 'password'}
                  className="form-input"
                  placeholder="Repite tu contraseña"
                  value={confirmPassword}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirm(!showConfirm)}
                  aria-label={showConfirm ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  {showConfirm ? 'Ocultar' : 'Mostrar'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-lg btn-full"
              disabled={loading}
              style={{ marginTop: '0.5rem' }}
            >
              {loading ? (
                <span className="btn-loading">
                  <span className="spinner"></span>
                  Creando cuenta...
                </span>
              ) : (
                'Crear cuenta'
              )}
            </button>
          </form>

          <p className="login-footer" style={{ marginTop: '1.5rem' }}>
            ¿Ya tienes cuenta? <Link to="/login">Iniciar sesión</Link>
          </p>
        </div>
      </main>
    </div>
  )
}