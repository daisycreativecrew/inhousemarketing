# Tartalomszerkesztési útmutató

## Hozzáférés

`/admin`: első admin regisztráció, majd e-mail/jelszó alapú belépés. Nincs demo-jelszó. Az admin hozhat létre felhasználókat. **editor**: tartalom és draft szerkesztés. **publisher**: publikálás, bizonyítékjóváhagyás, globális márka- és routingbeállítások, leadek. **admin**: ezen felül felhasználók és törlés. Az öt hibás belépés ideiglenes zárolást okoz. Elveszett jelszóhoz konfigurált tranzakciós levélküldés szükséges; addig az admin biztonságos jelszócserével segíthet.

## Oldalak

1. Oldalak → főoldal (`/`) vagy kiválasztott útvonal.
2. Hero: eyebrow, title, accent, intro és két CTA. A slash és az animáció formája designkomponens; a fő értékajánlat szövege szerkeszthető.
3. Sections: blokkok átrendezése, hozzáadása, eltávolítása a kontrollált készletből. Az eltérő blokktípusokat az admin magyar megnevezéssel mutatja.
4. Blokkon belül a title, body, itemek, kapcsolt proof és CTA módosítható.
5. SEO: egyedi title, description, social kép. A noindex tudatosan kezelendő.
6. Mentés draftként → Preview. A Preview bejelentkezett admin-munkamenettel nyit hitelesített előnézetet. A teljes környezet `preview` módja ettől külön állapot.
7. Publisher/admin publikál. Verzióból visszaállítás lehetséges; a dokumentumok utolsó 30 verzióját őrizzük.

A CTA-cél nem lehet JavaScript URL vagy tetszőleges protokoll. Fontos: új, általános tartalmi oldalt kód nélkül létrehozhattok; új checkouttípust vagy új motion scene-t fejlesztő valósít meg.

## TrustPhone és további esetek

Esettanulmányok → ügyfél és slug → bevezető és context → történeti fejezetek → kompetenciák → CTA → SEO. Minden fejezet saját médiát és kapcsolt evidence-elemeket kaphat. Új case automatikusan megjelenik a dinamikus indexen, ha publikált és jóváhagyott.

A jóváhagyáshoz rögzítsd a forrást, az ügyféloldali jóváhagyó nevét és dátumát. A `pending` az alapállapot. **A publikálás és a jóváhagyás külön lépés**: live módban mindkettő szükséges. A régi egyedi együttműködés ne legyen utólag START/BUILD/CUSTOM vásárlásnak feltüntetve.

Az Evidence kollekcióval újrahasználható állítás, idézet, galéria, workflow, videó, timeline, capability és case CTA rögzíthető. A forrás és jóváhagyás hiányát nem pótolja egy szép vizuál. A renderer jóváhagyatlan elemet live módban elrejt. Ne rögzíts kitalált idézetet vagy üzleti mutatót. A puszta jelenlegi feladatlista nem igazol ROAS-t vagy bevételnövekedést.

## Média

Kép: JPEG/PNG/WebP/AVIF. Videó: MP4/WebM, legfeljebb 25 MB. Alt text és forrás kötelező. Jóváhagyás előtt használati jogot és jóváhagyót is rögzíteni kell. A nagy videókat inkább külön optimalizált szolgáltatásból érdemes később beágyazni; nincs autoplay. Az alkalmazás csak jóváhagyott, használati joggal rendelkező képet jelenít meg. A képekhez 800 és 1600 px-es változatok készülnek, a frontend responsive `next/image`-et használ.

## Termék és ár

A három termék fix útvonalú, külön felelősségi szöveggel, tartalommal, kizárásokkal, FAQ-val és CTA-val. A végleges ár HUF nettó árként, az ÁFA külön mezőként kerül rögzítésre. Access duration, review rounds és implementation days üzleti adatok; csak megerősített feltételt írj be. A checkoutot nem nyitja meg önmagában egy ár kitöltése: az üzleti jóváhagyás, a jogi oldalak és a hosted szolgáltatói konfiguráció is kell.

## Self-Audit

Kérdés, válasz, indoklás és a három súly szerkeszthető. A `key` mező technikai azonosító: a `capacity` kulcsot és a harmadik, kapacitástervezésről szóló válasz szemantikáját tartsd meg. A szabályokról részletesen a [journey dokumentum](journeys-analytics.md) ír. Nagy súlymódosítás után ellenőrizd mindhárom tipikus utat.

## Leadek és adatvédelem

Online leadrögzítés csak jóváhagyott adatkezeléssel és engedélyezett konfigurációval működik. A leadnél a `delivery=local` csak helyi rögzítést jelent, a `delivered` a webhook HTTP-sikerét, a `failed` kézbesítési hibát. Ezek egyike sem automatikus értékesítési siker. A megőrzési idő, törlési rutin és adatfeldolgozói lista jogi/üzemeltetési feladat.

Az előnézeti figyelmeztetést ne tartalomszerkesztéssel tüntesd el. Az élesítési feltételeket a környezeti beállítás és a kiadói jóváhagyások együtt szabályozzák.
