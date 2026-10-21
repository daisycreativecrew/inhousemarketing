# Kreatív rendszer és motion storyboard

## Koncepció

**CHAOS → STRUCTURE → CONTROL.** A hero saját rendszerábrája a különálló content/social/ads/creative/measurement feladatokat közös IN/HOUSE mag köré rendezi. A szöveg és a CTA azonnal olvasható; az egyszer lefutó mozgás nem késlelteti a döntést.

Az első érdemi szekció a TrustPhone emberi története. A törtfehér editorial környezet és a terrakotta tárgyillusztráció ritmust vált a technikai hero után. Az illusztráció saját CSS-kompozíció, világos „nem ügyfélfotó” felirattal. Sem az illusztráció, sem a szerkeszthető termékboard nem bizonyíték.

## Tipográfia és tokenek

Archivo Black: rövid, erős főcímek. IBM Plex Sans: olvasható UI és bekezdések. Source Serif 4: emberi történet, editorial hangsúly. A három font önállóan hosztolt, OFL-licenccel együtt; nincs futás közbeni Google Fonts-kérés. `next/font/local` biztosítja a fontoptimalizálást. Az Archivo és a serif swap, a törzsszöveg optional megjelenítést használ: lassú első betöltéskor a metrikailag igazított rendszerbetű marad olvasható, késői törzsszöveg-újrafestés nélkül.

| Token | Érték | Szerep |
| --- | --- | --- |
| black | `#0B0B0B` | alap, sötét editorial |
| graphite | `#1E1E1E` | rendszerfelület |
| graphite-2 | `#2C2C2C` | input és határvonal |
| warm-white | `#F4F2ED` | szöveg és történeti felület |
| lime | `#C6FF00` | CTA, aktív út és jelzés |
| terracotta | `#C4623A` | emberi történet, slash, nagy hangsúly |
| muted-grey | `#8C8C88` | sötét felületen másodlagos szöveg |

A paletta nem bővült. A finom keverékek kizárólag ezekből készülnek. Világos felületen a kis szöveg fekete/grafit; terrakotta nem kerül alacsony kontrasztú apró szövegre.

Konténer: legfeljebb 1320 px. Oldalmargó: desktop 56 px, tablet 36 px, mobil 20 px. Tipográfia `clamp()` skálával, hosszú magyar szavak tördelési védelemmel. Alapköz 8 px; fő szekcióköz 112 / 65 px. Formok és CTA-k minimum 44–54 px interakciós magassággal. Visszafogott, jellemzően 2–4 px sarkok; a rendszer moduljai nem egyforma lekerekített SaaS-kártyák.

## Desktop és mobil kompozíció

Desktop: kéthasábos hero, önálló, műszaki rendszerábra; kétoszlopos történeti nyitás; hatcsomópontos architektúra; három termékút egymás mellett; kéthasábos útválasztó. Mobil: a fő üzenet és CTA megelőzi a rendszerábrát, a proof rögtön utánuk olvasható; a történet natívan görgethető; a folyamat függőlegessé válik; a skill map 3×3 kompakt választó, alatta olvasható feladatleírással; egyoszlopos termékek és formok. Nincs vízszintes görgetésre kényszerített ártábla.

## TrustPhone ritmus

1. **A kezdet:** kevés elem, nagy cím, termékfotózás mint felfedezett képesség.
2. **A lehetőség:** a tulajdonos felismerése; nem előre megígért alkalmasság.
3. **Az átalakulás:** interaktív kompetenciaválasztó a megadott kilenc feladatcsoporttal.
4. **A működés:** az eredeti feladatból átadható tudás és delegálható működés.
5. **A lényeg:** a tudás a cégnél marad; nincs számszerű oksági állítás.
6. **A ti cégetek:** feltételes lehetőség, majd Self-Audit és módszertani CTA.

A teljes szöveg normál HTML-ben olvasható; nincs kötelező intro, időzített olvasás vagy sticky scroll-fogság.

## Motion specifikáció

