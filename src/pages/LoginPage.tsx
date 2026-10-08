import { useState, type FormEvent } from 'react'
import { Button, Input } from '../components/ui'
import { signIn } from '../lib/auth'

type Errors = { email?: string; password?: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(email: string, password: string): Errors {
  const errors: Errors = {}
  if (!email.trim()) errors.email = 'Email is required.'
  else if (!EMAIL_RE.test(email.trim())) errors.email = 'Enter a valid email address.'
  if (!password) errors.password = 'Password is required.'
  return errors
}

export function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState<string | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  // Bumped on every failed submit so invalid fields remount and replay the shake.
  const [attempt, setAttempt] = useState(0)
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e: FormEvent) {
    e.preventDefault()
    const found = validate(email, password)
    if (found.email || found.password) {
      setErrors(found)
      setAttempt(a => a + 1)
      return
    }
    setErrors({})
    setSubmitting(true)
    const res = await signIn(email.trim(), password)
    setSubmitting(false)
    if (res.ok) {
      setUser(res.name)
    } else {
      setErrors({ password: res.message })
      setAttempt(a => a + 1)
    }
  }

  if (user) return <p className="welcome">Welcome, {user}!</p>

  return (
    <form className="login" onSubmit={onSubmit} noValidate>
      <h1>Log in to EduPay</h1>
      <Input
        key={errors.email ? `email-${attempt}` : 'email'}
        label="Email"
        type="email"
        value={email}
        onChange={v => {
          setEmail(v)
          if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
        }}
        error={errors.email}
      />
      <Input
        key={errors.password ? `password-${attempt}` : 'password'}
        label="Password"
        type="password"
        value={password}
        onChange={v => {
          setPassword(v)
          if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
        }}
        error={errors.password}
      />
      <Button type="submit" disabled={submitting}>
        {submitting ? 'Logging in…' : 'Log in'}
      </Button>
    </form>
  )
}
