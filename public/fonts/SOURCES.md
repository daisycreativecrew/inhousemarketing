# Fontforrások

Google Fonts hivatalos repository, HTTPS letöltés. Az OFL licencfájlok ebben a könyvtárban vannak. A futó oldal kizárólag a magyar karaktereket megtartó, helyben hosztolt WOFF2 fájlokat használja.

- archivo-black: https://raw.githubusercontent.com/google/fonts/main/ofl/archivoblack/ArchivoBlack-Regular.ttf
  - Eredeti SHA-256: `dd9a89a019b4849f66ab75455fe7bdf931311042cbb0f0f97acc061539703180`
- ibm-plex-sans: https://raw.githubusercontent.com/google/fonts/main/ofl/ibmplexsans/IBMPlexSans%5Bwdth,wght%5D.ttf
  - Eredeti SHA-256: `3b031aa4216174205bd8471f88a49b91f093169e9e87bd5262242bc5967fe2e3`
- source-serif: https://raw.githubusercontent.com/google/fonts/main/ofl/sourceserif4/SourceSerif4%5Bopsz,wght%5D.ttf
  - Eredeti SHA-256: `97b2d4da6e3cb494b5a1e66ae176914d852ccabef49e0c02c0df25f3e39aca0b`

Subset: U+0000–024F, U+1E00–1EFF, U+2000–206F és U+20AC, OpenType layout megőrzésével, FontTools + Brotli. Archivo Black statikus; IBM Plex Sans szélesség 100, súly 400–700; Source Serif 4 optikai méret 24, súly 400. A serif betű nem preloadolt. Az eredeti TTF-ek auditálható forrásként maradtak meg; a frontend nem hivatkozik rájuk.
