import api from '../lib/api'
import type { AccountStatement } from '../types'

export const statementService = {
  async get(): Promise<AccountStatement> {
    const res = await api.get<AccountStatement>('/user/statement')
    return res.data
  },
}
