'use client'
import { useRef, useState } from 'react'
import Link from 'next/link'
import type { Audit } from '@/payload-types'
import { scoreAudit } from '@/lib/audit'
import { track } from '@/lib/analytics'
import { Arrow } from './ui'
export function SelfAudit({ audit }: { audit: Audit }) {
  const questions = audit.questions || []
  const [answers, setAnswers] = useState<number[]>([])
  const [step, setStep] = useState(0)
  const [complete, setComplete] = useState(false)
  const heading = useRef<HTMLHeadingElement>(null)
  const question = questions[step]
  function next() {
    if (answers[step] == null) return
    if (step === questions.length - 1) {
      const result = scoreAudit(questions, answers)
      setComplete(true)
      track('self_audit_complete', { recommended_package: result.tier })
    } else setStep(step + 1)
    setTimeout(() => heading.current?.focus(), 0)
  }
  if (!question) return <p>Az útvonalválasztó jelenleg nem érhető el. <Link href="/arak/">Hasonlítsátok össze a három megoldást.</Link></p>
  if (complete) {
    const result = scoreAudit(questions, answers)
    const copy = audit[result.tier]
    return <div className="audit-result"><p className="eyebrow">A VÁLASZAITOK ALAPJÁN / JAVASLAT</p><h2 ref={heading} tabIndex={-1}>{copy.title}</h2><p className="lead">{copy.body}</p>{result.capacityNeedsPlanning && <p className="notice">Először jelöljetek ki belső felelőst és biztosítsatok időt. Egyik együttműködés sem helyettesíti a saját működtető kapacitást.</p>}<h3>Ezért ezt az irányt javasoljuk:</h3><ul>{result.reasons.map((reason, i) => <li key={i}>{reason}</li>)}</ul><p className="muted">Tájékozódási segítség, nem alkalmassági minősítés és nem eredményígéret. Nem készítünk százalékos „érettségi pontszámot”.</p><div className="button-row"><Link className="button" href={`/${result.tier}/`} data-event="select_package" data-tier={result.tier}>Megnézem a {result.tier.toUpperCase()} megoldást<Arrow /></Link><button className="button button-secondary" onClick={() => { setComplete(false); setStep(0); setTimeout(() => heading.current?.focus(), 0) }}>Válaszok módosítása</button></div></div>
  }
  return <div className="audit-shell"><div className="audit-progress"><span>0{step + 1} / 0{questions.length}</span><span>NINCS E-MAIL-KAPU</span></div><div className="progress-track" role="progressbar" aria-label="Kitöltés állapota" aria-valuemin={0} aria-valuemax={questions.length} aria-valuenow={step}><span style={{ transform: `scaleX(${step / questions.length})` }} /></div><fieldset><legend className="sr-only">{question.title}</legend><h2 ref={heading} tabIndex={-1}>{question.title}</h2>{question.hint && <p>{question.hint}</p>}<div className="audit-options">{question.options?.map((option,index) => <label key={option.id || index}><input type="radio" name={question.key} checked={answers[step] === index} onChange={() => { if (answers.length === 0) track('self_audit_start'); setAnswers(previous => { const next = [...previous]; next[step] = index; return next }) }} /><span className="radio-mark" aria-hidden="true" />{option.label}<Arrow diagonal /></label>)}</div></fieldset><div className="audit-actions"><button className="text-button" disabled={step === 0} onClick={() => { setStep(step - 1); setTimeout(() => heading.current?.focus(), 0) }}>← Vissza</button><button className="button" disabled={answers[step] == null} onClick={next}>{step === questions.length - 1 ? 'Megnézem a javaslatot' : 'Következő kérdés'}<Arrow /></button></div></div>
}
