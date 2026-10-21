# Integrációk és konfiguráció

## Környezeti változók

| Változó | Cél | Alapállapot |
| --- | --- | --- |
| `PAYLOAD_SECRET` | CMS-munkamenet és titkosítás | helyi setup biztonságosan generálja; élesben secret manager |
| `DATABASE_URL` | SQLite file vagy PostgreSQL URI | helyi SQLite |
| `SITE_URL` | canonical, hitelesített preview-redirect, origin-check | fejlesztői alapcím; élesben pontos HTTPS domain |
| `SITE_MODE` | `preview` vagy `live` | preview, noindex |
| `COOKIE_SECURE` | HTTPS-only auth cookie | lokális HTTP-n false, éles HTTPS-n true |
| `PAYLOAD_AUTO_PUSH` | helyi schema-sync | fejlesztéshez true; migrációs/prod út false |
| `LEAD_CAPTURE_ENABLED` | valódi szerveres leadrögzítés | false |
| `CRM_WEBHOOK_URL` | HTTPS fogadó a leadekhez | nincs, helyi leadtárolás lehetséges |
| `CRM_WEBHOOK_TOKEN` | opcionális szerveres Bearer credential | titokként konfigurálandó |
| `START_CHECKOUT_URL` | hosted fizetési szolgáltató | nincs; a checkout zárva |
| `BOOKING_URL` | külső időpontválasztó | nincs; foglalást nem szimulálunk |
| `MAIL_WEBHOOK_URL` | HTTPS tranzakciós levéladapter | nincs; hiba, nem konzolba írt levél |
| `MAIL_WEBHOOK_TOKEN` | opcionális levéladapter-hitelesítés | titokként konfigurálandó |
| `MAIL_FROM_ADDRESS` | jóváhagyott, hitelesített feladó | nincs |
| `NEXT_PUBLIC_ANALYTICS_ENDPOINT` | same-origin opcionális collector | nincs, csak consentelt helyi eseménybusz |
| `CHROMIUM_PATH` / `E2E_BASE_URL` | QA környezet | rendszer Chromium és helyi production szerver |

Credentialt ne adj frontend-változóhoz, CMS szövegmezőhöz, Githez vagy chathez. A `PAYLOAD_SECRET` helyi kriptográfiai titok: egy távoli HTTPS proxyhelyettesítő token nem alkalmas rá. Cloudban a meglévő helyi secret a snapshot része lehet; éles infrastruktúrában tartós secret store és hozzáférés-szabályozás kell.

## START checkout és magyar számlázás

Az adapter egy előre konfigurált HTTPS hosted checkout felületére irányít. A szerver ellenőrzi a START üzleti jóváhagyását, nettó HUF-árát, ÁFA-mezőjét, a publikált ÁSZF és adatkezelés jóváhagyását, valamint a szolgáltatói URL meglétét. A kliens nem adhat meg árat vagy tetszőleges redirect URL-t.

Éles aktiválás előtt döntendő: szolgáltató, pénznem és árazás, B2B/B2C értékesítés, ÁFA-kezelés és esetleges mentesség, magyar számlázó, elállás/digitális teljesítés nyilatkozatai, a tananyag-hozzáférés rendszere. A hosted oldalon a termék/ár és feltételek egyezzenek a CMS-szel.

**Még nem megvalósított:** fizetési session dinamikus létrehozása, hitelesített payment webhook, visszatérítés, számlakiállítás és tananyag-hozzáférés automatikus kiosztása. A `purchase` eseményt kizárólag hitelesített szolgáltatói eseményből szabad majd küldeni. A visszatérési oldal önmagában nem bizonyít fizetést.

## BUILD és CUSTOM leadek

A form eltérő kvalifikációs mezőket kér. Adatgyűjtés csak akkor indul, ha `LEAD_CAPTURE_ENABLED=true`, a `site.privacyApproved=true`, és a publikált `/adatkezeles/` oldal `legalApproved=true`. Addig kizárólag helyi TXT-export működik; nem jön létre lead.

A szerver Zod-sémával validál, 16 KB-nál lezárja a request-streamet, pontos origin-ellenőrzést, honeypotot és egyszerű, folyamaton belüli 5 kérés/10 perc limitet használ. Először a leadet tárolja, utána kísérli meg az opcionális CRM-kézbesítést. Egy UUID kérésazonosítóval az ismételt küldés ugyanazt az elfogadást adja; az adatbázisban unique korlát is van.

CRM payload: `id`, intent, név, e-mail, cég, kvalifikációs mezők, nyilatkozati idő és tájékoztatóverzió. Ezek személyes adatok, ezért kizárólag a jóváhagyott adatfeldolgozó felé továbbíthatók. `Idempotency-Key` header és opcionális Bearer-token, 8 s timeout, redirect tiltva. Sikertelen webhook esetén a helyi lead megmarad és `delivery=failed`. Automatikus retry queue és provider-specifikus mapping nincs; az admin leadlistából operatívan kezelhető.

Többpéldányos éles infrastruktúrában a rate limitet a megbízható reverse proxy/WAF vagy közös tároló valósítsa meg. Csak ellenőrzött proxy írhatja felül az `x-forwarded-for` mezőt; ne legyen közvetlenül internetre nyitva a belső Node port. CAPTCHA csak igazolt spamterhelés esetén indokolt, külön adatvédelmi felülvizsgálattal.

## Időpont és levelek

A booking URL valódi külső felületre vezet. A linkre kattintás nem `book_consultation`; ehhez szolgáltatói visszaigazolás kell. Nincs kitalált szabad időpont vagy foglalási siker.

A Payload tranzakciós mail adapter HTTPS webhookot használ. Konfiguráció nélkül megtagadja a küldést, és nem ír reset linket vagy levelet konzolba. A providerhez szükséges sender verification, SPF/DKIM/DMARC, reset-flow teszt és adatfeldolgozói szerződés éles feladat. A lead-visszaigazoló és opcionális audit-eredménylevél automatizálása külön provider-integráció.

## Hálózati igény

Telepítés: npm registry; eredeti fontforrások már a repositoryban, licenccel. A böngésző nem kér távoli fontot. Futás: a választott PostgreSQL host, CRM, hosted checkout, booking és mail szolgáltató pontos domainjei. Mivel ezek nincsenek kiválasztva, nem került be kitalált proxysecret vagy általános hálózati engedély. A szükséges pontos domaineket az environment settingshez kell majd hozzáadni a meglévő szabályok megőrzésével.
