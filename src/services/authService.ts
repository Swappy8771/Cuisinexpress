import api from '../lib/api'
import type { LoginRequest, RegisterRequest, AuthTokens, User } from '../types'

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

// ── Test credentials (mock only) ──────────────────────────────────────────────
const MOCK_USER: User = {
  id: 'usr-demo',
  firstName: 'Marie',
  lastName: 'Tremblay',
  email: 'demo@cuisinexpress.ca',
  phone: '581-992-9952',
  address: '123 rue des Érables, Québec, QC G1R 1A1',
  notifications: true,
}
const MOCK_CREDENTIALS = { email: 'demo@cuisinexpress.ca', password: 'demo1234' }
const MOCK_TOKEN = 'mock-jwt-token-cuisinexpress'

function delay(ms = 600) { return new Promise<void>((r) => setTimeout(r, ms)) }

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay()
      if (
        data.email.trim().toLowerCase() === MOCK_CREDENTIALS.email &&
        data.password === MOCK_CREDENTIALS.password
      ) {
        return { user: MOCK_USER, tokens: { accessToken: MOCK_TOKEN } }
      }
      throw Object.assign(new Error(), {
        response: { data: { message: 'Identifiants incorrects. Essayez demo@cuisinexpress.ca / demo1234' } },
      })
    }
    const res = await api.post<AuthResponse>('/auth/login', data)
    return res.data
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (USE_MOCK) {
      await delay()
      const newUser: User = {
        id: `usr-${Date.now()}`,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone ?? '',
        address: '',
        notifications: true,
      }
      return { user: newUser, tokens: { accessToken: MOCK_TOKEN } }
    }
    const res = await api.post<AuthResponse>('/auth/register', data)
    return res.data
  },

  async forgotPassword(email: string): Promise<void> {
    if (USE_MOCK) { await delay(400); console.info('Mock forgot-password for', email); return }
    await api.post('/auth/forgot-password', { email })
  },

  async me(): Promise<User> {
    if (USE_MOCK) { await delay(200); return MOCK_USER }
    const res = await api.get<User>('/auth/me')
    return res.data
  },

  async logout(): Promise<void> {
    if (USE_MOCK) { await delay(200); return }
    await api.post('/auth/logout').catch(() => {})
  },
}
