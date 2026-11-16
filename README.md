# Loventra Store — Website

Static website for Loventra Store, Bilaspur. Showcase only: no cart, payment or orders.

## How to open it

Run a local server from this folder, then open the address shown:

```
python3 -m http.server 8080
```

Visit http://localhost:8080

## Where to edit what

Every section has its own data file. Edit only the file for the section you want to change.

| What you want to change | File to edit | Photo folder |
|---|---|---|
| Store name, address, phone, WhatsApp, hours | data/business.js | — |
| Home page top pictures (3 hero pictures and store photo) | data/home.js | photos/home/ |
| Shop by Category (the 12 category tiles and their small icons) | data/categories.js | photos/categories/ |
| Products (all product pages, LVN-001 onwards) | data/products.js | photos/products/ |
| Highlights on the Home page (common best sellers) | data/highlights.js | photos/highlights/ |
| Everyday Favourites page | data/favourites.js | photos/favourites/ |
| Season Collections (Home tiles and the items inside each season) | data/seasons.js | photos/seasons/ and photos/season-items/ |
| Festival Collections (Home tiles and the items inside each festival) | data/festivals.js | photos/festivals/ and photos/festival-items/ |
| Brand logos | data/brands.js | photos/brands/ |
| Gallery and Stories pictures | data/gallery.js | photos/gallery/ and photos/lookbook/ |
| Search words (spelling and synonyms) | utils/search.js | — |

Nothing is named automatically. Each item has an `img` line in its data file that says the exact
photo path. To add a photo, create the file at that path.

## Photo rules

1. Every photo must be a **.webp** file.
2. Put it in the folder for its section (see the table above and photos/README.txt).
3. The file name must match the `img` line in the data file exactly, including small letters.
4. If a photo is missing, a soft plum-pink panel shows in its place and the name still shows. The site does not show an error.
5. All photos load from this folder only. No photo is fetched from another website.

## Adding a product (for example LVN-017)

The website shows **only the photo and the name** of a product. No price, code or details are shown.
Open `data/products.js`, copy one product line, paste it at the end of the list (before the last `]`),
and change the values:

```javascript
{ id:"LVN-017", img:"photos/products/lvn-017.webp", cat:"fashion", sub:"Handbags", name:"Leather Tote Bag" },
```

Then upload the photo as `photos/products/lvn-017.webp`.

- `id` must be unique. It is used only for the photo file name and is never shown to visitors.
- `cat` must be one of the category ids in `data/categories.js`.
- `sub` must match one of that category's subcategories exactly.
- `name` is what visitors see, what search looks for, and what goes into the WhatsApp enquiry.
- To show the product also in Highlights on Home, add `featured:true` in the line.
- Other old fields in the file (price, desc, material, options and so on) are not used and can be left or deleted.

## WhatsApp enquiry

Tap a photo to open it full size. The **Enquire on WhatsApp** button there sends only:
"Hi, I am interested in <product name>. Please confirm availability at the store."
No product code and no price are sent.

## Adding a Season or Festival item

Open `data/seasons.js` or `data/festivals.js`. Add one line inside that season's or festival's list:

```javascript
{ name: "Gift Bags", img: "photos/festival-items/diwali/gift-bags.webp" },
```

Then upload the photo at that path.

## Adding a Home page picture

Open `data/home.js` and change the `img` path. Then upload the file at that path in `photos/home/`.

## Hiding something

- A season or festival: set `active: false` in its block.
- A brand: set `active: false` in its block.
- A product: remove its block from `data/products.js`.

## Checklist before publishing

- Every photo is .webp.
- Every photo file name matches its `img` line exactly.
- Every `id` is unique.
- Business details (phone, WhatsApp, address) in `data/business.js` are real, not placeholders.

## Notes

- The site uses `#hash` pages, so search engines index only the home page.
- Replace `www.example.com` in `index.html`, `sitemap.xml` and `robots.txt` before launch.
