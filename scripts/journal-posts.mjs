// Journal posts. `title` is the short heading on the page; `seoTitle` is the
// fuller phrase used for the browser tab, search results and shares.
// The *He fields are what visitors see after switching to עב (optional; missing
// ones stay in English).
// Each one is a short intro in Dana's voice followed by the
// designers that match `select`, so the list grows on its own as brands are
// added or retagged. Edit the words here, then run: node scripts/build-journal.mjs
//
// select: { all: [...tags every brand must have],
//           any: [...at least one of these],
//           none: [...none of these] }

export const POSTS = [
  {
    slug: 'minimalist-jewelry',
    title: 'Minimalist jewelry',
    seoTitle: 'Minimalist jewelry from Israeli designers',
    titleHe: 'תכשיטים מינימליסטיים',
    kicker: 'Jewelry',
    kickerHe: 'תכשיטים',
    descriptionHe: 'איפה למצוא תכשיטים מינימליסטיים של מעצבים ישראלים עצמאיים: זהב וכסף נקיים, סטודיואים קטנים, אונליין ובתל אביב.',
    description: 'Where to find minimalist jewelry by independent Israeli designers: clean gold and silver pieces, small studios, online and in Tel Aviv.',
    published: '2026-10-07',
    updated: '2026-10-07',
    intro: [
      'A friend asked me where to find minimalist jewelry from Israeli designers. Not logo pieces and not a big statement necklace, just something simple and well made that she could wear every day and forget she had on.',
      'These are the studios I sent her. Most of them make everything by hand in small workshops, a lot of it in recycled gold and silver, and you can order from all of them online. A few have a studio or shop in Tel Aviv if you want to try things on first.',
    ],
    introHe: [
      'חברה שאלה אותי איפה אפשר למצוא תכשיטים מינימליסטיים של מעצבות ומעצבים ישראלים. לא תכשיטי לוגו ולא שרשרת סטייטמנט גדולה, פשוט משהו נקי ועשוי טוב שאפשר לענוד כל יום ולשכוח שהוא עלייך.',
      'אלה הסטודיואים ששלחתי לה. רובם מייצרים הכול בעבודת יד בסדנאות קטנות, הרבה מזה בזהב ובכסף ממוחזרים, ואפשר להזמין מכולם אונליין. לכמה מהם יש סטודיו או חנות בתל אביב, אם רוצים למדוד לפני.',
    ],
    select: { all: ['jewelry', 'minimalist'] },
    indexLink: '../index.html?tags=jewelry,minimalist',
    indexLinkText: 'Minimalist jewelry on the index',
    indexLinkTextHe: 'תכשיטים מינימליסטיים באינדקס',
  },
  {
    slug: 'mens-natural-fabrics',
    title: "Men's natural fabrics",
    seoTitle: "Men's clothing in natural fabrics from Israeli designers",
    titleHe: 'בגדי גברים מבדים טבעיים',
    kicker: 'Menswear',
    kickerHe: 'גברים',
    descriptionHe: 'מעצבים ישראלים שעושים בגדי גברים ויוניסקס מפשתן, כותנה, צמר ובדים טבעיים אחרים, ואיפה לקנות אונליין או בחנות.',
    description: "Israeli designers making men's and unisex clothing in linen, cotton, wool and other natural fibers, with where to buy online or in a store.",
    published: '2026-10-07',
    updated: '2026-10-07',
    intro: [
      "Another friend was looking for men's clothes in natural fibers: linen, cotton, wool, nothing that feels like plastic in August.",
      "Here's everyone in the index who makes menswear or unisex clothing and works mostly in natural fabrics. Some are small studios that sew everything themselves and some are bigger labels with stores around the country. Unisex brands are in here too, because a lot of the best men's pieces are cut for everyone.",
    ],
    introHe: [
      'חבר אחר חיפש בגדי גברים מסיבים טבעיים: פשתן, כותנה, צמר, שום דבר שמרגיש כמו פלסטיק באוגוסט.',
      'הנה כל מי שבאינדקס שעושה בגדי גברים או יוניסקס ועובד בעיקר עם בדים טבעיים. חלקם סטודיואים קטנים שתופרים הכול בעצמם, וחלקם מותגים גדולים יותר עם חנויות ברחבי הארץ. גם מותגי היוניסקס כאן, כי הרבה מהפריטים הכי טובים לגברים נגזרים לכולם.',
    ],
    select: { all: ['natural'], any: ['menswear', 'unisex'], none: ['jewelry'] },
    indexLink: '../index.html?tags=menswear,natural',
    indexLinkText: "Men's natural fabrics on the index",
    indexLinkTextHe: 'בגדי גברים מבדים טבעיים באינדקס',
  },
];
