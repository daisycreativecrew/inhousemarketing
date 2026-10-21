# Architektúra és discovery

## Kiindulás

A `/workspace/inhousemarketing` üres, commit nélküli repository volt. Nem volt migrálható alkalmazás, infrastruktúra, lockfile, CI vagy korábbi tartalom. Nem látogattuk meg és nem másoltuk le a jelenlegi honlapot. Mindkét átadott PDF szöveges feldolgozása megtörtént. Az abban szereplő régi csomagárak és időtartamok nem kerültek szerződéses ígéretként az új rendszerbe.

## ADR-01 — Integrált Next.js és Payload

Next.js 16 App Router, React 19, TypeScript, Payload 3.91. A CMS és a frontend közös típusokat, szerverfolyamatot és jogosultsági modellt használ. A fontos marketingtartalom adatbázisból érkezik; a seed kezdőtartalom, nem frontend-konstans. Új esettanulmány és tudástárcikk dinamikus útvonalon, kódváltoztatás nélkül megjelenik.

A szín-, méret- és mozgástokenek natív, rétegezett CSS-ben vannak. Tailwind és animációs könyvtár nem került be: ehhez a kontrollált komponenskészlethez a CSS és kis React-interakciók elegendők. Nincs GSAP, scroll-jacking, Lottie vagy nehéz videó. A UI nem komponenskönyvtár-demó.

## ADR-02 — Adatbázis

Azonnal használható fejlesztői alap: helyi SQLite. `DATABASE_URL=postgresql:...` esetén az alkalmazás a Payload hivatalos PostgreSQL-adapterét választja. A két adapter migrációi külön könyvtárban vannak. SQLite és PostgreSQL közötti adatáthelyezés nem pusztán URL-átírás: új adatbázisba seed/import, ellenőrzött mentés és médiaátvitel szükséges. PostgreSQL az ajánlott éles adatbázis; az aktuális ellenőrzési státuszt az átadási jegyzék rögzíti.

## ADR-03 — Renderelés és tartalombiztonság

SSR oldalanként, React request cache a duplikált lekérdezések ellen. A szerkesztői mód dinamikus, így a mentett tartalom újraépítés nélkül megjelenik. A statikus CSS, fontok és brand assetek hosszú távon gyorsítótárazhatók. Későbbi ISR csak jogosultságtudatos revalidációval vezethető be.

Az alkalmazás nem renderel adminból érkező nyers HTML-t. A JSON-LD `<` karakterei escape-elve vannak. A CTA-mezők belső útvonalat vagy HTTPS-címet fogadnak el. A médiatár nem enged aktív SVG/HTML-feltöltést. Az előnézeti API admin-munkamenetet kér, és csak belső tartalmi útvonalra irányít át.

## Tartalommodell

| Modell | Tartalom | Publikáció |
| --- | --- | --- |
| `site` global | márka, logó, navigáció, footer, elérhetőség, SEO alapok, form copy | kiadói szerkesztés |
| `pages` | útvonal, hero, CTA, SEO, rendezhető kontrollált blokkok | draft/publish + 30 verzió |
| `products` | három út, felelősség, delivery, ár/ÁFA, üzleti jóváhagyás, includes/excludes, FAQ | draft/publish |
| `cases` | ügyfél, történet, fejezetek, skill map, média, forrás, jóváhagyó és dátum | draft/publish ÉS approval |
| `evidence` | 12 újrahasználható bizonyítéktípus, forrás, média és kapcsolt case | draft/publish ÉS approval |
| `experts` | név, szakterület, bio, hitelesített háttér és portré | draft/publish ÉS approval |
| `articles` | slug, kategória, bevezető, tartalmi blokkok, dátum, szerző, SEO | draft/publish |
| `media` | kép/videó, alt, caption, forrás, használati jog | jóváhagyott média publikálható |
| `audit` global | kérdések, válaszok, súlyok, indoklás és eredményszöveg | kiadói szerkesztés |
| `leads` | intent, minimális kvalifikáció, nyilatkozat időpontja/verziója, kézbesítés | csak kiadó/admin |
| `users` | admin/publisher/editor | csak admin kezelheti |
| `activity` | szerkesztő azonosítója, művelet, dokumentum | változtathatatlan alkalmazásszintű napló |

Blokkok: story, problems + kapcsolt evidence, system, products, selector, preview, experts, FAQ, editorial, CTA. A sorrend a Payload blocks UI-ban változtatható. A megjelenés kontrollált; nem szabad page builder.

## API és integrációs határok

`/api/[...slug]`: Payload REST, kollekciónkénti hozzáféréssel. `/api/lead`: szerveroldali validáció, origin-check, korlátozott requestméret, honeypot, lokális rate limit és idempotencia. Először tartós leadrögzítés, utána opcionális CRM-webhook. `/api/checkout`: csak az üzleti és jogi kapuk teljesülése után irányít a konfigurált hosted szolgáltatóhoz. Nincs hamis payment callback vagy purchase event.

## Teljes oldalarchitektúra

Főoldal; START; BUILD; CUSTOM; árak; módszertan; esettanulmány-index és dinamikus részlet; Self-Audit; tudástár és dinamikus cikk; rólunk; intent szerinti kapcsolat; START checkout; BUILD jelentkezés; CUSTOM audit; adatkezelési és ÁSZF-keret; 404. A kezdő tartalom 20 ellenőrizendő útvonalat biztosít, három valódi szakmai cikkel.
