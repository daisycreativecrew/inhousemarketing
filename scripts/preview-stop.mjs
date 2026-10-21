import { existsSync, readFileSync, unlinkSync } from 'node:fs'
const filename = '.data/preview-server.json'
if (!existsSync(filename)) {
  console.log('Nincs az indító által nyilvántartott szerver; más folyamatot nem állítunk le.')
  process.exit(0)
}
const stored = JSON.parse(readFileSync(filename, 'utf8'))
try {
  const current = readFileSync(`/proc/${stored.pid}/stat`, 'utf8').split(') ')[1].split(' ')[19]
  if (current !== stored.startTicks) throw new Error('A folyamat azonosítója újrahasznosult; nem állítjuk le.')
  process.kill(stored.pid, 'SIGTERM')
  console.log('A tesztverzió szervere leállt. A tartalom és az adminfiókok megmaradtak.')
} catch (error) {
  if (error.code !== 'ENOENT' && error.code !== 'ESRCH') throw error
  console.log('A nyilvántartott szerver már nem fut.')
}
unlinkSync(filename)
