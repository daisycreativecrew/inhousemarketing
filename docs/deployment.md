# Telepítés és üzemeltetés

## Ellenőrzött helyi workflow

```bash
npm ci --include=dev
npm run setup:local
npm run seed
npm run lint
npm run typecheck
npm test
npm run build
npm run start
```

A dev szerver `npm run dev`. A build és a start parancsot a repository gyökerében kell futtatni. Szükséges állandó fájlok: forrás, lockfile, `.env.local` vagy valódi runtime-beállítások, adatbázis és média. Folyamatokat a cloud snapshot nem őriz meg; új feladatban a szervert újra kell indítani. Meglévő szervert csak akkor állíts le, ha te indítottad és a feladat igényli.

## Új adatbázis explicit migrációval

A SQLite és PostgreSQL migrációk külön vannak: `src/migrations/sqlite` és `src/migrations/postgres`. A CLI az aktuális `DATABASE_URL` alapján a megfelelőt választja. Új, üres adatbázisnál `PAYLOAD_AUTO_PUSH=false` és:

```bash
npm run cms:migrate
npm run seed
npm run cms:migrate
```

A második migrate idempotenciát ellenőriz; nem kell új táblákat létrehoznia. A korábban fejlesztői schema-push által létrehozott adatbázisra ne alkalmazd vakon az initial migrációt: az már tartalmazza a táblákat. Ilyenkor mentés, tesztelt import vagy megfelelő baseline szükséges. Ne használd a `migrate:fresh`/reset parancsot tartalmat tároló adatbázison.

## PostgreSQL éles út

1. Hozz létre külön, korlátozott jogosultságú PostgreSQL adatbázist és felhasználót.
2. Állítsd be a `DATABASE_URL`-t a platform biztonságos beállításaiban; TLS az adatbázisszolgáltató által előírt ellenőrzéssel. Ne kapcsold ki a tanúsítványellenőrzést.
3. Tartós, nagy entrópiájú `PAYLOAD_SECRET`, pontos HTTPS `SITE_URL`, `COOKIE_SECURE=true`, `PAYLOAD_AUTO_PUSH=false`.
4. Migráció → seed/import → build → alkalmazásindítás. A seed nem importálja a meglévő SQLite szerkesztett tartalmát; valódi migrációhoz tartalomexport/import és médiaátvitel szükséges.
5. Első admin létrehozása zárt hálózati elérés mellett, majd jogosultságok kiosztása.
6. `SITE_MODE=preview` a tartalmi és integrációs QA végéig. Éles módot csak jóváhagyások és provider-tesztek után állíts be.

## Média és skálázás

A jelenlegi adapter tartós `media/` fájlrendszert igényel. Egygépes szerveren ez perzisztens kötet lehet; több Node példánynál közös object storage és a Payload megfelelő storage adaptere kell. Egy stateless/serverless feltöltés önmagában nem tartós megoldás. Reverse proxy oldali upload limit legyen legfeljebb 25 MB, a CMS korlátjával összhangban.

## Biztonság és mentés

HTTPS, HSTS a reverse proxynál, korlátozott adminhozzáférés, megbízható proxyheaders, rendszeres adatbázis- és médiamentés, visszaállítási próba. Titkokat ne naplózz és ne tárold Gitben. A szerkesztési napló alkalmazásszinten nem módosítható, de nem helyettesít külső, manipulációbiztos üzemeltetési auditot.

Nincs beépített MFA vagy automatikus lead-adatmegőrzési törlés: ezeket az éles fenyegetési modell és a jogi megőrzési szabályok alapján kell konfigurálni/megvalósítani. A függőségeket rendszeresen ellenőrizni és támogatott verzión tartani kell. Az admin first-user felületet ne hagyd nyitva létrehozott admin nélkül.

## Élesítési kapuk

- jóváhagyott ügyfélállítások és médiatulajdonosi jogok;
- végleges árak, hozzáférés, review-scope és szerződéses feltételek;
- valódi adatkezelői adatok és jogi szövegek;
- fizetési, számlázási, tananyag-hozzáférési és booking integráció tesztelve;
- analitikai provider és consent ellenőrizve, PII nélkül;
- mobilos és billentyűzetes manuális QA, RUM/CWV 75. percentilis követés;
- külső backup és monitoring.

Egy sikeres helyi build vagy elmentett cloud draft nem jelent éles publikálást vagy új cloud feladatban igazolt visszaállítást.
