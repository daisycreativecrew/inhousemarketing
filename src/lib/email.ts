import type { EmailAdapter } from 'payload'
export const transactionalEmail: EmailAdapter = () => ({
  name: 'inhouse-https-mail',
  defaultFromAddress: process.env.MAIL_FROM_ADDRESS || 'no-reply@example.invalid',
  defaultFromName: 'IN/HOUSE MARKETING',
  async sendEmail(message) {
    const url = process.env.MAIL_WEBHOOK_URL
    if (!url?.startsWith('https://') || !process.env.MAIL_FROM_ADDRESS) throw new Error('Tranzakciós levélküldés nincs konfigurálva. Kérj adminisztrátori segítséget.')
    const response = await fetch(url, { method:'POST', headers: { 'Content-Type':'application/json', ...(process.env.MAIL_WEBHOOK_TOKEN ? { Authorization:`Bearer ${process.env.MAIL_WEBHOOK_TOKEN}` } : {}) }, body:JSON.stringify(message), redirect:'error', signal:AbortSignal.timeout(8000) })
    if (!response.ok) throw new Error('A levélküldő szolgáltató nem fogadta el a kérést.')
    return { accepted:true }
  },
})
