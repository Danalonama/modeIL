# Removed brands

Brands taken off ModeIL, with the reason and everything needed to put one back.
To restore a brand: paste its entry back into the `DESIGNERS` array in `index.html`, its line back into `DESC_HE`, its address into `STORE_ADDRESSES` and name into `MAP_BRANDS` (if it had a store), its pin back into `Map.html`, then run `node scripts/build-seo.mjs` and `node scripts/build-journal.mjs`.

Earlier removals (Vanzen, Mikusha-Mela, Berni, Belov, Two Tone, Gelada, Gideon Oberson, Jin-G, Yodfat…) are recorded in `docs/PROJECT-NOTES.md` and the task board, not here.

## 20 Nov 2026: editorial cleanup (9 brands)

| Brand | Website | Instagram | Store | Reason |
|---|---|---|---|---|
| Vivo | https://vivoofficial.com/ | — | online only | Editorial call: didn't fit the index's look |
| Vandalized | https://www.vandalized.store/ | @VandalizedAes | online only | Editorial call: didn't fit the index's look |
| YYS | https://yys.co.il/ | @yys.il | online only | Editorial call: didn't fit the index's look |
| Reut Harel | https://reutharel.com/ | @reutharelofficial | online only | Editorial call: didn't fit the index's look |
| Not For Sale | https://notforsaletlv.com/ | @notforsale_tlv | online only | Not a designer: a Tel Aviv streetwear boutique that mostly resells foreign brands (adidas, Vans, Dr. Martens) with a small own line. Supersedes the 8 Nov 'keep on both' call. |
| Nefartiti | https://www.nefartiti.co.il/ | — | Kibbutz Eilon | Editorial call: didn't fit the index's look |
| Nataly Shevilly | https://natalyshevilly.co.il/ | — | online only | Editorial call: didn't fit the index's look |
| Mishimono | https://mishimono.com/ | — | Nahalat Binyamin 125, Tel Aviv | Editorial call: didn't fit the index's look |
| Mia Luz | https://mia-luz.com/ | @mia___luz | 31 Allenby St, Tel Aviv | Editorial call: didn't fit the index's look |

### Restore data

<details><summary>Vivo</summary>

Designer entry (`index.html`, `DESIGNERS` array):

```js
{
    name: "Vivo",
    url: "https://vivoofficial.com/",
    tags: ["unisex", "minimalist", "streetwear"],
    tagLabels: ["Unisex", "Minimalist", "Streetwear"],
    desc: "Clean, minimal, and international, with quality that speaks for itself. Inspired by life in Milan (and Oliver, the founders' corgi), every piece is made in small, exclusive batches, blending effortless minimalism with bold identity.",
    descFull: "VIVO started with a story. The founders brought Oliver, their corgi, from Milan, where they lived, created, and found inspiration; his energy and playful spirit are woven into every design. The aesthetic is clean, minimal, and international, with a focus on quality that speaks for itself and the understated sophistication absorbed from Italy. VIVO works in small batches, keeping every drop exclusive, thoughtfully produced, and deeply connected to its vision. More than just clothing, it's about expression, confidence, and individuality, a balance of effortless minimalism, bold identity, and refined craftsmanship.",
    img: "https://vivoofficial.com/cdn/shop/collections/summer-25-265474.png?v=1759076474&width=1000",
    budget: 1,
    fav: false
  },
```

`DESC_HE` line:

```js
"Clean, minimal, and international, with quality that speaks for itself. Inspired by life in Milan (and Oliver, the founders' corgi), every piece is made in small, exclusive batches, blending effortless minimalism with bold identity.": "נקי, מינימלי ובינלאומי, באיכות שמדברת בעד עצמה. בהשראת החיים במילאנו (ואוליבר, הקורגי של המייסדים), כל פריט מיוצר בסדרות קטנות ואקסקלוסיביות, ומשלב מינימליזם נטול מאמץ עם זהות נועזת.",
```

</details>

<details><summary>Vandalized</summary>

Designer entry (`index.html`, `DESIGNERS` array):

