/* =====================================================================
   SEARCH — whole-store product search. Runs fully in the browser.

   Strict and fast: it shows only what the shopper typed.
   - Search and the category pages use the same product list, so nothing appears
     in search that cannot also be found by browsing its category.
   - Words are matched only against the product NAME and its SUBCATEGORY.
     Descriptions, categories and loosely related words are not searched, so
     "kit" does not bring up a bottle and "gift" does not bring up a board game.
   - Every typed word must match (so "gold ring" finds only gold rings).
   - Each product shows once.
   - Small spelling mistakes (for example "lipstik") are corrected only when
     nothing matches exactly.

   SPELLING_VARIANTS lists different spellings of the SAME word. Add more if needed.
   ===================================================================== */
(function () {
  const SPELLING_VARIANTS = [
    ["kurta", "kurti"],
    ["jhumka", "jhumki"],
    ["kajal", "kohl"],
    ["pooja", "puja"],
    ["colour", "color"],
    ["decor", "décor"],
    ["jewellery", "jewelry", "jewelery"],
    ["oxidised", "oxidized"],
    ["tshirt", "t shirt", "tee"],
    ["tumbler", "sipper"]
  ];

  const norm = s => String(s ?? "").toLowerCase()
    .replace(/['’]s\b/g, "")
    .replace(/[^\p{L}\p{M}\p{N}]+/gu, " ")
    .trim();
  const stem = w => {
    if (w.length > 4 && w.endsWith("ies")) return w.slice(0, -3) + "y";
    if (w.length > 4 && /(ches|shes|sses|xes|zes)$/.test(w)) return w.slice(0, -2);
    if (w.length > 3 && w.endsWith("s") && !w.endsWith("ss")) return w.slice(0, -1);
    return w;
  };
  const toStems = s => norm(s).split(" ").filter(Boolean).map(stem);
  const phraseKey = s => toStems(s).join(" ");

  const variantMap = new Map();
  SPELLING_VARIANTS.forEach(group => {
    const members = [...new Set(group.map(phraseKey).filter(Boolean))];
    members.forEach(m => variantMap.set(m, members));
  });

  /* Every product is searchable, and every product is also listed on its category page. */
  const searchable = () => window.PRODUCTS;

  let docCache = null;
  const docs = () => docCache || (docCache = (() => {
    const seen = new Set();
    return searchable().filter(p => {
      const k = phraseKey(p.name);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    }).map(p => ({
      p,
      name: toStems(p.name),
      sub: toStems(p.sub),
      nameKey: " " + toStems(p.name).join(" ") + " ",
      subKey: " " + toStems(p.sub).join(" ") + " "
    }));
  })());

  function lev(a, b) {
    if (a === b) return 0;
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++) {
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      }
      prev = cur;
    }
    return prev[b.length];
  }

  let vocabCache = null;
  const vocab = () => vocabCache || (vocabCache = [...new Set(docs().flatMap(d => [...d.name, ...d.sub]))].filter(w => w.length >= 3));

  /* a typed term matches a field when it is a whole word there, or the start of a word (3+ letters) */
  const termHit = (term, tokens, key) => term.includes(" ")
    ? key.includes(" " + term + " ")
    : tokens.some(t => t === term || (term.length >= 3 && t.startsWith(term)));

  function unitsFor(q, fuzzy) {
    return toStems(q).map(tok => {
      const terms = new Set([tok, ...(variantMap.get(tok) || [])]);
      if (fuzzy && tok.length >= 5) {
        vocab().forEach(v => { if (Math.abs(v.length - tok.length) <= 1 && lev(v, tok) <= 1) terms.add(v); });
      }
      return [...terms];
    });
  }

  function search(q, fuzzy) {
    const units = unitsFor(q, fuzzy);
    if (!units.length) return [];
    const first = toStems(q)[0];
    const out = [];
    docs().forEach(d => {
      let score = 0;
      for (const terms of units) {
        let best = 0;
        for (const t of terms) {
          if (termHit(t, d.name, d.nameKey)) best = Math.max(best, d.name.includes(t) ? 10 : 8);
          else if (termHit(t, d.sub, d.subKey)) best = Math.max(best, 5);
        }
        if (!best) return;          /* every typed word must match */
        score += best;
      }
      if (d.name[0] && d.name[0].startsWith(first)) score += 2;   /* name starting with the word comes first */
      out.push({ p: d.p, score });
    });
    return out;
  }

  function run(q) {
    const raw = String(q ?? "").trim().toLowerCase();
    if (!raw) return [];
    let out = search(raw, false);
    if (!out.length) out = search(raw, true);   /* spelling help only when nothing matches exactly */
    return out.sort((a, b) => b.score - a.score || a.p.name.localeCompare(b.p.name));
  }

  /* Words to try when nothing matched (shown as small chips) */
  function suggest(q) {
    const out = [];
    toStems(String(q ?? "")).forEach(tok => {
      vocab().map(v => [v, lev(v, tok)])
        .filter(([v, d]) => d <= (tok.length <= 4 ? 1 : 2) && v !== tok)
        .sort((a, b) => a[1] - b[1]).slice(0, 3).forEach(([v]) => out.push(v));
    });
    return [...new Set(out)].slice(0, 6);
  }

  window.SEARCH = { run, suggest };
})();
