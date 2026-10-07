// Journal posts. Each one is a short intro in Dana's voice followed by the
// designers that match `select`, so the list grows on its own as brands are
// added or retagged. Edit the words here, then run: node scripts/build-journal.mjs
//
// select: { all: [...tags every brand must have],
//           any: [...at least one of these],
//           none: [...none of these] }

export const POSTS = [
  {
    slug: 'minimalist-jewelry',
    title: 'Minimalist jewelry from Israeli designers',
    kicker: 'Jewelry',
    description: 'Where to find minimalist jewelry by independent Israeli designers: clean gold and silver pieces, small studios, online and in Tel Aviv.',
    published: '2026-10-07',
    updated: '2026-10-07',
    intro: [
      'A friend asked me where to find minimalist jewelry from Israeli designers. Not logo pieces and not a big statement necklace, just something simple and well made that she could wear every day and forget she had on.',
      'These are the studios I sent her. Most of them make everything by hand in small workshops, a lot of it in recycled gold and silver, and you can order from all of them online. A few have a studio or shop in Tel Aviv if you want to try things on first.',
    ],
    select: { all: ['jewelry', 'minimalist'] },
    indexLink: '../index.html?tags=jewelry,minimalist',
    indexLinkText: 'Minimalist jewelry on the index',
  },
  {
    slug: 'mens-natural-fabrics',
    title: "Men's clothing in natural fabrics from Israeli designers",
    kicker: 'Menswear',
    description: "Israeli designers making men's and unisex clothing in linen, cotton, wool and other natural fibers, with where to buy online or in a store.",
    published: '2026-10-07',
    updated: '2026-10-07',
    intro: [
      "Another friend was looking for men's clothes in natural fibers: linen, cotton, wool, nothing that feels like plastic in August.",
      "Here's everyone in the index who makes menswear or unisex clothing and works mostly in natural fabrics. Some are small studios that sew everything themselves and some are bigger labels with stores around the country. Unisex brands are in here too, because a lot of the best men's pieces are cut for everyone.",
    ],
    select: { all: ['natural'], any: ['menswear', 'unisex'], none: ['jewelry'] },
    indexLink: '../index.html?tags=menswear,natural',
    indexLinkText: "Men's natural fabrics on the index",
  },
];