```js
{
    name: "Vandalized",
    url: "https://www.vandalized.store/",
    tags: ["unisex", "streetwear", "conceptual"],
    tagLabels: ["Unisex", "Streetwear", "Conceptual"],
    desc: "Original tees and art pieces straight from Haifa's streets. Designer Hadar Israel works with claws, humor, and a vandalized twist, inspired by cats, chaos, and life itself.",
    descFull: "Vandalized Aesthetics started as an escape from reality, a group of girls walking at night, leaving a mark to show they were there. We live in a world dominated by conformists, and we're here to offer an alternative. They may call it vandalism, but we call it aesthetic, we believe the way to beat them is by making the world more suitable and beautiful for us. Come join us and let them know what you think and feel through fashion and art. And yes, we ADORE cats.",
    instagram: "VandalizedAes",
    img: "https://static.wixstatic.com/media/cb4142_806bf548b1ba4ebdb5ce8c9b2a5764eb~mv2.png/v1/fill/w_470,h_705,al_c,usm_0.66_1.00_0.01/cb4142_806bf548b1ba4ebdb5ce8c9b2a5764eb~mv2.png",
    budget: 1,
    fav: false
  },
```

`DESC_HE` line:

```js
"Original tees and art pieces straight from Haifa's streets. Designer Hadar Israel works with claws, humor, and a vandalized twist, inspired by cats, chaos, and life itself.": "חולצות מקוריות ופריטי אמנות ישר מרחובות חיפה. המעצבת הדר ישראל עובדת בציפורניים, בהומור ובטוויסט של ונדליזם, בהשראת חתולים, כאוס והחיים עצמם.",
```

</details>

<details><summary>YYS</summary>

Designer entry (`index.html`, `DESIGNERS` array):

```js
{
    name: "YYS",
    url: "https://yys.co.il/",
    tags: ["activewear", "minimalist", "casual"],
    tagLabels: ["Activewear", "Minimalist", "Casual"],
    desc: "Everyday comfort and effortless style. Matching sets, leggings, tees and tracksuits designed in shape, colour and vibe to move with you.",
    descFull: "YYS is an Israeli womenswear label built around matching sets, leggings, flare pants, tees and tracksuits in a tight neutral palette of black, navy, beige, grey and soft pink. The collections run seasonally, from velour and jacket-led winter pieces to lightweight jersey sets and shorts, alongside accessories like caps and the Puff bag. Fashion should be simple, bold and made for everyone: each piece is designed so you can move confidently and express your style every day.",
    instagram: "yys.il",
    img: "https://yys.co.il/wp-content/uploads/2026/07/2Q6A2199.webp",
    budget: 1,
    fav: false
  },
```

`DESC_HE` line:

```js
"Everyday comfort and effortless style. Matching sets, leggings, tees and tracksuits designed in shape, colour and vibe to move with you.": "נוחות יומיומית וסגנון נטול מאמץ. סטים תואמים, טייצים, חולצות וחליפות טרנינג המעוצבים בצורה, בצבע ובוייב לזוז איתך.",
```

</details>

<details><summary>Reut Harel</summary>

Designer entry (`index.html`, `DESIGNERS` array):

```js
{
    name: "Reut Harel",
    url: "https://reutharel.com/",
    tags: ["ready-to-wear", "accessories", "edgy", "prints"],
    tagLabels: ["Ready-to-Wear", "Accessories", "Edgy", "Prints"],
    desc: "Wild. Free. Iconic. A fashion and lifestyle brand blending art-inspired prints with a bold boho-rock attitude, limited-edition tees, bags, leather, and jewelry that speak of individuality and authentic beauty. Ramat Gan showroom.",
    instagram: "reutharelofficial",
    img: "https://reutharel.com/cdn/shop/files/DSCF6204.jpg?v=1780950053&width=720",
    budget: 2,
    fav: false
  },
```

`DESC_HE` line:

```js
"Wild. Free. Iconic. A fashion and lifestyle brand blending art-inspired prints with a bold boho-rock attitude, limited-edition tees, bags, leather, and jewelry that speak of individuality and authentic beauty. Ramat Gan showroom.": "פראי. חופשי. איקוני. מותג אופנה ולייף־סטייל שמשלב הדפסים בהשראת אמנות עם גישה נועזת של בוהו־רוק, חולצות במהדורה מוגבלת, תיקים, עור ותכשיטים שמדברים על אינדיבידואליות ויופי אותנטי. שואורום ברמת גן.",
```

