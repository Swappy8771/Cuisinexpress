import api from '../lib/api'
import type { Invoice } from '../types'

export const invoicesService = {
  async list(): Promise<Invoice[]> {
    const res = await api.get<Invoice[]>('/user/invoices')
    return res.data
  },

  async download(id: string): Promise<Blob> {
    const res = await api.get<Blob>(`/user/invoices/${id}/download`, {
      responseType: 'blob',
    })
    return res.data
  },
}
