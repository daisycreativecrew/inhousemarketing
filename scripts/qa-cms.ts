import { getPayload } from 'payload'
import config from '../src/payload.config'
import { randomBytes, randomUUID } from 'node:crypto'
import { writeFileSync, mkdirSync } from 'node:fs'
import assert from 'node:assert/strict'
import { closePayload } from './lib/close'
const payload = await getPayload({ config })
const password = randomBytes(30).toString('base64url')
const suffix = randomUUID().slice(0,8)
const email = `qa-admin-${suffix}@example.test`
const admin = await payload.create({ collection:'users',data:{email,password,name:'QA Admin',role:'admin'},overrideAccess:true })
const editor = await payload.create({ collection:'users',data:{email:`qa-editor-${suffix}@example.test`,password,name:'QA Editor',role:'editor'},overrideAccess:true })
const publisher = await payload.create({ collection:'users',data:{email:`qa-publisher-${suffix}@example.test`,password,name:'QA Publisher',role:'publisher'},overrideAccess:true })
const page = await payload.create({collection:'pages',data:{path:`/qa-${suffix}/`,title:'QA CMS draft',intro:'Automatizált tesztadat. Nem ügyféltartalom.',seo:{title:'QA draft',description:'Automatizált adminellenőrzés.'},_status:'draft'},user:editor,overrideAccess:false})
let publishDenied = false
try { await payload.update({collection:'pages',id:page.id,data:{_status:'published'},user:editor,overrideAccess:false}) } catch { publishDenied=true }
assert.equal(publishDenied,true,'Editor cannot publish')
const published = await payload.update({collection:'pages',id:page.id,data:{_status:'published'},user:publisher,overrideAccess:false})
assert.equal(published._status,'published')
await payload.update({collection:'pages',id:page.id,data:{_status:'draft'},user:publisher,overrideAccess:false})
const evidence = await payload.create({collection:'evidence',data:{title:'QA evidence',kind:'quote',body:'Automatizált teszt, nem ügyfélidézet.',source:'QA fixture',approval:'approved',_status:'draft'},user:editor,overrideAccess:false})
assert.notEqual(evidence.approval,'approved','Editor cannot approve evidence at creation')
let approvalDenied=false
try { await payload.update({collection:'evidence',id:evidence.id,data:{approval:'approved',_status:'published'},user:publisher,overrideAccess:false}) } catch { approvalDenied=true }
assert.equal(approvalDenied,true,'Missing evidence metadata blocks approval')
const logs=await payload.find({collection:'activity',where:{document:{equals:String(page.id)}},user:admin,overrideAccess:false})
assert.ok(logs.totalDocs>=3,'Changes leave an audit trail')
const publicRead=await payload.find({collection:'evidence',where:{id:{equals:evidence.id}},overrideAccess:false})
assert.equal(publicRead.totalDocs,0,'Unapproved evidence remains private')
mkdirSync('.data',{recursive:true})
writeFileSync('.data/qa-cms.json',JSON.stringify({email,password,users:[admin.id,editor.id,publisher.id],page:page.id,path:page.path,evidence:evidence.id}),{mode:0o600})
console.log('CMS permission checks passed; temporary browser fixture prepared without printing credentials.')
await closePayload(payload)

process.exit(0)
