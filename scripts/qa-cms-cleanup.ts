import { getPayload } from 'payload'
import config from '../src/payload.config'
import { readFileSync, unlinkSync } from 'node:fs'
import { closePayload } from './lib/close'
const fixture=JSON.parse(readFileSync('.data/qa-cms.json','utf8'))
const payload=await getPayload({config})
await payload.delete({collection:'pages',id:fixture.page,overrideAccess:true})
await payload.delete({collection:'evidence',id:fixture.evidence,overrideAccess:true})
await payload.delete({collection:'media',where:{and:[{source:{equals:'Automatizált QA fixture.'}},{alt:{equals:'Automatizált tesztkép; nem ügyfélmédia.'}}]},overrideAccess:true})
for(const id of fixture.users) await payload.delete({collection:'users',id,overrideAccess:true})
unlinkSync('.data/qa-cms.json')
console.log('Temporary CMS accounts and fixture documents removed; other content preserved.')
await closePayload(payload)

process.exit(0)