</details>

<details><summary>Not For Sale</summary>

Designer entry (`index.html`, `DESIGNERS` array):

```js
{
    name: "Not For Sale",
    url: "https://notforsaletlv.com/",
    tags: ["streetwear", "edgy"],
    tagLabels: ["Streetwear", "Edgy"],
    desc: "NFS, a Tel Aviv streetwear institution, both a store stocking global street and sneaker brands and its own house label of graphic hoodies and tees with a raw, local street attitude.",
    instagram: "notforsale_tlv",
    img: "https://notforsaletlv.com/cdn/shop/files/230222-125153_Jpgbest.jpg?v=1706660358&width=1080",
    budget: 2,
    fav: false
  },
```

`DESC_HE` line:

```js
"NFS, a Tel Aviv streetwear institution, both a store stocking global street and sneaker brands and its own house label of graphic hoodies and tees with a raw, local street attitude.": "NFS, מוסד סטריטוור תל אביבי, גם חנות שמחזיקה מותגי רחוב וסניקרס גלובליים וגם מותג הבית שלה של קפוצ'ונים וחולצות גרפיות בגישה גולמית ומקומית של הרחוב.",
```

</details>

<details><summary>Nefartiti</summary>

Designer entry (`index.html`, `DESIGNERS` array):

```js
{
    name: "Nefartiti",
    url: "https://www.nefartiti.co.il/",
    tags: ["size-inclusive", "contemporary"],
    tagLabels: ["Size Inclusive", "Contemporary"],
    desc: "A blue-and-white brand specialising in plus-size fashion, founded by Edna Paz. Beautiful, comfortable, fashionable clothes for sizes 44–54, with flattering cuts, quality fabrics, and modern design.",
    img: "https://www.nefartiti.co.il/wp-content/uploads/2026/03/dress-mishmesh-green-3-510x764.webp",
    budget: 2,
    fav: false
  },
```

`DESC_HE` line:

```js
"A blue-and-white brand specialising in plus-size fashion, founded by Edna Paz. Beautiful, comfortable, fashionable clothes for sizes 44–54, with flattering cuts, quality fabrics, and modern design.": "מותג כחול־לבן המתמחה באופנת מידות גדולות, נוסד על ידי עדנה פז. בגדים יפים, נוחים ואופנתיים למידות 44-54, בגזרות מחמיאות, בדים איכותיים ועיצוב מודרני.",
```

`STORE_ADDRESSES`: `"Nefartiti": "Kibbutz Eilon"` (also in `MAP_BRANDS`)

Map pin (`Map.html`):

```js
{ name:"Nefartiti", url:"https://www.nefartiti.co.il/", tags:["Size Inclusive", "Contemporary"], desc:"A blue-and-white brand specialising in plus-size fashion, founded by Edna Paz. Beautiful, comfortable, fashionable clothes for sizes 44–54, with flattering cuts, quality fabrics, and modern design.", img:"https://www.nefartiti.co.il/wp-content/uploads/2026/03/dress-mishmesh-green-3-510x764.webp", city:"", lat:33.0625, lng:35.2481, fav:false, addresses:["Kibbutz Eilon, D.N. Galil Ma'aravi 2284500"], phone:"04-9858192", hours:["Sun–Thu 9:00–15:00"] },
```

</details>

<details><summary>Nataly Shevilly</summary>

Designer entry (`index.html`, `DESIGNERS` array):

```js
{
 name: "Nataly Shevilly",
 url: "https://natalyshevilly.co.il/",
 tags: ["ready-to-wear", "contemporary"],
 tagLabels: ["Ready-to-Wear", "Contemporary"],
 desc: "Designer label by Nataly Shevilly - elegant, occasion-ready pieces with a feminine, considered hand.",
 img: "https://natalyshevilly.co.il/wp-content/uploads/2026/05/372103-1.jpg",
 budget: 3,
 fav: false
 },
```

`DESC_HE` line:

```js
"Designer label by Nataly Shevilly - elegant, occasion-ready pieces with a feminine, considered hand.": "מותג מעצבים של נטלי שווילי - פריטי אירוע אלגנטיים ביד נשית ומוקפדת.",
```

