# QA-jegyzék — 2026. október 21.

## Kiegészítő ellenőrzés a megnyitható átadáshoz

- Új production build, lint és typecheck: sikeres.
- Unit tesztek: **26 sikeres**; az eredeti 18 mellé 8 teszt került a Codespaces-origin, a biztonságos konfigurációgenerálás és a meglévő konfiguráció megőrzésének ellenőrzésére.
- Első admin regisztráció: külön Playwright-futásban **1 sikeres E2E**. A valódi Create first user űrlap kitöltése, hitelesített session és admin szerepkör API-visszaolvasása, majd az ideiglenes fiók törlése történt. Futtatás: `E2E_FIRST_USER=true npx playwright test tests/e2e/first-user.spec.ts --workers=1`; kizárólag felhasználó nélküli tesztadatbázison.
- Javítás: az első felhasználót adminná emelő hook a felhasználószámlálásnak is átadja az aktuális requestet; így az első-regisztrációs SQLite-tranzakció nem akad el.
- `preview:serve`: tényleges production szerver indítása, főoldal és Self-Audit ellenőrzése, ismételt indításkor a futó szerver felismerése. `preview:stop`: kizárólag az indító saját, folyamatkezdési idővel ellenőrzött szerverét állította le; újraindítás sikeres.
- A titkok, adatbázis, admin-sessionök, feltöltött média, helyi naplók és tesztartefaktok Gitből való kizárását ellenőriztük.

A GitHub Codespace tényleges létrehozása ebből a környezetből nem történt meg: nincs megosztható port-előnézeti eszköz, a GitHub API-hozzáférés tiltott. A devcontainer életciklusának parancsait és a Codespaces-cím generálását helyben ellenőriztük; a teljes új Codespace indítását a GitHub felületén még ellenőrizni kell. A Node-image címkéjének létezése a Microsoft registry listájából ellenőrzött; az image letöltése itt hálózati tiltásba ütközött. Ezek nem tekinthetők elvégzett távoli deploymentnek.

## Sikeresen végrehajtott ellenőrzések

| Ellenőrzés | Eredmény |
| --- | --- |
| Frozen telepítés | `npm ci --include=dev`, setup, ismételt seed és production build sikeres |
| ESLint | sikeres, 0 hiba és 0 figyelmeztetés a végső futásban |
| TypeScript | `tsc --noEmit` és a Next build típusellenőrzése sikeres |
| Production build | sikeres, SSR és metadata route-ok elkészültek |
| Vitest | 18 teszt sikeres; routing, holtverseny, kapacitás és requestvalidáció |
| Fő böngészős suite | 14 teszt sikeres; 20 oldal, belső CTA-k, mindhárom auditkimenet, modal, FAQ, skill map, consent és formexport |
| Responsive + axe | 360 / 390 / 768 / 1024 / 1280 / 1440 px, 4 fő oldal mindegyiken; reduced motion és külön normál motion; nincs kimutatott vízszintes túlcsordulás vagy axe-sértés |
| Fontoptimalizálás utáni újraellenőrzés | 7 érintett responsive/default-motion teszt újra sikeres |
| Admin böngészős suite | 1 teszt sikeres: valódi belépés, title-szerkesztés, publish, hitelesített preview, kép feltöltése és visszaolvasása |
| CMS jogosultságok | editor publish tiltott; publisher publish működik; editor proof-jóváhagyás tiltott; hiányos jóváhagyási metaadat elutasítva; publikus pending proof rejtett; változásnapló keletkezik |
| SQLite migráció | új QA-adatbázis migráció + seed; ismételt migrate változtatás nélkül sikeres |
| PostgreSQL migráció | külön PostgreSQL 17 QA-konténerben migráció + seed; ismételt migrate sikeres |
| Live PostgreSQL funkcióteszt | pending case 404, sitemapból kizárva; live robots és OG működik; hiányzó legal approval blokkolja a leadet; tesztengedélyezés után valódi leadtárolás és idempotencia; hibás origin/consent/extra mező/honeypot/rate limit ellenőrizve |
| Production dependency audit | 0 ismert sérülékenység az ellenőrzés időpontjában; nem penetrációs teszt |
| QA-adatok eltávolítása | ideiglenes felhasználók, médiák és tesztoldalak eltávolítva; fő adatbázis privacy approval továbbra is false; nincs demo-admin |

A 14 fő és 1 admin E2E külön futásban készült; a 7 újraellenőrzés nem további 7 egyedi teszteset. Az admin REST-visszaolvasás a Payload CSRF-origin feltételével történik; anonim kérés a pending médiát nem láthatja.

## Mobilos Lighthouse-labor

Production szerver, Chromium, szimulált mobil, 390×844; utolsó futás. A teljes HTML és JSON riportok az aktuális munkatér `.qa/performance/` könyvtárában vannak.

| Oldal | Performance | Accessibility | Best practices | SEO | LCP | CLS | TBT |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Főoldal | 93 | 100 | 100 | 66 | 2,957 s | 0 | 133 ms |
| TrustPhone | 92 | 100 | 100 | 66 | 2,982 s | 0,00039 | 171 ms |

A kezdeti TTF-fontokkal mért ~6,8 s LCP után a magyar karaktereket megőrző WOFF2-fájlok és a törzsszöveg font-megjelenítési stratégiája jelentősen csökkentette a betöltést. A **2,5 s-os LCP-cél a legutóbbi szimulált laborfutásban még nem teljesült**. Éles CDN/cache, tényleges hálózati környezet és további betöltési optimalizálás szükséges; a 75. percentilis mezőadata nem áll rendelkezésre.

A TBT nem INP. A CLS laborban alacsony; ez nem igazol minden éles interakciót. A SEO 66 pontja a szándékosan tiltott indexelést is tartalmazza: a szerkesztői előnézetet nem szabad pontszám kedvéért indexelhetővé tenni.

A build egy Next metadataBase fallback figyelmeztetést ad; a tesztelt tartalmi oldalak canonical metaadatai és az OG-kép működnek. Éles domainen a `SITE_URL` és a végleges metaadatok újbóli ellenőrzése szükséges.

## Manuális ellenőrzés határai

Asztali és mobilos vizuális ellenőrzés, billentyűzetes menü/rádióválasztó/FAQ/dialog, Escape és reduced-motion ellenőrzés történt. Nem történt teljes képernyőolvasós és valós iOS/Android/Safari eszközparkos audit, éles felhasználói mérés vagy külső penetrációs teszt. WCAG 2.2 AA cél, nem tanúsított megfelelőségi állítás.

## Vizuális átadás

- [Főoldal, asztali első képernyő](previews/home-desktop.png)
- [Főoldal, mobil első képernyő](previews/home-mobile.png)
- [TrustPhone főoldali kiemelés](previews/trustphone-feature.png)

## Környezet

Az `install_script` és `start_skill` a cloud konfigurációs draftba elmentve. A parancsok a tényleges checkoutban lefutottak. A mentés nem publikálás és nem új feladatban igazolt visszaállítás. A felhasználónak az environment settingsben át kell tekintenie és mentenie a módosításokat, majd publikálnia kell a környezetet. A weboldal éles deploymentje ettől külön művelet.
