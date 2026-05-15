import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { registerUser } from '../services/authService'
import toast from 'react-hot-toast'

const RegisterPage = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }
    setLoading(true)
    try {
      const data = await registerUser(form.name, form.email, form.password)
      login({ _id: data._id, name: data.name, email: data.email }, data.token)
      toast.success(`Welcome to PulseBoard, ${data.name}!`)
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg)' }}>

      {/* Left Panel */}
      <div style={{
        width: '45%', background: 'var(--navy)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '64px'
      }} className="hide-mobile">
        <div style={{
          width: 44, height: 44, borderRadius: 10,
          background: 'var(--green)', marginBottom: 32,
          display: 'flex', alignItems: 'center', justifyContent: 'center'
        }}>
          <div style={{ width: 18, height: 18, borderRadius: '50%', background: 'var(--navy)' }} />
        </div>
        <h1 style={{
          fontFamily: 'Syne', fontWeight: 800, fontSize: 36,
          color: 'var(--white)', lineHeight: 1.2, marginBottom: 16
        }}>
          Start collecting feedback today
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 16, lineHeight: 1.7, marginBottom: 40 }}>
          Join PulseBoard and create your first poll in minutes. Free forever.
        </p>
        {[
          'No credit card required',
          'Unlimited polls',
          'Real-time response tracking',
          'Public result publishing'
        ].map((item, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{
              width: 22, height: 22, borderRadius: '50%',
              background: 'rgba(46,204,143,0.2)',
              border: '1.5px solid var(--green)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0
            }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: 'var(--green)' }} />
            </div>
            <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: 15 }}>{item}</span>
          </div>
        ))}
      </div>

      {/* Right Panel */}
      <div style={{
        flex: 1, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        padding: '48px 32px'
      }}>
        <div style={{ width: '100%', maxWidth: 420 }}>
          <h2 style={{
            fontFamily: 'Syne', fontWeight: 800,
            fontSize: 30, color: 'var(--navy)', marginBottom: 8
          }}>Create account</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: 40, fontSize: 15 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: 'var(--green-dark)', fontWeight: 600, textDecoration: 'none' }}>
              Login
            </Link>
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8, color: 'var(--navy)' }}>
                Full name
              </label>
              <input
                className="input"
                type="text"
                name="name"
                placeholder="Your name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8, color: 'var(--navy)' }}>
                Email address
              </label>
              <input
                className="input"
                type="email"
                name="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontWeight: 600, fontSize: 14, marginBottom: 8, color: 'var(--navy)' }}>
                Password
              </label>
              <input
                className="input"
                type="password"
                name="password"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              className="btn-primary"
              type="submit"
              disabled={loading}
              style={{ width: '100%', fontSize: 16, padding: '14px' }}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 24 }}>
            <Link to="/" style={{ color: 'var(--text-muted)', fontSize: 14, textDecoration: 'none' }}>
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage