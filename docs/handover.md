# Átadási jegyzék

Állapot: ellenőrizhető fejlesztői megvalósítás, alapértelmezetten jelölt szerkesztői előnézet. **Nem éles kereskedelmi indulás.** Az alábbi kategóriák külön kezelendők; egy kész felület nem igazol szolgáltatói fizetést vagy ügyféljóváhagyást.

## Megnyitás és verziómentés

A megnyitás és a saját adminfiók létrehozásának lépései a [megnyitási útmutatóban](megnyitas.md) vannak. A `review/inhouse-preview` tesztág teljes forráskódot, migrációkat, seed tartalmakat, teszteket, dokumentációt és a korábbi három PNG-képernyőképet tartalmazza. A Codespaces-indító a saját GitHub-fiókodban hoz létre privát tesztkörnyezetet; nem módosítja az éles domaint. Az indító link nem egy már futó tesztszerver URL-je.

A `.env.local`, titkok, helyi adatbázis, adminfiókok és feltöltött média kizártak a Gitből. A Codespace szerkesztéseihez külön adatbázis- és médiamentés szükséges; a GitHubra feltöltött kód nem ezek biztonsági mentése.

## IMPLEMENTED

- Magyar nyelvű, saját vizuális karakterű főoldal; rögzített paletta és három önállóan hosztolt brand font; mobilra külön kompozíció.
- Korai, kvalitatív TrustPhone-előnézet; teljes hatfejezetes esettanulmány; kilencterületes interaktív kompetenciaválasztó; átadható működés bemutatása. Nincs kitalált szám, idézet, ügyfélfotó vagy kampányeredmény.
- START, BUILD, CUSTOM oldalak felelősségi különbséggel, tartalommal, kizárásokkal, termékhez illő CTA-val és valódi kérdésekre válaszoló FAQ-val; ár-összehasonlítási út.
- Módszertan, rólunk, kapcsolat, esettanulmány-index, tudástár, három szerkesztett szakmai cikk, checkout-keret, BUILD- és CUSTOM-flow, jogi oldalak szerkezeti kerete és 404.
- Hétkérdéses Self-Audit; determinisztikus, CMS-ből módosítható súlyozás; visszalépés és válaszmódosítás; e-mail-kapu nélküli eredmény és kapacitásfigyelmeztetés.
- Payload admin: szerepkörök, draft/publish, preview, verziók, médiafeltöltés, alt text, használati jog és bizonyítékjóváhagyás, kontrollált rendezhető szekciók, leadlista, szerkesztési napló. Új case és cikk fejlesztő nélkül létrehozható.
- Külön bizonyítéktár 12 tartalomtípussal és forrással; újrahasználható biztonságos renderer; publikálási és hozzáférési kapuk. A case-, capability-, workflow-, quote- és médiaanyagok valós tartalommal tölthetők fel.
- CSS-alapú egyszer lefutó hero, viewporthoz kötött strukturált mozgások, interaktív útválasztó, részletes termékpreview natív dialoggal, microinteractionök, teljes reduced-motion változat. A részletes M01–M10 megvalósítási és egyszerűsítési döntések a design dokumentumban vannak.
- SSR tartalom, egyedi metaadat, canonical, OG-kép, breadcrumb és releváns JSON-LD, dinamikus sitemap/robots; previewban noindex és üres sitemap. A live mód nem közöl jóváhagyatlan case-t.
- Consentelt, PII-t szűrő eseménybusz. Konfiguráció nélkül nincs külső tracker.
- Valódi szerveres leadtárolás: jogi kapuk, validáció, origin-check, requestméret-limit, honeypot, rate limit, idempotencia, opcionális CRM HTTP-adapter. Kikapcsolt adatgyűjtés mellett a kitöltés csak a felhasználó gépére exportálódik.
- Hosted checkout konfigurációs és jogi kapukkal, valamint HTTPS mail- és booking-integrációs pontok; konfigurálatlan állapotban nincs hamis siker.
- Verziózott PostgreSQL- és SQLite-migrációk, ismételhető seed, `.env.example`, telepítési és szerkesztési dokumentáció.

## NEEDS CONTENT

- [ ] TrustPhone teljes szövegének ügyféloldali jóváhagyása, jóváhagyó és dátum.
- [ ] TrustPhone-logó használati engedélye; valódi termékfotó, munkatársportré és marketinganyagok.
- [ ] Ügyfélinterjú és ténylegesen jóváhagyott idézet, ha rendelkezésre áll.
- [ ] Opcionális metrikák csak ellenőrizhető forrással; ezek hiánya nem akadálya a kvalitatív történetnek.
- [ ] DCC szakértői profilok, portrék és hitelesíthető szakmai háttér.
- [ ] Valódi START/BUILD termékassetek és teljes végleges tananyaglista.
- [ ] Végleges logófájl, kapcsolattartási és teljes céges adatok.
- [ ] Jogász által véglegesített adatkezelés és ÁSZF.

