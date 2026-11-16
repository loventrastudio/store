/* =====================================================================
   APP — router, page views, SEO text and the photo viewer.
   Business content lives in /data, not here.
   ===================================================================== */
(function () {
  "use strict";

  const B = window.BUSINESS;
  const CAT = window.CAT_BY_ID;
  const CATS = window.CATEGORIES;
  const PRODUCTS = window.PRODUCTS;
  const PBID = window.PRODUCT_BY_ID;
  const AV = window.AVAIL;
  const main = document.getElementById("app");

  /* ---------- helpers ---------- */
  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const slug = s => String(s).toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  /* Photo paths come from the data files (each item has its own img field). Nothing is generated. */
  const HOMEP = window.HOME || { collage: [], storeBanner: { img: "", alt: "" } };
  const productImg = p => p.img || "";
  const catName = id => (CAT[id] ? CAT[id].name : "");
  const catShort = id => (CAT[id] ? CAT[id].short : "");
  const festivals = () => (window.FESTIVALS || []).filter(f => f.active !== false);
  const seasons = () => (window.SEASONS || []).filter(s => s.active !== false);
  const festOf = key => (window.FESTIVALS || []).find(f => f.key === key) || { name: key, products: [], label: "" };
  const seasonOf = key => (window.SEASONS || []).find(s => s.key === key) || { label: key, products: [], period: "" };
  const waUrl = text => `https://wa.me/${B.whatsappNumber}?text=${encodeURIComponent(text)}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(B.mapsQuery)}`;
  const decodeSafe = s => { try { return decodeURIComponent(s); } catch (e) { return s; } };

  /* ---------- SEO: title and description for each page ---------- */
  function setMeta(title, desc) {
    document.title = title;
    const set = (sel, attr, val) => { const el = document.querySelector(sel); if (el) el.setAttribute(attr, val); };
    set('meta[name="description"]', "content", desc);
    set('meta[property="og:title"]', "content", title);
    set('meta[property="og:description"]', "content", desc);
  }
  const TITLES = {
    home: ["Loventra Store Bilaspur | Cosmetics, Fashion, Jewellery, Gifts & Pooja Items",
      "Loventra Store in Bilaspur, Madhya Pradesh: cosmetics, fashion, jewellery, hair accessories, household, kitchen, home décor, stationery, gifts, toys and pooja items under one roof. Visit the store or enquire on WhatsApp."],
    all: ["Everyday Favourites | Loventra Store Bilaspur",
      "Everyday favourites at Loventra Store, Bilaspur: the common, most-loved products customers pick up again and again."],
    festivals: ["Festival Collections | Diwali, Navratri, Raksha Bandhan & More | Loventra Store",
      "Festival shopping at Loventra Store, Bilaspur: Diwali, Navratri, Raksha Bandhan, Christmas and other festival collections."],
    brands: ["Brands We Stock | Loventra Store Bilaspur",
      "Brands stocked at Loventra Store, Bilaspur. Ask the store team about availability in person or on WhatsApp."],
    visit: ["Visit Our Store in Bilaspur | Hours, Address & Directions",
      "Visit Loventra Store in Bilaspur, Madhya Pradesh. Store hours, address, directions and why shopping in person helps you choose."],
    contact: ["Contact Loventra Store Bilaspur | Enquire on WhatsApp",
      "Send an enquiry to Loventra Store, Bilaspur. Your message opens in WhatsApp."],
    faq: ["FAQs | Loventra Store Bilaspur",
      "Answers to common questions about Loventra Store, Bilaspur: products, availability, gift packing and visiting the store."],
    privacy: ["Privacy & Store Terms | Loventra Store Bilaspur",
      "Privacy and store terms for Loventra Store, Bilaspur. The website stores nothing about you and uses no tracking."]
  };

  /* The old save/like list is gone. Clear anything it left behind in the browser. */
  try { localStorage.removeItem("loventra_shortlist"); } catch (e) {}

  function toast(msg) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove("show"), 2400);
  }

  /* ---------- photos ----------
     Every photo is a local .webp file named in the data files (folder photos/).
     If a file is not uploaded yet, the box shows a soft brand panel instead of a broken image. */
  document.addEventListener("error", e => {
    const img = e.target;
    if (!img || img.tagName !== "IMG" || img.closest(".lb")) return;
    img.style.display = "none";
    if (img.parentElement) img.parentElement.setAttribute("data-missing", "");
  }, true);

  /* ---------- building blocks ---------- */
  /* Grid item: picture and name. Click the picture to see it full size. */
  function stripItem(name, imgPath, lbName) {
    return `<button class="si" type="button" data-lb-src="${esc(imgPath)}" data-lb-name="${esc(lbName)}" aria-label="Open photo: ${esc(lbName)}">
      <span class="si-img"><img src="${esc(imgPath)}" alt="${esc(name)}" loading="lazy"></span>
      <span class="si-name">${esc(name)}</span>
    </button>`;
  }

  /* Non-clickable picture + name tile (season and festival item pages) */
  function picTile(name, imgPath) {
    return `<div class="pic-tile">
      <span class="img"><img src="${esc(imgPath)}" alt="${esc(name)}" loading="lazy"></span>
      <span class="nm">${esc(name)}</span>
    </div>`;
  }

  function sectionHead(eyebrow, title, lede) {
    return `<section class="section">
      ${eyebrow ? `<span class="eyebrow">${esc(eyebrow)}</span>` : ""}
      <h2>${title}</h2>
      ${lede ? `<p class="lede">${lede}</p>` : ""}
    </section>`;
  }

  function backLink(href, text) {
    return `<p class="crumb"><a class="link" href="${href}">← ${esc(text)}</a></p>`;
  }

  function photoTileLink(href, imgPath, name) {
    return `<a class="tile" href="${href}">
      <div class="img"><img src="${imgPath}" alt="${esc(name)}" loading="lazy"></div>
      <div class="info"><strong>${esc(name)}</strong><span class="link">View</span></div>
    </a>`;
  }

  function brandLogos() {
    return `<div class="logo-grid">
      ${(window.BRANDS || []).filter(b => b.active !== false).map(b => `
        <img src="${esc(b.logo)}" alt="${esc(b.name)} logo" loading="lazy">`).join("")}
    </div>`;
  }

  /* ---------- HOME ---------- */
  /* Highlights: flagged products + common best sellers. They are also listed on their category page. */
  function highlightItems() {
    return [
      ...PRODUCTS.filter(p => p.featured).map(p => ({ name: p.name, src: productImg(p) })),
      ...(window.HIGHLIGHTS || []).map(h => ({ name: h.name, src: h.img || "" }))
    ];
  }
  /* Every product is listed on its category page, so search and browsing always match. */
  const inCategoryList = () => true;

  function home() {
    return `
    <section class="hero" aria-labelledby="heroTitle">
      <div>
        <span class="eyebrow">Cosmetics · Fashion · Gifts &amp; Toys · Bilaspur</span>
        <h1 id="heroTitle">A World of Variety, All in One Place.</h1>
        <p class="lede">Discover trendy fashion, beautiful jewellery, beauty essentials, household products, kitchen accessories, home décor, gifts and festive favourites — all under one roof.</p>
        <div class="row">
          <a class="btn" href="#categories">Explore All Categories</a>
          <a class="btn ghost" href="#festivals">Discover Collections</a>
        </div>
      </div>
      <div class="collage" aria-label="Store collection">
        ${HOMEP.collage.map(c => `<div class="thumb"><img src="${esc(c.img)}" alt=""><span>${esc(c.label)}</span></div>`).join("")}
      </div>
    </section>

    <section class="section" id="categories">
      <h2>Shop by Category</h2>
      <div class="cat-grid">
        ${CATS.map(c => `
          <a class="cat-tile" href="#category/${esc(c.id)}">
            <span class="cat-img"><span class="cat-ph">${esc(c.short)}</span><img src="${esc(c.img)}" alt="${esc(c.name)}" loading="lazy"></span>
            <strong>${esc(c.name)}</strong>
          </a>`).join("")}
      </div>
    </section>

    <section class="section">
      <h2>Highlights</h2>
      <div class="pgrid wide" role="list">
        ${highlightItems().map(h => `<div role="listitem">${stripItem(h.name, h.src, h.name)}</div>`).join("")}
      </div>
    </section>

    <section class="section" id="seasons">
      <h2>Season Collections</h2>
      <div class="tile-grid">
        ${seasons().map(s => `
          <a class="tile" href="#season/${esc(s.key)}">
            <div class="img"><img src="${esc(s.img)}" alt="${esc(s.label)}" loading="lazy"></div>
            <div class="info"><strong>${esc(s.label)}</strong>${s.period ? `<small>${esc(s.period)}</small>` : ""}<span class="link">View</span></div>
          </a>`).join("")}
      </div>
    </section>

    <section class="section" id="festivals">
      <h2>Festival Collections</h2>
      <div class="tile-grid">
        ${festivals().filter(f => f.featured).map(f => photoTileLink(`#festival/${esc(f.key)}`, f.img, f.name)).join("")}
      </div>
      <p class="note"><a class="link" href="#festivals">All festivals</a></p>
    </section>

    <section class="section">
      <h2>Brands We Stock</h2>
      ${brandLogos()}
    </section>

    <section class="section">
      <a class="store-banner" href="#visit">
        <div class="img"><img src="${esc(HOMEP.storeBanner.img)}" alt="${esc(HOMEP.storeBanner.alt)}" loading="lazy"></div>
        <div class="copy">
          <span class="eyebrow">Visit the Store</span>
          <h2>Experience It In Person</h2>
          <p>${esc(B.address)}</p>
          <p>${esc(B.hours)}</p>
          <span class="link" style="color:var(--surface);border-color:var(--rose);justify-self:start">Plan your visit →</span>
        </div>
      </a>
    </section>`;
  }

  /* ---------- CATEGORY ---------- */
  function categoryView(arg) {
    const parts = arg.split("/");
    const catId = parts[0];
    const sub = parts.slice(1).join("/");
    const c = CAT[catId];
    if (!c) return sectionHead("", "Category not found") + `<section class="section"><a class="btn" href="#all">Everyday Favourites</a></section>`;

    /* Subcategory products (Fashion): 2-column picture + name. Tap a picture for full size. */
    if (sub) {
      const items = PRODUCTS.filter(p => p.cat === catId && p.sub === sub && inCategoryList(p));
      return backLink(`#category/${catId}`, c.name) + sectionHead("", esc(sub)) +
        `<section class="section" style="padding-top:0">${items.length
          ? `<div class="pgrid" role="list">${items.map(p => `<div role="listitem">${stripItem(p.name, productImg(p), p.name)}</div>`).join("")}</div>`
          : `<div class="placeholder"><p>Products for ${esc(sub)} will appear here.</p></div>`}</section>`;
    }

    /* All other categories: 2-column picture + name. Tap a picture for full size, then swipe or use arrows. */
    const items = PRODUCTS.filter(p => p.cat === catId && inCategoryList(p));
    return backLink("#home", "Home") + sectionHead("", esc(c.name)) +
      `<section class="section" style="padding-top:0">
        ${items.length
          ? `<div class="pgrid" role="list">${items.map(p => `<div role="listitem">${stripItem(p.name, productImg(p), p.name)}</div>`).join("")}</div>`
          : `<div class="placeholder"><p>Products for ${esc(c.name)} will appear here.</p></div>`}
      </section>`;
  }

  /* ---------- EVERYDAY FAVOURITES (was "All Products"): common best sellers, 2 columns ---------- */
  function allView() {
    const list = window.FAVOURITES || [];
    return sectionHead("", "Everyday Favourites") +
      `<section class="section" style="padding-top:0"><div class="pgrid" role="list">${list.map(f => `<div role="listitem">${stripItem(f.name, f.img, f.name)}</div>`).join("")}</div></section>`;
  }

  /* ---------- SEARCH ---------- */
  function searchView(q) {
    if (!q.trim()) return sectionHead("", "Search the Store", "Type a product name, category or keyword in the search bar above.");
    const results = window.SEARCH.run(q).map(r => r.p);
    if (!results.length) {
      const sugg = window.SEARCH.suggest(q);
      return sectionHead("", `“${esc(q)}”`, "No products found.") +
        `<section class="section"><div class="placeholder">
          <p><strong style="color:var(--ink)">Nothing matched “${esc(q)}”.</strong></p>
          <p>Check the spelling${sugg.length ? ", or try a related word:" : "."}</p>
          ${sugg.length ? `<div class="chips">${sugg.map(s => `<a class="chip" href="#search/${encodeURIComponent(s)}">${esc(s)}</a>`).join("")}</div>` : ""}
        </div></section>`;
    }
    return sectionHead("", `“${esc(q)}”`, `${results.length} matching product${results.length === 1 ? "" : "s"}.`) +
      `<section class="section" style="padding-top:0"><div class="pgrid" role="list">${results.map(p => `<div role="listitem">${stripItem(p.name, productImg(p), p.name)}</div>`).join("")}</div></section>`;
  }

  /* ---------- FESTIVALS ---------- */
  function festivalsIndexView() {
    return sectionHead("", "Festival Collections", "Har Season, Har Festival Aur Har Khaas Mauke Ki Variety.") +
      `<section class="section" style="padding-top:20px"><div class="tile-grid">
        ${festivals().map(f => photoTileLink(`#festival/${esc(f.key)}`, f.img, f.name)).join("")}
      </div></section>`;
  }

  /* Festival page: picture and name only */
  function festivalView(key) {
    const f = festOf(key);
    return backLink("#festivals", "Festival Collections") + sectionHead("", esc(f.name)) +
      `<section class="section" style="padding-top:0"><div class="pic-grid">
        ${f.products.map(item => picTile(item.name, item.img)).join("")}
      </div></section>`;
  }

  /* ---------- SEASON: picture and name of items used in that season ---------- */
  function seasonView(key) {
    const s = seasonOf(key);
    return backLink("#home", "Home") + sectionHead("", esc(s.label), esc(s.period || "")) +
      `<section class="section" style="padding-top:0"><div class="pic-grid">
        ${(s.products || []).map(item => picTile(item.name, item.img)).join("")}
      </div></section>`;
  }

  /* ---------- BRANDS ---------- */
  function brandsView() {
    return sectionHead("", "Brands We Stock") + `<section class="section" style="padding-top:0">${brandLogos()}</section>`;
  }

  /* ---------- VISIT / CONTACT / SHORTLIST / FAQ / PRIVACY ---------- */
  function visitView() {
    return sectionHead("", "Visit Our Store", "Try shades, feel fabrics, pick toys and find the right gift with our team's help.") + `
    <section class="section" style="padding-top:12px">
      <div class="two">
        <div class="band">
          <h3>Why Visit In Person</h3>
          <ul class="ul">
            <li><strong>Try before you buy</strong> — test shades, fabrics and toy quality.</li>
            <li><strong>Expert help</strong> — staff can guide on skin tone, size and gifts.</li>
            <li><strong>Gift wrap</strong> — custom gift packing at the counter.</li>
          </ul>
        </div>
        <div class="band">
          <h3>Store Information</h3>
          <ul class="ul">
            <li><strong>Address:</strong> ${esc(B.address)}</li>
            <li><strong>Hours:</strong> ${esc(B.hours)}</li>
            <li><strong>Phone:</strong> ${esc(B.phone)}</li>
            <li><strong>Email:</strong> ${esc(B.email)}</li>
          </ul>
          <div class="row" style="margin-top:6px">
            <a class="btn dark" href="${mapsUrl}" target="_blank" rel="noopener">Get Directions</a>
            <a class="btn ghost" href="${waUrl("Hi, I would like to know about store timings and product availability.")}" target="_blank" rel="noopener">WhatsApp</a>
          </div>
        </div>
      </div>
    </section>
    <section class="section">
      <h2>Inside the Store</h2>
      <div class="gallery-grid">
        ${(window.GALLERY || []).map(g => `<figure><img src="${esc(g.src)}" alt="${esc(g.caption)}" loading="lazy"><figcaption>${esc(g.caption)}</figcaption></figure>`).join("")}
      </div>
    </section>`;
  }

  /* Contact form. The message opens in WhatsApp. */
  function contactView() {
    return sectionHead("", "Quick Enquiry", "Your message opens in WhatsApp. This website does not store your details.") + `
    <section class="section" style="padding-top:12px">
      <div class="two">
        <div class="band scroll-box">
          <h3>Send an Enquiry</h3>
          <form id="contactForm" class="form" novalidate>
            <label>Your name
              <input name="name" autocomplete="name" required placeholder="Your name">
            </label>
            <label>What are you looking for?
              <select name="interest">
                ${CATS.map(c => `<option>${esc(c.name)}</option>`).join("")}
                <option>General store enquiry</option>
              </select>
            </label>
            <label>Message
              <textarea name="message" required placeholder="Product name, shade, size, occasion…"></textarea>
            </label>
            <div class="row"><button class="btn dark" type="submit">Open WhatsApp Message</button></div>
          </form>
          <div id="contactOut" class="out-box" hidden></div>
        </div>
        <div class="band">
          <h3>Store Help Desk</h3>
          <ul class="ul">
            <li><strong>WhatsApp:</strong> replies during store hours</li>
            <li><strong>Phone:</strong> ${esc(B.phone)}</li>
            <li><strong>Email:</strong> ${esc(B.email)}</li>
            <li><strong>Hours:</strong> ${esc(B.hours)}</li>
            <li><strong>Address:</strong> ${esc(B.address)}</li>
          </ul>
        </div>
      </div>
    </section>`;
  }

  function faqView() {
    return sectionHead("", "Frequently Asked Questions") + `
    <section class="section" style="padding-top:8px">
      <div class="faq">
        ${(window.FAQS || []).map(f => `<details><summary>${esc(f.q)}</summary><div class="ans">${esc(f.a)}</div></details>`).join("")}
      </div>
    </section>`;
  }

  function privacyView() {
    return sectionHead("", "Privacy &amp; Store Terms") + `
    <section class="section two" style="margin-top:12px">
      <div class="band">
        <h3>Privacy</h3>
        <p style="color:var(--muted)">This website stores nothing about you on your device, uses no tracking and no third-party analytics. Enquiries open in WhatsApp and are not saved here.</p>
      </div>
      <div class="band">
        <h3>Store Terms</h3>
        <p style="color:var(--muted)">${esc(B.notice)}</p>
      </div>
    </section>`;
  }

  /* ---------- PHOTO VIEWER (full image, name at the bottom) ---------- */
  const lb = document.createElement("div");
  lb.className = "lb";
  lb.hidden = true;
  lb.setAttribute("role", "dialog");
  lb.setAttribute("aria-modal", "true");
  lb.innerHTML = `<button class="lb-x" type="button" aria-label="Close">×</button>
    <button class="lb-nav lb-prev" type="button" aria-label="Previous product">‹</button>
    <button class="lb-nav lb-next" type="button" aria-label="Next product">›</button>
    <figure class="lb-fig"><img class="lb-img" alt=""><figcaption class="lb-name"></figcaption><a class="btn lb-ask" target="_blank" rel="noopener">Enquire on WhatsApp</a></figure>`;
  document.body.appendChild(lb);
  const lbImg = lb.querySelector(".lb-img");
  const lbName = lb.querySelector(".lb-name");
  const lbAsk = lb.querySelector(".lb-ask");
  const lbPrev = lb.querySelector(".lb-prev");
  const lbNext = lb.querySelector(".lb-next");
  lbImg.addEventListener("error", () => { lbImg.hidden = true; });

  /* The viewer walks through the pictures of the list that was clicked (same order as on the page). */
  let lbList = [];
  let lbIdx = 0;

  function showViewer(i) {
    const it = lbList[i];
    if (!it) return;
    lbIdx = i;
    lbImg.hidden = false;
    lbImg.src = it.src;
    lbImg.alt = it.name;
    lbName.textContent = it.name;
    /* WhatsApp message carries the product name only (no code, no price) */
    lbAsk.href = waUrl(`Hi, I am interested in ${it.name}. Please confirm availability at the store.`);
    const multi = lbList.length > 1;
    lbPrev.hidden = lbNext.hidden = !multi;
  }
  function stepViewer(d) {
    if (lbList.length < 2) return;
    showViewer((lbIdx + d + lbList.length) % lbList.length);
  }
  function openViewer(list, i) {
    lbList = list;
    showViewer(i);
    lb.hidden = false;
    document.body.style.overflow = "hidden";
    lb.querySelector(".lb-x").focus();
  }
  function closeViewer() {
    lb.hidden = true;
    lbImg.removeAttribute("src");
    lbList = [];
    document.body.style.overflow = "";
  }
  lb.addEventListener("click", e => {
    if (e.target.closest(".lb-prev")) { stepViewer(-1); return; }
    if (e.target.closest(".lb-next")) { stepViewer(1); return; }
    if (e.target === lb || e.target.closest(".lb-x")) closeViewer();
  });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeViewer();
    else if (e.key === "ArrowLeft") stepViewer(-1);
    else if (e.key === "ArrowRight") stepViewer(1);
  });
  /* Swipe left / right on the full photo (mobile) */
  let tx = 0, ty = 0;
  lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  lb.addEventListener("touchend", e => {
    const dx = e.changedTouches[0].clientX - tx;
    const dy = e.changedTouches[0].clientY - ty;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy) * 1.3) stepViewer(dx < 0 ? 1 : -1);
  }, { passive: true });

  /* ---------- ROUTER ---------- */
  function parse() {
    const raw = location.hash.slice(1) || "home";
    const i = raw.indexOf("/");
    if (i < 0) return { head: raw, arg: "" };
    const r = { head: raw.slice(0, i), arg: decodeSafe(raw.slice(i + 1)) };
    /* Old product links no longer open a detail page: they show the picture and name instead */
    if (r.head === "fav") return { head: "all", arg: "" };
    if (r.head === "product") { const p = PBID[r.arg]; return p ? { head: "search", arg: p.name } : { head: "home", arg: "" }; }
    return r;
  }

  function activeKey(r) {
    if (r.head === "category") return r.arg.split("/")[0];
    if (r.head === "festival") return "festivals";
    if (r.head === "search" || r.head === "season") return "";
    return r.head;
  }

  function render() {
    const r = parse();
    let html, meta;
    switch (r.head) {
      case "category": {
        html = categoryView(r.arg);
        const c = CAT[r.arg.split("/")[0]] || { name: "Category", desc: "" };
        meta = [`${c.name} | Loventra Store Bilaspur`, `${c.name} at Loventra Store, Bilaspur. ${c.desc}`];
        break;
      }
      case "all": html = allView(); meta = TITLES.all; break;
      case "search": html = searchView(r.arg); meta = [`Search: ${r.arg} | Loventra Store Bilaspur`, `Search results for ${r.arg} at Loventra Store, Bilaspur.`]; break;
      case "festivals": html = festivalsIndexView(); meta = TITLES.festivals; break;
      case "festival": { const f = festOf(r.arg); html = festivalView(r.arg); meta = [`${f.name} Collection | Loventra Store Bilaspur`, `${f.name} collection at Loventra Store, Bilaspur: ${f.products.slice(0, 6).map(x => x.name).join(", ")}.`]; break; }
      case "season": { const s = seasonOf(r.arg); html = seasonView(r.arg); meta = [`${s.label} | Loventra Store Bilaspur`, `${s.label} at Loventra Store, Bilaspur: ${s.products.slice(0, 6).map(x => x.name).join(", ")}.`]; break; }
      case "brands": html = brandsView(); meta = TITLES.brands; break;
      case "visit": html = visitView(); meta = TITLES.visit; break;
      case "contact": html = contactView(); meta = TITLES.contact; break;
      case "faq": html = faqView(); meta = TITLES.faq; break;
      case "privacy": html = privacyView(); meta = TITLES.privacy; break;
      default: html = home(); meta = TITLES.home;
    }
    main.innerHTML = html;
    setMeta(meta[0], meta[1]);
    const key = activeKey(r);
    document.querySelectorAll(".tab").forEach(a => {
      if (a.dataset.r === key) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    if (r.head === "search") { gsInput.value = r.arg; gsClear.hidden = !r.arg; }
  }

  window.addEventListener("hashchange", () => { render(); window.scrollTo({ top: 0 }); });

  /* ---------- EVENTS ---------- */
  document.addEventListener("click", e => {
    const pic = e.target.closest("[data-lb-src]");
    if (pic) {
      const group = pic.closest(".pgrid") || pic.parentElement;
      const all = Array.from(group.querySelectorAll("[data-lb-src]"));
      openViewer(all.map(el => ({ src: el.dataset.lbSrc, name: el.dataset.lbName })), Math.max(0, all.indexOf(pic)));
    }
  });

  document.addEventListener("submit", e => {
    if (e.target.id !== "contactForm") return;
    e.preventDefault();
    const f = e.target;
    const fv = n => f.querySelector(`[name="${n}"]`).value;
    if (!fv("name").trim() || !fv("message").trim()) { toast("Please add your name and message"); return; }
    const text = `Store enquiry\nName: ${fv("name")}\nLooking for: ${fv("interest")}\n\n${fv("message")}`;
    const out = document.getElementById("contactOut");
    out.hidden = false;
    out.innerHTML = `<p><strong style="color:var(--ink)">Ready.</strong> Tap below to open WhatsApp with your message.</p>
      <div class="row" style="margin-top:8px"><a class="btn dark" href="${waUrl(text)}" target="_blank" rel="noopener">Open WhatsApp</a></div>`;
  });

  const toTop = document.getElementById("toTop");
  window.addEventListener("scroll", () => toTop.classList.toggle("show", window.scrollY > 400), { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  /* ---------- SEARCH BAR ---------- */
  const gsForm = document.getElementById("gsForm");
  const gsInput = document.getElementById("gsInput");
  const gsBox = document.getElementById("gsSuggest");
  const gsClear = document.getElementById("gsClear");
  const gs = { active: -1 };

  function closeSuggest() {
    gsBox.hidden = true;
    gsInput.setAttribute("aria-expanded", "false");
    gs.active = -1;
  }
  function setActive(i) {
    const items = [...gsBox.querySelectorAll("[data-opt]")];
    if (!items.length) return;
    gs.active = (i + items.length) % items.length;
    items.forEach((el, k) => el.classList.toggle("is-active", k === gs.active));
    items[gs.active].scrollIntoView({ block: "nearest" });
  }
  function renderSuggest() {
    const q = gsInput.value.trim();
    gsClear.hidden = !gsInput.value;
    if (!q) { closeSuggest(); return; }
    const res = window.SEARCH.run(q).map(r => r.p);
    gsBox.innerHTML = !res.length
      ? `<div class="gs-empty">No products match “${esc(q)}”. Press Enter to search the whole store.</div>`
      : res.slice(0, 6).map((p, i) => `
        <a class="gs-item" role="option" id="gs-opt-${i}" data-opt href="#search/${encodeURIComponent(p.name)}">
          <span class="gs-meta"><strong>${esc(p.name)}</strong></span>
        </a>`).join("") +
        (res.length ? `<a class="gs-all" data-opt id="gs-opt-all" href="#search/${encodeURIComponent(q)}">See all ${res.length} result${res.length === 1 ? "" : "s"} →</a>` : "");
    gsBox.hidden = false;
    gsInput.setAttribute("aria-expanded", "true");
    gs.active = -1;
  }
  function clearSearch() {
    gsInput.value = "";
    gsClear.hidden = true;
    closeSuggest();
    gsInput.focus();
  }

  gsInput.addEventListener("input", renderSuggest);
  gsInput.addEventListener("keydown", e => {
    const items = gsBox.hidden ? [] : [...gsBox.querySelectorAll("[data-opt]")];
    if (e.key === "ArrowDown") { e.preventDefault(); if (gsBox.hidden) renderSuggest(); setActive(gs.active + 1); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setActive(gs.active < 0 ? items.length - 1 : gs.active - 1); }
    else if (e.key === "Enter" && gs.active >= 0 && items[gs.active]) { e.preventDefault(); items[gs.active].click(); }
    else if (e.key === "Escape") { if (!gsBox.hidden) closeSuggest(); else if (gsInput.value) clearSearch(); }
  });
  gsClear.addEventListener("click", clearSearch);
  gsForm.addEventListener("submit", e => {
    e.preventDefault();
    const q = gsInput.value.trim();
    closeSuggest();
    if (!q) { toast("Type a product name to search"); gsInput.focus(); return; }
    const hash = "#search/" + encodeURIComponent(q);
    if (location.hash === hash) render(); else location.hash = hash;
  });
  document.addEventListener("click", e => { if (!e.target.closest("#gsForm")) closeSuggest(); });
  document.addEventListener("keydown", e => {
    const tag = document.activeElement && document.activeElement.tagName;
    if (e.key === "/" && lb.hidden && !["INPUT", "TEXTAREA", "SELECT"].includes(tag) && !e.ctrlKey && !e.metaKey) { e.preventDefault(); gsInput.focus(); }
  });

  render();
})();
