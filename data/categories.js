/* =====================================================================
   CATEGORY SYSTEM — the 12 master categories from the brief.
   Edit descriptions and subcategories here. Each subcategory becomes a filter chip.
   `legacy` lists the old store departments these map to (for reference only).
   ===================================================================== */
window.CATEGORIES = [
  { id: "fashion", img: "photos/categories/fashion.webp", no: "01", name: "Fashion & Trendy Accessories", short: "Fashion",
    desc: "Handbags, sling bags, clutches, sunglasses, belts and everyday accessories, plus ethnic and western wear.",
    subs: ["Handbags","Purses","Wallets","Sling Bags","Clutches","Sunglasses","Belts","Scarves","Caps","Hair Bands","Scrunchies","Fashion Clips","Keychains","Trendy Accessories","Everyday Fashion Accessories","Ethnic Wear","Party Wear","Men's Wear","Watches"] },

  { id: "jewellery", img: "photos/categories/jewellery.webp", no: "02", name: "Jewellery & Imitation Jewellery", short: "Jewellery",
    desc: "Oxidised, traditional and western imitation jewellery — jhumkas, necklaces, bangles, rings and bridal sets.",
    subs: ["Earrings","Jhumkas","Studs","Necklaces","Chains","Pendants","Mangalsutra Designs","Bangles","Bracelets","Rings","Anklets","Payal","Bridal Sets","Oxidised Jewellery","Traditional Jewellery","Western Jewellery"] },

  { id: "beauty", img: "photos/categories/beauty.webp", no: "03", name: "Beauty & Cosmetics", short: "Beauty",
    desc: "Makeup, skincare, personal care and beauty tools — everyday essentials and party looks.",
    subs: ["Lipsticks","Lip Gloss","Kajal","Eyeliner","Mascara","Foundation","Compact","Blush","Nail Polish","Makeup Brushes","Beauty Blenders","Face Wash","Moisturizers","Creams","Lotions","Hair Care","Personal Care","Beauty Tools","Makeup Organizers","Face Care"] },

  { id: "hair", img: "photos/categories/hair.webp", no: "04", name: "Hair Accessories", short: "Hair",
    desc: "Claw clips, hair pins, bows, headbands, scrunchies and hair essentials for every day.",
    subs: ["Claw Clips","Clutchers","Tic Tac Clips","Rubber Bands","Scrunchies","Hair Bows","Headbands","Hair Pins","Juda Accessories","Hair Combs","Mirrors","Makeup Pouches"] },

  { id: "household", img: "photos/categories/household.webp", no: "05", name: "Plastic & Household Products", short: "Household",
    desc: "Buckets, storage containers, baskets, organisers, racks and everyday household utility items.",
    subs: ["Buckets","Mugs","Tubs","Water Jugs","Storage Containers","Plastic Baskets","Laundry Baskets","Dustbins","Bathroom Stools","Organizers","Plastic Racks","Trays","Hangers","Stools","Household Utility"] },

  { id: "kitchen", img: "photos/categories/kitchen.webp", no: "06", name: "Kitchen & Dining", short: "Kitchen",
    desc: "Lunch boxes, water bottles, flasks, storage jars, serving trays and kitchen tools.",
    subs: ["Lunch Boxes","Water Bottles","Flasks","Storage Jars","Spice Containers","Serving Trays","Plates","Bowls","Cups","Mugs","Kitchen Tools","Strainers","Peelers","Storage Boxes","Dining Accessories"] },

  { id: "decor", img: "photos/categories/decor.webp", no: "07", name: "Home Décor & Lifestyle", short: "Home Décor",
    desc: "Showpieces, artificial flowers, vases, photo frames, candles, clocks and table décor.",
    subs: ["Showpieces","Artificial Flowers","Vases","Decorative Pots","Wall Hangings","Table Décor","Photo Frames","Decorative Lights","Clocks","Candles","Planters","Home Accessories"] },

  { id: "stationery", img: "photos/categories/stationery.webp", no: "08", name: "Stationery, Art & Craft", short: "Stationery",
    desc: "Notebooks, pens, geometry boxes, art colours, craft paper, stickers and school accessories.",
    subs: ["Notebooks","Pens","Pencils","Erasers","Sharpeners","Geometry Boxes","Pencil Pouches","Art Colours","Paint Brushes","Craft Paper","Stickers","Decorative Tape","School Accessories"] },

  { id: "gifts", img: "photos/categories/gifts.webp", no: "09", name: "Gifts, Toys & Celebrations", short: "Gifts & Toys",
    desc: "Soft toys, board games, gift boxes and hampers, greeting cards, balloons and party décor.",
    subs: ["Soft Toys","Educational Toys","Board Games","Gift Articles","Gift Boxes","Gift Hampers","Gift Bags","Wrapping Paper","Greeting Cards","Birthday Caps","Balloons","Party Decorations","Return Gifts","Celebration Accessories","Anniversary","Couple Gifts"] },

  { id: "pooja", img: "photos/categories/pooja.webp", no: "10", name: "Religious & Pooja Products", short: "Pooja",
    desc: "Pooja thalis, diya stands, bells, kalash, pooja baskets, malas and aarti accessories.",
    subs: ["Pooja Thalis","Diya Stands","Bells","Incense Holders","Kalash","Pooja Baskets","Decorative Idols","Religious Frames","Chunri","Mala","Aarti Accessories","Worship Essentials"] },

  { id: "festival", img: "photos/categories/festival.webp", no: "11", name: "Festival Products", short: "Festivals",
    desc: "Products for Diwali, Navratri, Raksha Bandhan, Holi, Karwa Chauth and other festivals. Browse by festival in the Festival Collections section.",
    subs: ["Diwali","Navratri","Ganesh Chaturthi","Raksha Bandhan","Holi","Karwa Chauth","Janmashtami","Makar Sankranti","Christmas","New Year","Other Festivals"] },

  { id: "seasonal", img: "photos/categories/seasonal.webp", no: "12", name: "Seasonal Products", short: "Seasonal",
    desc: "Summer, monsoon and winter essentials, wedding season and travel collections. See What's Available When? for suggested periods.",
    subs: ["Summer Essentials","Winter Essentials","Monsoon Essentials","Wedding Season","Travel Season","Holiday Collections","Special Occasion Collections"] }
];

/* Convenience lookup by id */
window.CAT_BY_ID = Object.fromEntries(window.CATEGORIES.map(c => [c.id, c]));
