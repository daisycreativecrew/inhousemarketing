import { describe, expect, it } from 'vitest'
import { scoreAudit } from '@/lib/audit'
import { leadSchema } from '@/lib/lead'
import type { Audit } from '@/payload-types'
const questions: NonNullable<Audit['questions']> = [{ key: 'support', title: 'Segítség?', options: [
  { label: 'Önálló', reason: 'Belső kapacitás.', start: 8, build: 0, custom: 0 },
  { label: 'Vezetett', reason: 'Közös építés.', start: 0, build: 8, custom: 0 },
  { label: 'Tervezés', reason: 'Saját rendszer.', start: 0, build: 0, custom: 8 },
] }]
describe('deterministic audit routing', () => {
  it.each([[0,'start'],[1,'build'],[2,'custom']])('routes selection %s to %s', (answer, tier) => expect(scoreAudit(questions,[Number(answer)]).tier).toBe(tier))
  it('uses the documented tie order without inventing precision', () => {
    const tied = [{ key:'test', title:'Tie', options:[{label:'A', reason:'Reason',start:1,build:1,custom:1}] }]
    expect(scoreAudit(tied,[0])).toEqual({ tier:'build', reasons:['Reason'], capacityNeedsPlanning:false })
  })
  it('reflects CMS score changes', () => {
    const changed = structuredClone(questions)
    changed[0].options![0].custom = 10
    expect(scoreAudit(changed,[0]).tier).toBe('custom')
  })
  it('warns when operating capacity still needs planning', () => expect(scoreAudit([{ ...questions[0], key:'capacity' }],[2]).capacityNeedsPlanning).toBe(true))
  it.each([[],[4],[-1],[0.5],[0,1]].map(answers => [answers]))('rejects incomplete or tampered answers %j', answers => expect(() => scoreAudit(questions,answers)).toThrow())
})
describe('lead request boundary', () => {
  const valid = { name:'Teszt Elek',email:'teszt@example.test',company:'Teszt Kft.',message:'Működési rendszert szeretnénk.',intent:'build',consent:true,requestKey:'f92e7575-c7a7-4fd5-9913-8a8aeec7fdc7' }
  it('accepts the defined qualification payload', () => expect(leadSchema.safeParse(valid).success).toBe(true))
  it.each([{ consent:false },{ email:'no' },{ website:'spam' },{ requestKey:'forged' },{ message:'short' },{ role:'admin' }])('rejects invalid submission %j', override => expect(leadSchema.safeParse({...valid,...override}).success).toBe(false))
})