Hiányzó asset helyén nincs élesnek tűnő hamis bizonyíték. A telefon saját narratív illusztráció; a munkalapok koncepcióként vannak jelölve. Live módban a jóváhagyatlan történet és proof elrejtett.

## NEEDS CONFIGURATION

- [ ] Éles HTTPS domain és `SITE_URL`, tartós `PAYLOAD_SECRET`, biztonságos auth cookie.
- [ ] Éles PostgreSQL és tartós média/object storage, mentés és monitoring.
- [ ] CRM fogadó, field mapping, hitelesítés és adatfeldolgozói beállítások.
- [ ] Valódi fizetési/checkout-, számlázó- és tananyag-hozzáférési szolgáltatás.
- [ ] Naptár és hitelesített foglalási callback.
- [ ] Tranzakciós mail endpoint, hitelesített feladó és kézbesítési teszt.
- [ ] Analitikai provider és consent-integráció; collector és dashboard.
- [ ] Konkrét külső domainek hálózati engedélyezése a szolgáltatóválasztás után.

## NEEDS DECISION

- [ ] START és BUILD végleges nettó/bruttó ár, adózási és vásárlói kör.
- [ ] START-hozzáférés időtartama, tételes tartalom és teljesítés.
- [ ] BUILD implementáció időtartama, belső kapacitás, review-k száma és szakértői keretek.
- [ ] CUSTOM scope, árazás, személyes munka és handover/utánkövetés feltételei.
- [ ] Fizetési, számlázási, CRM-, booking- és e-mail-szolgáltató.
- [ ] Adatmegőrzés, adattovábbítás és végleges jogi nyilatkozatok.

## NOT IMPLEMENTED

- Provider-specifikus dinamikus payment session, hitelesített payment webhook, számla, refund és tananyag-hozzáférés automatikus kiosztása.
- Valódi naptárfoglalás-visszaigazolás, lead-visszaigazoló és audit-eredménylevél automatizálása.
- Konfigurált GA4/GTM/Ads/Meta/TikTok és üzleti dashboard; `purchase` és `book_consultation` csak a valódi integráció után aktiválható.
- CRM retry queue, többpéldányos közös rate limit, automatikus adatmegőrzési törlés és admin-MFA.
- Éles felhasználói Core Web Vitals/RUM, teljes manuális WCAG-tanúsítás és valós eszközparkos kompatibilitási audit.
- Filmes ügyfélvideó-alapú motion jelenetek: jóváhagyott valós média nélkül a megvalósítás CSS/SVG-jellegű rendszerábrákat és editorial kompozíciót használ.
- Éles deployment, domainváltás, valós fizetés vagy ügyfélnek küldött levél. Cloud-konfiguráció mentése külön lépés a publikálástól.

## Ellenőrzés és bizonyíték

A futtatási parancsok a README-ben, az automatizált ellenőrzések a `tests/` és `scripts/qa-*` alatt vannak. A build, lint és typecheck exit státusza ellenőrizendő. A böngészős teszt 20 útvonalat, három auditkimenetet, CTA-kat, modált, űrlapexportot, hozzáférési kapukat, 360/390/768/1024/1280/1440 px szélességet és axe hozzáférhetőségi ellenőrzést fed le. Ez nem helyettesít teljes manuális auditot.

A külön admin-QA ideiglenes, véletlen jelszavú tesztfiókokkal ellenőrzi a szerkesztés, publikálás, preview és média feltöltését. A fixture-fiókok és tesztdokumentumok utána törlődnek; nincs hátrahagyott demo-admin. A PostgreSQL live-QA elkülönített adatbázison ellenőrzi a jóváhagyatlan case kizárását és a valós, idempotens leadrögzítést; nem módosítja a fő tartalom jogi jóváhagyásait.

Lighthouse-laboreredmények: `.qa/performance/summary.json`, teljes HTML/JSON riportok ugyanott. A preview szándékos noindex állapota rontja a SEO laborpontot; ez nem automatikusan javítandó. Az LCP/INP/CLS 75. percentilis céljai csak éles forgalomból minősíthetők. A végső mért értékeket a QA-jegyzék rögzíti.
