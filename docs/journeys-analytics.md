# Felhasználói utak és mérés

## Journey map

| Út | Belépés és első kérdés | Szükséges bizonyíték | Következő döntés / CTA | Cél / mérés |
| --- | --- | --- | --- | --- |
| A / cégvezető | hirdetés vagy keresés → „Nálunk is így működik?” | meglévő kollégából induló TrustPhone-történet, csak jóváhagyva | saját kapacitás → Self-Audit | termékoldal, checkout vagy jelentkezés; hero/case/audit/select események |
| B / belső marketinges | workflow cikk → „Hogyan ne rajtam múljon minden?” | dokumentált feladat és átadható tudás; koncepciót elkülönítő builder-belenézés | BUILD-fit → jelentkezés | form start/submit, helyi lead, CRM-kézbesítési státusz |
| C / insourcing | ajánlás, LinkedIn, keresés → „Hogyan marad nálunk a tudás?” | részletes case, módszertan és hitelesített szakértők | CUSTOM scope → audit | audit start, generate_lead; később CRM qualification/won |
| D / hideg látogató | főoldal → „Melyik való nekünk?” | problémához kapcsolt jóváhagyott proof | helyzetválasztó vagy Self-Audit | persona_select → recommended_package → select_package |
| E / case-belépés | TrustPhone → „Nálunk ez hogyan nézne ki?” | a történet és a megadott feladatkörök, kitalált KPI nélkül | módszer vagy saját helyzet | chapter_view → case_cta → Self-Audit/termék |

Minden fő oldalról továbblépés van: termék, módszer, Self-Audit, cikk vagy intenthez illő kapcsolat. A jogi és checkout-keretek is visszavezetnek a döntési útra. A START közvetlen checkout-út, a BUILD kvalifikált jelentkezés, a CUSTOM auditkérés. Az integrálatlan fizetés és naptár nem kap sikerüzenetet.

## Self-Audit scoring

A globális `audit` modell hét kérdést tartalmaz. Minden válasz három egész súlyt ad: START, BUILD, CUSTOM. A szerverről kapott kérdésmodell alapján a kliens determinisztikusan összegzi a kiválasztott súlyokat. Legnagyobb összeg nyer; holtverseny: BUILD → START → CUSTOM. Az eredményhez minden választott indoklás megjelenik. Ha a `capacity` kérdés harmadik válasza jelölt, külön kapacitástervezési figyelmeztetés jelenik meg. Nincs százalék, diagnózis vagy garantált alkalmasság. A súlyok és szövegek adminban módosíthatók; a kulcsnevek szemantikája kódszerződés.

Az eredmény nem kér e-mailt és nem tárolódik szerveren. Az opcionális eredményküldés későbbi tranzakciós integráció; jelenleg nincs úgy feltüntetve, mintha működne.

## Eseménytérkép

Minden esemény `src/lib/analytics.ts` engedélylistáján szerepel. A paraméterkulcsok és értékformátumok szűrtek. Név, e-mail, szabad szöveg, cégadat és teljes URL/query nem kerül analitikai payloadba. Alapértelmezett állapot: denied. Hozzájárulás után helyi dataLayer/custom event és opcionális same-origin collector. Visszavonás után új eseményt nem küld.

| Esemény | Trigger / állapot |
| --- | --- |
| `hero_cta_click` | fő hero elsődleges CTA |
| `trustphone_case_view` | teljes TrustPhone-oldal route-megtekintése |
| `trustphone_chapter_view` | fejezet legalább 15%-a viewportba ér |
| `trustphone_case_cta_click` | featured vagy case-záró CTA |
| `proof_interaction` | hero proof, állítás melletti link, kompetenciaválasztó |
| `persona_select` | helyzetválasztó módosítása |
| `self_audit_start` | első válasz |
| `self_audit_complete` | teljes válaszsor és determinisztikus javaslat |
| `package_view` | termékblokk vagy termékhero viewport |
| `select_package` | konkrét termékoldalra lépés |
| `begin_checkout` | engedélyezett hosted checkout elindítása |
| `purchase` | csak hitelesített szolgáltatói fizetés után; nincs bekötve, nem szimulált |
| `build_application_start` | BUILD-form első fókusza |
| `build_application_submit` | szerver által tartósan elfogadott BUILD-lead |
| `custom_audit_start` | CUSTOM-form első fókusza |
| `generate_lead` | valódi, tartós leadrögzítés; helyi exportnál nem fut |
| `book_consultation` | kizárólag visszaigazolt booking; nincs bekötve |
| `faq_expand` | konkrét FAQ megnyitása |
| `form_error` | sikertelen szerveres beküldés |

A böngészős chapter-view nem igazolja a szöveg elolvasását. A hiányzó hozzájárulás és a blokkolt mérés miatt az eseményszámok nem azonosak a teljes látogatottsággal. Az elsődleges üzleti forrás az elfogadott lead és a később bekötött szolgáltatói állapot.

## Külső analitika

GA4/GTM/Ads/Meta/TikTok nem töltődik automatikusan. Provider és jogi döntés után az adaptert a meglévő consent boundaryhoz kell kötni, a Consent Mode v2 négy állapotát megfelelő sorrendben inicializálni, majd Tag Assistanttal ellenőrizni. A jelenlegi belső consent-események nem jelentenek hitelesített Google-integrációt. Fizetési és CRM-webhookoknál idempotens szerveres eseményküldés szükséges.

Üzleti funnel: START view → checkout → paid → hozzáférés; BUILD audit/template → jelentkezés → qualified → fit → sale; CUSTOM case → audit → discovery → scope → proposal → won → handover. A hozzáférés-kiosztás és CRM-életciklus-automatizálás a szolgáltatók kiválasztása után készítendő el.
