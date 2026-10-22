# A tesztverzió megnyitása és a saját adminfiókod

Ez a repository a weboldal tényleges forráskódját tartalmazza. Az alábbi Codespaces-folyamat teljes Node.js-alkalmazást indít adatbázissal és adminnal; nem statikus képbemutató.

## Megnyitás böngészőben

1. Lépj be a GitHubba azzal a saját fiókoddal, amely hozzáfér a `daisycreativecrew/inhousemarketing` repositoryhoz.
2. Nyisd meg a tesztágat, majd a **Code → Codespaces → Create codespace** lehetőséget. Ha közvetlen Codespaces-indító linket kaptál, az már a tesztágat választja ki.
3. Ha a GitHub a gép típusát kéri, válassz legalább **4 magos** gépet. Ellenőrizd a rendelkezésedre álló keretet: a Codespaces használata díjköteles lehet. A létrehozás a saját fiókodban történik.
4. Várd meg a telepítés és build végét. A környezet automatikusan létrehozza a saját fejlesztői adatbázisát és elindítja a weboldalt. Nem kell API-kulcsot vagy előre megadott adminjelszót beírnod.
5. A **Ports / Portok** panelen keresd a **3000 — IN/HOUSE weboldal és admin** sort. A láthatóság maradjon **Private / Privát**. Kattints az **Open in Browser / Megnyitás böngészőben** ikonra. Ez a tényleges, HTTPS-es tesztoldal címe.

Az URL-t a GitHub adja, a saját Codespace nevéből. Nem szükséges, hogy a fejlesztői gép `localhost` címe elérhető legyen nálad. Az oldalhoz a GitHub-bejelentkezésed ad hozzáférést; a tesztportot ne állítsd publikusra.

Ha nem nyílik meg automatikusan, a Codespaces termináljában futtasd:

```bash
npm run preview:serve
```

A parancs kiírja az adott környezet valódi weboldal- és admincímét. Nem indít második szervert, ha a tesztoldal már fut. A build hiányát vagy az idegen, foglalt portot egyértelműen jelzi.

## Ha „recovery mode” jelenik meg

A helyreállítási mód azt jelenti, hogy a környezet létrehozása valamelyik lépésnél megállt. Ilyenkor az npm- vagy szerverindító parancsokat még ne ebben a tartalékkonténerben futtasd; először a létrehozást kell helyreállítani.

2026. október 22-én reprodukált és javított hiba: a Node 22-höz tartozó npm 10 hiányzó opcionális peer-függőségi bejegyzéseket talált a korábban npm 11-gyel mentett zárolófájlban. A `postCreateCommand` első, `npm ci` lépése emiatt `EUSAGE` hibával leállt. A javított `package-lock.json` ugyanazon a `review/inhouse-preview` ágon érhető el.

A meglévő Codespace helyreállításához:

1. A Codespaces **Terminal** paneljén, az `inhousemarketing` repository mappájában futtasd:

   ```bash
   git pull --ff-only origin review/inhouse-preview
   ```

2. Nyisd meg a parancspalettát: macOS-en **⌘⇧P**, Windows/Linux alatt **Ctrl+Shift+P**. Válaszd: **Codespaces: Rebuild Container**.
3. Várd meg az újraépítést és a telepítési/build lépések végét. Utána **Ports → 3000 → Open in Browser**, továbbra is privát porttal.

A frissítés és újraépítés nem igényli a Codespace törlését. A workspace-ben lévő `.env.local`, adatbázis és feltöltések megmaradnak. A `git pull --ff-only` helyi változások vagy eltérő ágtörténet esetén megáll; ilyenkor ne reseteld a munkádat, hanem ellenőrizd a hibaüzenetet.

Ha a frissítés után is helyreállítási mód jelenik meg, a **View Creation Log** napló végén található az eredeti hibás parancs. A `/home/node` jogosultsági hibák megjelenhetnek már a tartalékkonténerben is, ezért önmagukban nem azonosítják a létrehozás eredeti hibáját. A napló utolsó sorai a terminálban is kiolvashatók:

```bash
tail -n 60 /workspaces/.codespaces/.persistedshare/creation.log
```

## Saját adminfiók létrehozása

1. A már megnyitott tesztoldal címének végére írd: **`/admin`**.
2. Friss tesztadatbázis esetén az **Első felhasználó létrehozása / Create first user** képernyő fogad.
3. Töltsd ki az **Email**, **New Password**, **Confirm Password** és **Name** mezőket a saját adataiddal. A jelszót kétszer add meg; ne küldd chatben és ne írd a repositoryba.
4. A **Role** mező alapértékét nem kell módosítanod. Kattints a **Create** gombra. Az első felhasználó automatikusan **admin** jogosultságot kap, a mező kezdeti értékétől függetlenül; nincs közös demo-fiók.
5. Később ugyanitt az e-mail-címeddel és jelszavaddal jelentkezhetsz be.

Ha **Login / Bejelentkezés** képernyőt látsz, abban az adatbázisban már van felhasználó. Használd a korábban ott létrehozott fiókodat; ne töröld az adatbázist. A regisztráció az e-mail-cím tulajdonjogának ellenőrzését nem küldi ki, és a jelszó-visszaállító levél konfiguráció nélkül nem működik. Őrizd meg a jelszavadat biztonságos jelszókezelőben.

Az admin-fiók és a tartalomszerkesztések ebben a Codespace-ben maradnak meg. A környezet leállítása megőrzi őket, a **Codespace törlése** viszont törli a helyi adatbázist és médiafájlokat is. Ezek nem kerülnek automatikusan GitHubra. Új Codespace új tesztadatbázist és új első-admin regisztrációt jelent.

## Mit nézz végig először?

| Felület | Ellenőrizendő |
| --- | --- |
| Főoldal | vizuális irány, első képernyő, korai TrustPhone-történet |
| TrustPhone | teljes történet, skill map, mobilos olvasás |
| START / BUILD / CUSTOM | különbségek és megfelelő következő lépés |
| Self-Audit | hét kérdés és e-mail nélküli eredmény |
| Admin → Oldalak → `/` | hero szöveg módosítása, draft/preview, megjelenés |

Az admin **Publish** gombja kizárólag ennek a tesztadatbázisnak a tartalmát publikálja. Nem módosítja az éles domaint. A Codespaces-indító mindig jelölt preview módot használ, a valódi leadküldés és a fizetési átirányítás kikapcsolva marad.

## Leállítás és folytatás

Amikor végeztél, a GitHub Codespaces felületén **Stop codespace**. A használat később ugyanott folytatható, a szerver újraindul. A szervert külön az `npm run preview:stop` állítja le. Ne töröld a Codespace-t, amíg a benne lévő szerkesztéseket és feltöltött anyagokat nem mentetted ki.

## Korlátok

A jelenlegi Codex-környezetből nincs támogatott, a felhasználó felé megosztható port-előnézeti eszköz. A GitHub API itt nem érhető el, így a Codespace tényleges létrehozása és a fiókod jogosultságának/keretének ellenőrzése a GitHub felületén történik. Az indító link ezért indítási lehetőség; nem egy már futó tesztszerver címének állítása.