</details>

<details><summary>Mishimono</summary>

Designer entry (`index.html`, `DESIGNERS` array):

```js
{
 name: "Mishimono",
 url: "https://mishimono.com/",
 tags: ["ready-to-wear", "bridal", "minimalist"],
 tagLabels: ["Ready-to-Wear", "Bridal", "Minimalist"],
 desc: "Womenswear with a Japanese-inflected sensibility. Mishimono works in considered silhouettes, soft layering, and a quiet, modern hand.",
 img: "https://www.mishimono.com/_next/image?url=https%3A%2F%2Fproducts-cdn.virgoflow.cloud%2Fmedia%2Fpm_2c75775cc1734e4ea3e558f91b5e7fe8%2Fv1782294496104%2Foriginal.jpg&w=750&q=75",
 imgBridal: "https://products-cdn.virgoflow.cloud/media/pm_6f9ea0bdec234a5fb83f214ae531554e/v1782301107207/original.jpg",
 budget: 3,
 fav: false
 },
```

`DESC_HE` line:

```js
"Womenswear with a Japanese-inflected sensibility. Mishimono works in considered silhouettes, soft layering, and a quiet, modern hand.": "אופנת נשים ברגישות בעלת גוון יפני. Mishimono עובדת בסילואטות מוקפדות, שכבות רכות וביד שקטה ומודרנית.",
```

`STORE_ADDRESSES`: `"Mishimono": "Nahalat Binyamin 125, Tel Aviv"` (also in `MAP_BRANDS`)

Map pin (`Map.html`):

```js
{ name:"Mishimono", url:"https://mishimono.com/", tags:["Ready-to-Wear", "Bridal", "Minimalist"], desc:"Womenswear with a Japanese-inflected sensibility. Mishimono works in considered silhouettes, soft layering, and a quiet, modern hand.", img:"https://www.mishimono.com/_next/image?url=https%3A%2F%2Fproducts-cdn.virgoflow.cloud%2Fmedia%2Fpm_2c75775cc1734e4ea3e558f91b5e7fe8%2Fv1782294496104%2Foriginal.jpg&w=750&q=75", city:"Tel Aviv", lat:32.058, lng:34.7721, fav:false, addresses:["Nahalat Binyamin 125, Tel Aviv"], phone:"+972509944463" },
```

</details>

<details><summary>Mia Luz</summary>

Designer entry (`index.html`, `DESIGNERS` array):

```js
{
    name: "Mia Luz",
    url: "https://mia-luz.com/",
    tags: ["ready-to-wear", "prints"],
    tagLabels: ["Ready-to-Wear", "Prints"],
    desc: "Resort womenswear for those who find beauty in the details, rich textures, distinctive colours, and pieces with quiet style. Tops, dresses, trousers, jumpsuits, and a signature white resort line.",
    instagram: "mia___luz",
    img: "https://mia-luz.com/wp-content/uploads/2026/05/IMG_3577-1-scaled.jpg",
    budget: 3,
    fav: false
  },
```

`DESC_HE` line:

```js
"Resort womenswear for those who find beauty in the details, rich textures, distinctive colours, and pieces with quiet style. Tops, dresses, trousers, jumpsuits, and a signature white resort line.": "אופנת ריזורט לנשים לאלה שמוצאות יופי בפרטים, מרקמים עשירים, צבעים מובחנים ופריטים בסגנון שקט. טופים, שמלות, מכנסיים, אוברולים וקו ריזורט לבן חתימה.",
```

`STORE_ADDRESSES`: `"Mia Luz": "31 Allenby St, Tel Aviv"` (also in `MAP_BRANDS`)

Map pin (`Map.html`):

```js
{ name:"Mia Luz", url:"https://mia-luz.com/", tags:["Prints"], desc:"Resort womenswear for those who find beauty in the details, rich textures, distinctive colours, and pieces with quiet style. Tops, dresses, trousers, jumpsuits, and a signature white resort line.", img:"https://mia-luz.com/wp-content/uploads/2026/05/IMG_3577-1-scaled.jpg", city:"", lat:32.0636, lng:34.7756, fav:false, addresses:["Allenby 31, Tel Aviv"], phone:"+972-539-593-934" },
```

</details>
