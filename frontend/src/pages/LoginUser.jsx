import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const API_URL = 'http://localhost:3000'

export default function LoginUser() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMessage(null)
    setSubmitting(true)

    try {
      const { data } = await axios.post(
        `${API_URL}/users/login`,
        { username, password },
        { withCredentials: true }
      )

      setMessage({ type: 'success', text: 'Logged in successfully!' })
      setUsername('')
      setPassword('')
      
      // Reload page to update navbar with current user
      setTimeout(() => window.location.href = '/campgrounds', 1000)
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Login failed'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        <h2 style={styles.title}>Login</h2>
        <p style={styles.subtitle}>Sign in to your YelpCamp account.</p>

        {message && (
          <div
            style={{
              ...styles.banner,
              backgroundColor: message.type === 'success' ? '#e6ffed' : '#ffecec',
              color: message.type === 'success' ? '#0f5132' : '#842029',
              borderColor: message.type === 'success' ? '#badbcc' : '#f5c2c7',
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={styles.form}>
          <label style={styles.label}>
            Username
            <input
              style={styles.input}
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </label>

          <label style={styles.label}>
            Password
            <input
              style={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>

          <button type="submit" style={styles.button} disabled={submitting}>
            {submitting ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account? <a href="/users/register" style={styles.link}>Register here</a>
        </p>
      </div>
    </div>
  )
}

const styles = {
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '70vh',
  },
  card: {
    width: '100%',
    maxWidth: 420,
    background: '#fff',
    padding: '1.5rem',
    borderRadius: 12,
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    border: '1px solid #e5e7eb',
  },
  title: {
    margin: '0 0 0.25rem',
    fontSize: '1.5rem',
  },
  subtitle: {
    margin: '0 0 1rem',
    color: '#6b7280',
    fontSize: '0.95rem',
  },
  banner: {
    padding: '0.75rem',
    borderRadius: 8,
    border: '1px solid',
    marginBottom: '1rem',
    fontSize: '0.95rem',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.85rem',
  },
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.35rem',
    fontWeight: 600,
    color: '#111827',
    fontSize: '0.95rem',
  },
  input: {
    padding: '0.65rem 0.75rem',
    borderRadius: 8,
    border: '1px solid #d1d5db',
    fontSize: '1rem',
  },
  button: {
    marginTop: '0.5rem',
    padding: '0.75rem',
    background: '#111827',
    color: '#fff',
    border: 'none',
    borderRadius: 10,
    fontSize: '1rem',
    cursor: 'pointer',
  },
  footer: {
    marginTop: '1.25rem',
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#6b7280',
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    fontWeight: 600,
  },
}
