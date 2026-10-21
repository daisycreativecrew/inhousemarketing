import { spawn } from 'node:child_process'
import { mkdirSync, writeFileSync } from 'node:fs'
import lighthouse from 'lighthouse'
const output='.qa/performance'
mkdirSync(output,{recursive:true})
const browser=process.env.CHROMIUM_PATH || '/usr/bin/chromium'
const base=process.env.E2E_BASE_URL || 'http://localhost:3000'
const chrome=spawn(browser,['--headless','--no-sandbox','--disable-dev-shm-usage','--remote-debugging-port=9222','--user-data-dir=/tmp/inhouse-lighthouse'],{stdio:'ignore'})
try {
  let ready=false
  for(let i=0;i<30;i++) { try { if((await fetch('http://127.0.0.1:9222/json/version')).ok){ready=true;break} }catch{} await new Promise(resolve=>setTimeout(resolve,100)) }
  if(!ready)throw new Error('Chromium debugging port not ready')
  const summary=[]
  for(const path of ['/', '/esettanulmanyok/trustphone/']) {
    const name=path==='/'?'home':'trustphone'
    const report=await lighthouse(base+path,{port:9222,output:['html','json'],onlyCategories:['performance','accessibility','best-practices','seo'],logLevel:'error',formFactor:'mobile',screenEmulation:{mobile:true,width:390,height:844,deviceScaleFactor:1,disabled:false},chromeFlags:'--no-sandbox'})
    if(!report)throw new Error('Lighthouse returned no report')
    writeFileSync(`${output}/${name}.html`,report.report[0]);writeFileSync(`${output}/${name}.json`,report.report[1])
    const a=report.lhr.audits
    summary.push({page:path,scores:Object.fromEntries(Object.entries(report.lhr.categories).map(([k,v])=>[k,Math.round((v.score||0)*100)])),lcpMs:Math.round(a['largest-contentful-paint'].numericValue),cls:a['cumulative-layout-shift'].numericValue,tbtMs:a['total-blocking-time'].numericValue})
  }
  writeFileSync(`${output}/summary.json`,JSON.stringify(summary,null,2))
  console.log(JSON.stringify(summary,null,2))
}finally{chrome.kill('SIGTERM')}
