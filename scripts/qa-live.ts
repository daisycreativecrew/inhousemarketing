// Run only against a separately seeded QA database and a live-mode local server.
import { getPayload } from 'payload'
import config from '../src/payload.config'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { closePayload } from './lib/close'
if (!process.env.DATABASE_URL?.includes('inhouseqa')) throw new Error('Dedicated inhouseqa database required; never run against customer data.')
const base=process.env.NEXT_PUBLIC_SITE_URL!
const payload=await getPayload({config})
const site=await payload.findGlobal({slug:'site'})
const privacy=(await payload.find({collection:'pages',where:{path:{equals:'/adatkezeles/'}},limit:1})).docs[0]
const key=randomUUID()
const headers={'Origin':base,'Content-Type':'application/json','x-forwarded-for':`qa-${key}`}
const data={intent:'build',name:'QA Teszt',email:'qa@example.test',company:'QA fixture',message:'Automatizált teszt, nem valódi érdeklődés.',consent:true,requestKey:key}
const submit=(body:unknown,override={})=>fetch(base+'/api/lead',{method:'POST',headers:{...headers,...override},body:JSON.stringify(body)})
try {
  assert.equal((await fetch(base+'/esettanulmanyok/trustphone/')).status,404,'Unapproved case absent in live mode')
  const home=await (await fetch(base+'/')).text()
  assert.ok(!home.includes('Nem marketingesként kezdte.'),'No unapproved story in live HTML')
  const robots=await (await fetch(base+'/robots.txt')).text()
  assert.ok(!robots.includes('Disallow: /\n'),'Live robots does not inherit preview build state')
  const sitemap=await (await fetch(base+'/sitemap.xml')).text()
  assert.ok(!sitemap.includes('/esettanulmanyok/trustphone/'),'Draft omitted from sitemap')
  assert.ok(sitemap.includes('/start/'),'Published product in sitemap')
  assert.equal((await fetch(base+'/opengraph-image')).status,200,'OG image resolves')
  assert.equal((await fetch(base+'/api/checkout')).status,503,'Incomplete checkout remains closed')
  assert.equal((await submit(data)).status,503,'Missing legal approval blocks collection')
  await payload.updateGlobal({slug:'site',data:{privacyApproved:true}})
  await payload.update({collection:'pages',id:privacy.id,data:{legalApproved:true,_status:'published'}})
  assert.equal((await submit(data,{'Origin':'https://untrusted.example'})).status,403,'Cross-origin request denied')
  assert.equal((await submit(data)).status,201,'Valid lead stored')
  assert.equal((await submit(data)).status,200,'Same UUID accepted idempotently')
  const rows=await payload.count({collection:'leads',where:{requestKey:{equals:key}}})
  assert.equal(rows.totalDocs,1,'Exactly one persisted lead')
  assert.equal((await submit({...data,consent:false})).status,400,'Consent is enforced')
  assert.equal((await submit({...data,role:'admin'})).status,400,'Unexpected fields rejected')
  assert.equal((await submit({...data,website:'spam'})).status,400,'Honeypot enforced')
  assert.equal((await submit(data)).status,429,'Rate limit enforced')
  console.log('Live-mode approval, SEO, OG, checkout and lead persistence/idempotency/security checks passed against isolated PostgreSQL QA data.')
}finally{
  await payload.delete({collection:'leads',where:{requestKey:{equals:key}}})
  await payload.updateGlobal({slug:'site',data:{privacyApproved:site.privacyApproved}})
  await payload.update({collection:'pages',id:privacy.id,data:{legalApproved:privacy.legalApproved,_status:'published'}})
  await closePayload(payload)
}

process.exit(0)
