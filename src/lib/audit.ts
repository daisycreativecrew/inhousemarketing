import type { Audit } from '@/payload-types'
export type Tier = 'start' | 'build' | 'custom'
export function scoreAudit(questions: NonNullable<Audit['questions']>, answers: number[]) {
  if (answers.length !== questions.length || answers.some((answer, index) => !Number.isInteger(answer) || answer < 0 || !questions[index].options?.[answer])) throw new Error('Minden kérdésre érvényes választ kell adni.')
  const scores: Record<Tier, number> = { start: 0, build: 0, custom: 0 }
  const reasons: string[] = []
  questions.forEach((question, i) => {
    const option = question.options![answers[i]]
    for (const tier of ['start', 'build', 'custom'] as const) scores[tier] += option[tier]
    reasons.push(option.reason)
  })
  // Equal scores favour guided work, then independent work, then bespoke planning.
  const tier = (['build', 'start', 'custom'] as Tier[]).reduce((best, current) => scores[current] > scores[best] ? current : best, 'build')
  const capacityQuestion = questions.findIndex(q => q.key === 'capacity')
  const capacityNeedsPlanning = capacityQuestion >= 0 && answers[capacityQuestion] === 2
  return { tier, reasons, capacityNeedsPlanning }
}
