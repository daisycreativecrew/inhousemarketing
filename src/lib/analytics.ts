export const eventNames = ['hero_cta_click','trustphone_case_view','trustphone_chapter_view','trustphone_case_cta_click','proof_interaction','persona_select','self_audit_start','self_audit_complete','package_view','select_package','begin_checkout','purchase','build_application_start','build_application_submit','custom_audit_start','generate_lead','book_consultation','faq_expand','form_error'] as const
export type EventName = typeof eventNames[number]
const allowedKeys = new Set(['location', 'package_tier', 'chapter', 'proof_id', 'question_id', 'form_type', 'recommended_package', 'persona', 'page_type'])
declare global { interface Window { dataLayer?: Record<string, unknown>[] } }
export function track(event: EventName, params: Record<string, string | number> = {}) {
  if (typeof window === 'undefined') return
  try { if (localStorage.getItem('ih-consent') !== 'analytics') return } catch { return }
  // Only enumerated content IDs and fixed routing values reach the analytics boundary.
  const safe = Object.fromEntries(Object.entries(params).filter(([key, value]) => allowedKeys.has(key) && /^[a-zA-Z0-9_/-]{1,80}$/.test(String(value))))
  const detail = { event, ...safe }
  window.dataLayer ??= []
  window.dataLayer.push(detail)
  window.dispatchEvent(new CustomEvent('ih:analytics', { detail }))
  const endpoint = process.env.NEXT_PUBLIC_ANALYTICS_ENDPOINT
  if (endpoint && /^\/(?!\/)/.test(endpoint)) navigator.sendBeacon(endpoint, new Blob([JSON.stringify(detail)], { type: 'application/json' }))
}
