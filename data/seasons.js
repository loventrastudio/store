/* =====================================================================
   SEASON COLLECTIONS
   Tile photo: img (folder photos/seasons/, .webp)
   Items: each item has its own name and img (folder photos/season-items/<season key>/, .webp).
   Add an item by copying one { name, img } line and changing the name and the img path.
   Set active: false to hide a season. months (1 = Jan … 12 = Dec) is only a suggestion.
   ===================================================================== */
window.SEASONS = [
  { key: "summer", label: "Summer Season", period: "March – June", months: [3,4,5,6], active: true,
    img: "photos/seasons/summer.webp",
    products: [
      { name: "Water bottles", img: "photos/season-items/summer/water-bottles.webp" },
      { name: "Sippers", img: "photos/season-items/summer/sippers.webp" },
      { name: "Sunglasses", img: "photos/season-items/summer/sunglasses.webp" },
      { name: "Caps", img: "photos/season-items/summer/caps.webp" },
      { name: "Hats", img: "photos/season-items/summer/hats.webp" },
      { name: "Hand fans", img: "photos/season-items/summer/hand-fans.webp" },
      { name: "Ice trays", img: "photos/season-items/summer/ice-trays.webp" },
      { name: "Travel accessories", img: "photos/season-items/summer/travel-accessories.webp" },
      { name: "Picnic accessories", img: "photos/season-items/summer/picnic-accessories.webp" },
      { name: "Cooling utility products", img: "photos/season-items/summer/cooling-utility-products.webp" }
    ] },
  { key: "monsoon", label: "Monsoon Season", period: "June – September", months: [6,7,8,9], active: true,
    img: "photos/seasons/monsoon.webp",
    products: [
      { name: "Umbrellas", img: "photos/season-items/monsoon/umbrellas.webp" },
      { name: "Raincoats", img: "photos/season-items/monsoon/raincoats.webp" },
      { name: "Waterproof bags", img: "photos/season-items/monsoon/waterproof-bags.webp" },
      { name: "Waterproof pouches", img: "photos/season-items/monsoon/waterproof-pouches.webp" },
      { name: "Shoe covers", img: "photos/season-items/monsoon/shoe-covers.webp" },
      { name: "Rain covers", img: "photos/season-items/monsoon/rain-covers.webp" },
      { name: "Monsoon accessories", img: "photos/season-items/monsoon/monsoon-accessories.webp" }
    ] },
  { key: "winter", label: "Winter Season", period: "November – February", months: [11,12,1,2], active: true,
    img: "photos/seasons/winter.webp",
    products: [
      { name: "Woollen caps", img: "photos/season-items/winter/woollen-caps.webp" },
      { name: "Gloves", img: "photos/season-items/winter/gloves.webp" },
      { name: "Mufflers", img: "photos/season-items/winter/mufflers.webp" },
      { name: "Scarves", img: "photos/season-items/winter/scarves.webp" },
      { name: "Socks", img: "photos/season-items/winter/socks.webp" },
      { name: "Ear warmers", img: "photos/season-items/winter/ear-warmers.webp" },
      { name: "Winter accessories", img: "photos/season-items/winter/winter-accessories.webp" }
    ] },
  { key: "wedding", label: "Wedding Season", period: "", months: [], active: true,
    img: "photos/seasons/wedding.webp",
    products: [
      { name: "Bridal jewellery", img: "photos/season-items/wedding/bridal-jewellery.webp" },
      { name: "Necklace sets", img: "photos/season-items/wedding/necklace-sets.webp" },
      { name: "Bangles", img: "photos/season-items/wedding/bangles.webp" },
      { name: "Earrings", img: "photos/season-items/wedding/earrings.webp" },
      { name: "Hair accessories", img: "photos/season-items/wedding/hair-accessories.webp" },
      { name: "Gift trays", img: "photos/season-items/wedding/gift-trays.webp" },
      { name: "Return gifts", img: "photos/season-items/wedding/return-gifts.webp" },
      { name: "Gift packaging", img: "photos/season-items/wedding/gift-packaging.webp" },
      { name: "Wedding decorations", img: "photos/season-items/wedding/wedding-decorations.webp" }
    ] }
];
