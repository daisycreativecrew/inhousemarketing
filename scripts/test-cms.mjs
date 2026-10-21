import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
const exec=(args)=>spawnSync(process.execPath,args,{stdio:'inherit',env:{...process.env,CMS_QA:'true'}}).status ?? 1
let status=1
try {
  if (!existsSync('.data/qa-cms.json') && exec(['--env-file=.env.local','node_modules/tsx/dist/cli.mjs','scripts/qa-cms.ts'])!==0) process.exitCode=1
  else status=exec(['node_modules/@playwright/test/cli.js','test','admin.spec.ts'])
} finally {
  if (existsSync('.data/qa-cms.json')) {
    const cleanup=exec(['--env-file=.env.local','node_modules/tsx/dist/cli.mjs','scripts/qa-cms-cleanup.ts'])
    if (cleanup!==0) status=cleanup
  }
}
process.exitCode=status
