# IN/HOUSE MARKETING

Next.js + Payload CMS alapú, magyar nyelvű marketing- és értékesítési rendszer. Greenfield megvalósítás: a korábbi weboldal nem szolgált kreatív vagy technikai kiindulópontként.

## Megtekintés saját gépre telepítés nélkül

**[Tesztverzió indítása GitHub Codespaces-ben](https://codespaces.new/daisycreativecrew/inhousemarketing?ref=review%2Finhouse-preview)**

A tesztágon válaszd a GitHub **Code → Codespaces → Create codespace** lehetőséget. A telepítés és indítás automatikus; utána a **Ports → 3000 → Open in Browser** nyitja meg a privát, HTTPS-es tesztoldalt. A saját adminfiók ugyanennek a címnek az `/admin` útvonalán hozható létre. A Codespaces használata a GitHub-fiókod keretét fogyaszthatja; a létrehozás előtt ellenőrizd.

**[Pontos megnyitási és adminregisztrációs útmutató](docs/megnyitas.md)**

A mentett képeket GitHubon közvetlenül is megtekintheted: [asztali főoldal](docs/previews/home-desktop.png), [mobil főoldal](docs/previews/home-mobile.png), [TrustPhone-kiemelés](docs/previews/trustphone-feature.png). Ezek statikus képek; a kattintható tesztverzió a Codespace-ben fut.

## Indítás

Node.js 22.16+ (ellenőrizve: 24.19), npm és Chromium a böngészős tesztekhez.

```bash
npm ci
npm run setup:local
npm run seed
npm run dev
```

A `setup:local` saját helyi titkot generál a gitből kizárt, 0600 jogosultságú `.env.local` fájlba, és megőrzi a már meglévő beállításokat. A seed ismételhető: a meglévő oldalakat nem írja felül. A fejlesztői SQLite-adatbázis `.data/inhouse.db`, a média `media/` alatt található. Az első, kizárólag automatikus schema-push alapú helyi előkészítést fejlesztői módban futtasd. Production adatbázisnál használd a verziózott migrációkat; lásd [deployment](docs/deployment.md).

Az admin útvonala `/admin`. Az első felhasználót a **Create first user / Első felhasználó létrehozása** képernyőn kell létrehozni; automatikusan admin lesz. Nincs beépített jelszó vagy automatikus bejelentkezés. Éles hálózati megnyitás előtt hozd létre az első admint, és állíts be HTTPS-t.

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm run start
# Futó production szerver mellett:
npm run test:e2e
npm run audit:performance
```

Alapértelmezett böngésző: `/usr/bin/chromium`; más telepítéshez `CHROMIUM_PATH`, más futó szerverhez `E2E_BASE_URL` adható meg. A cloud feladat saját izolált checkoutot használ. Ne hozz létre további Git worktree-t külön felhasználói kérés nélkül.

## Előnézet és élesítés

Az alapállapot `SITE_MODE=preview`: látható előnézeti jelölés, noindex, tiltó robots, üres sitemap. Az ellenőrizendő TrustPhone-történet itt olvasható. `SITE_MODE=live` mellett csak publikált, jóváhagyott esettanulmány és bizonyíték jelenik meg. A médiánál külön használatijog-jóváhagyás szükséges.

A jelentkezések alapállapotban nem küldenek adatot: helyi szöveges összefoglalót töltenek le. A jogi és konfigurációs kapukat a szerver is ellenőrzi. A checkout nem szimulál fizetést.

## Dokumentáció

- [Architektúra, tartalommodell és döntések](docs/architecture.md)
- [Kreatív rendszer, layout és motion storyboard](docs/design-system.md)
- [Felhasználói utak és mérés](docs/journeys-analytics.md)
- [Integrációk és környezeti változók](docs/integrations.md)
- [CMS szerkesztési útmutató](docs/editor-guide.md)
- [Deployment és üzemeltetés](docs/deployment.md)
- [Átadás, hiányzó anyagok és QA](docs/handover.md)

A mellékelt PDF-ek stratégiai forrásként szolgáltak. A közvetlen projektbrief elsőbbséget kapott az eltérő wireframe-ekkel, korábbi árakkal, időtartamokkal és csomagnevekkel szemben.
