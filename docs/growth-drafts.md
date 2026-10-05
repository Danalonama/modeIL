# Growth drafts

Drafts only. Nothing here has been sent or published.

## 1. Telling a designer they're listed

For Instagram DM or email. Short on purpose: it asks for nothing, and the correction offer is the reason to reply.

**English**

> Hi [name], I'm Dana. I run ModeIL (mode-il.com), a free, independent index of Israeli fashion designers, made for people abroad who want to buy from Israeli labels and have no single place to find them.
>
> [Brand] is listed. I wrote the description from your own About page and picked one image I felt was most you. If anything is off, or you'd rather a different photo, tell me and I'll change it.
>
> No fees, no catch. It's a one-person project and listing never depends on anything.

**Hebrew**

> היי [שם], אני דנה. אני מפעילה את ModeIL (mode-il.com), אינדקס עצמאי וחינמי של מעצבי אופנה ישראלים, שנועד למי שגרה בחו"ל ורוצה לקנות ממותגים ישראליים ואין לה מקום אחד למצוא אותם.
>
> [מותג] מופיע באינדקס. את התיאור כתבתי מתוך עמוד האודות שלכם, ובחרתי תמונה אחת שהרגישה לי הכי אתם. אם משהו לא מדויק, או שתעדיפו תמונה אחרת, כתבו לי ואשנה.
>
> בלי תשלום ובלי קאץ'. זה פרויקט של אדם אחד, וההופעה באינדקס לא תלויה בשום דבר.

Notes

- Affiliate links: if a designer asks, the honest answer is that there are none. ModeIL earns nothing from outbound links, and no one pays to be listed.
- Start with the designers whose images or descriptions you're least sure about. Their corrections improve the index, and a designer who has corrected their own entry is the most likely to share it.

## 2. "Listed on ModeIL" link for designers' sites

A plain text link in the site's own voice is closer to the design system than a graphic badge, and it earns the same backlink. A snippet a designer can paste into a footer or stockists page:

```html
<a href="https://mode-il.com/" target="_blank" rel="noopener"
   style="font:600 10px/1 'Plus Jakarta Sans',system-ui,sans-serif;letter-spacing:.2em;text-transform:uppercase;color:#1A1A18;text-decoration:none;border:1px solid #1A1A18;padding:9px 12px;display:inline-block">
  Listed on MODE-IL
</a>
```

Hebrew variant: replace the text with `מופיע ב-MODE-IL` and set `letter-spacing:.05em`.

Open question before offering it: a per-brand landing URL (`mode-il.com/?brand=…` that scrolls to and highlights the card) would make the link far more useful to the designer than a link to the home page. That doesn't exist yet.

## 3. One designer a day on Instagram

The data for this is already in the index: name, the one image, the short description, the handle. A post is the card. Two things to settle first:

- Image rights. On the site the image is hotlinked from the brand's own server, which is why rights stay clean. Re-uploading it to Instagram is a different act. Asking permission in the outreach message above solves this and gives the designer a reason to reshare.
- Order. Alphabetical is predictable and fair; nobody can read ranking into it.
