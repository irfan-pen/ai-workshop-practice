import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginPage } from './LoginPage'

test('a correct login shows the welcome message', async () => {
  render(<LoginPage />)
  await userEvent.type(screen.getByLabelText('Email'), 'demo@edupay.test')
  await userEvent.type(screen.getByLabelText('Password'), 'correct-horse')
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
  expect(await screen.findByText('Welcome, Demo Student!')).toBeInTheDocument()
})

test('a wrong password shows an error on the password field', async () => {
  render(<LoginPage />)
  await userEvent.type(screen.getByLabelText('Email'), 'demo@edupay.test')
  await userEvent.type(screen.getByLabelText('Password'), 'wrong')
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
  expect(await screen.findByText('Wrong email or password.')).toBeInTheDocument()
  expect(screen.getByLabelText('Password')).toHaveAttribute('aria-invalid', 'true')
  expect(screen.queryByText(/Welcome/)).not.toBeInTheDocument()
})

test('empty fields show required errors', async () => {
  render(<LoginPage />)
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
  expect(screen.getByText('Email is required.')).toBeInTheDocument()
  expect(screen.getByText('Password is required.')).toBeInTheDocument()
})

test('an invalid email shows a format error', async () => {
  render(<LoginPage />)
  await userEvent.type(screen.getByLabelText('Email'), 'not-an-email')
  await userEvent.type(screen.getByLabelText('Password'), 'x')
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
  expect(screen.getByText('Enter a valid email address.')).toBeInTheDocument()
})

test('typing in a field clears its error', async () => {
  render(<LoginPage />)
  await userEvent.click(screen.getByRole('button', { name: 'Log in' }))
  await userEvent.type(screen.getByLabelText('Email'), 'a')
  expect(screen.queryByText('Email is required.')).not.toBeInTheDocument()
  expect(screen.getByText('Password is required.')).toBeInTheDocument()
})