Alap easing: `cubic-bezier(.22,1,.36,1)`. `prefers-reduced-motion: reduce` esetén nincs animáció, elmozdulás vagy smooth scroll. Minden tartalom és interakció változatlanul elérhető.

| ID | Narratív cél és trigger | Idő / technológia | Desktop / mobil | Kockázat és elfogadás |
| --- | --- | --- | --- | --- |
| M01 | különálló feladat → közös rendszer; első render | 720 ms + legfeljebb 220 ms stagger, CSS transform/opacity | rétegzett diagram / kompakt statikus méretű diagram | nincs loop, intro összesen <1.1 s; copy és CTA soha nem rejtett |
| M02 | tárgytól az emberi lehetőségig; történet viewport + pointer | 600–900 ms CSS | editorial belépés, finom tárgyszög / folyamatos natív görgetés | nem ügyfélfotó, nem screenshot; a felirat mindig látszik |
| M03 | kompetenciák kibontása; skill kiválasztása | 240 ms CSS állapotváltás + React | 3×3 map / kompakt 3×3 választó | nem véletlen ikonok; mind a kilenc feladat olvasható és billentyűzettel elérhető |
| M04 | egy szerep → átadható tudás; 4. fejezet viewport | 600 ms CSS csoportreveal | vízszintes kapcsolati modell / függőleges rendszer | nem sugallja, hogy egy ember végez mindent; nincs scroll-scrub |
| M05 | probléma melletti proof; proof viewport és link | 600 ms CSS, 18 px maximum mozgás | állítás melletti blokk / közvetlenül alatta | jóváhagyás nélkül live módban elrejtett; a szöveg nem függ animációtól |
| M06 | hatlépéses rendszer megértése; viewport | 600 ms, 55 ms lépésenként CSS stagger | vízszintes, majd 3×2 / függőleges folyamat | nincs layout méretanimáció; mind a hat lépés HTML-ben jelen van |
| M07 | eltérő felelősségű utak; click/focus | 240 ms CSS állapot + React | kéthasábos route selector / egymás alatti választó és eredmény | `aria-pressed`, élő eredmény; a CTA a kiválasztott termékoldalra vezet |
| M08 | konkrét munkafolyamat; tab/preview gomb | 160–240 ms CSS, natív dialog | rétegzett board / egyszerűsített munkalap | egyértelmű koncepciójelölés, Esc és fókuszkezelés natív dialoggal |
| M09 | irányított következő lépés; hover/press/submit | 160 ms, nyíl +3 px; CSS | pointer microinteraction / tap állapot | nem mozgat szöveget olvasás közben; küldés alatt disabled, nincs hamis siker |
| M10 | strukturáló slash a történet és döntés között | statikus kompozíció + szekcióreveal | nagy slash a zárásnál / rövidített motívum | nincs drága clip-path wipe; reduced motionban ugyanaz a történeti tagolás |

A mozgás tervének tudatos egyszerűsítése: nincs GSAP-os pinning vagy filmes videóoverlay, mert nincs jóváhagyott ügyfélmédia, és a natív scroll jobb olvashatóságot biztosít. Az assetek jóváhagyása után a CMS media mezői fogadják a valódi anyagokat.

## Komponensek és állapotok

Navigáció: desktop, aktív link, mobil nyitott/zárt, Escape. Gomb: alap, hover, focus, active, disabled/loading. Link: szöveges és CTA. Form: label, helper, natív validity, szerverhiba, loading, valós siker, adatküldés nélküli export. FAQ: natív details/summary, nyitott és billentyűzetes állapot. Modal: natív dialog, backdrop, Esc, visszaadott fókusz. Termék: három felelősségi variáns. Story: fejezet, kompetenciatérkép, kvalitatív előtte/utána. Bizonyíték: forrással és jóváhagyással rendelkező kontrollált tartalom. Self-Audit: progress, rádióválasz, vissza/előre, eredmény, módosítás. Preview: kiválasztott munkalap, részletes nézet, koncepciójelölés.
