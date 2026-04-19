(function () {
  const root = window.KM || {};

  const rawMaterials = [
    { id: "petalos-rosa", label: "Pétalos de Rosa Búlgara", icon: "rosa", color: "#f589b4" },
    { id: "cascara-bergamota", label: "Cáscara de Bergamota", icon: "bergamota", color: "#ffb23e" },
    { id: "sal-marina", label: "Sal Marina Azul", icon: "sal", color: "#48aee8" },
    { id: "hoja-violeta", label: "Hoja de Violeta", icon: "hoja", color: "#72bf69" },
    { id: "resina-ambar", label: "Resina de Ámbar", icon: "ámbar", color: "#e95b68" },
    { id: "haba-tonka", label: "Haba Tonka Tostada", icon: "tonka", color: "#9c6844" },
    { id: "pimienta-rosa", label: "Pimienta Rosa", icon: "pimienta", color: "#d86a8d" },
    { id: "jazmin-nocturno", label: "Jazmín Nocturno", icon: "jazmín", color: "#c99cf4" },
    { id: "musgo-rocio", label: "Musgo con Rocío", icon: "musgo", color: "#42bea7" },
    { id: "vainilla-cristal", label: "Vainilla Cristal", icon: "vainilla", color: "#f4ad41" }
  ];

  const rawById = Object.fromEntries(rawMaterials.map((item) => [item.id, item]));

  const captiveRecipes = [
    { id: "rose-velvet", label: "Rosa Velvet", inputs: ["petalos-rosa", "petalos-rosa", "jazmin-nocturno"], effect: { traits: { floral: 1.1, sensual: .5 }, risk: -2 } },
    { id: "citrus-aura", label: "Aura Cítrica", inputs: ["cascara-bergamota", "cascara-bergamota", "sal-marina"], effect: { traits: { fresh: .9, bright: 1.2 }, risk: 1 } },
    { id: "marine-silk", label: "Seda Marina", inputs: ["sal-marina", "hoja-violeta", "musgo-rocio"], effect: { traits: { marine: 1.1, fresh: .6 }, risk: -3 } },
    { id: "amber-secret", label: "Ámbar Secreto", inputs: ["resina-ambar", "resina-ambar", "pimienta-rosa"], effect: { traits: { warm: 1.1, sensual: 1 }, risk: 2 } },
    { id: "tonka-cloud", label: "Nube Tonka", inputs: ["haba-tonka", "vainilla-cristal", "vainilla-cristal"], effect: { traits: { sweet: 1.2, gourmand: 1 }, risk: 1 } },
    { id: "green-fix", label: "Fijador Verde", inputs: ["hoja-violeta", "musgo-rocio", "musgo-rocio"], effect: { traits: { green: 1.3, fresh: .4 }, risk: -4 } },
    { id: "pink-spark", label: "Chispa Rosa", inputs: ["pimienta-rosa", "cascara-bergamota", "petalos-rosa"], effect: { traits: { bright: .9, floral: .5 }, risk: 2 } },
    { id: "nocturne-accord", label: "Acorde Nocturne", inputs: ["jazmin-nocturno", "resina-ambar", "sal-marina"], effect: { traits: { sensual: 1.1, marine: .4 }, risk: 1 } },
    { id: "moss-whisper", label: "Susurro de Musgo", inputs: ["musgo-rocio", "hoja-violeta", "sal-marina"], effect: { traits: { green: .9, marine: .8 }, risk: -2 } },
    { id: "crystal-gourmand", label: "Gourmand Cristal", inputs: ["vainilla-cristal", "haba-tonka", "pimienta-rosa"], effect: { traits: { gourmand: 1.1, sweet: .8, warm: .4 }, risk: 2 } }
  ];

  const captiveById = Object.fromEntries(captiveRecipes.map((item) => [item.id, item]));
  const recipeKey = (ids) => [...ids].sort().join("|");
  const recipeByKey = Object.fromEntries(captiveRecipes.map((item) => [recipeKey(item.inputs), item]));

  function rewardForRound({ levelIndex, score, profile }) {
    const base = [
      rawMaterials[levelIndex % rawMaterials.length],
      rawMaterials[(levelIndex + 3) % rawMaterials.length]
    ];
    const bonus = score >= 82 ? rawMaterials[(levelIndex + 6) % rawMaterials.length] : null;
    const magic = profile?.secret ? rawMaterials[(levelIndex + 8) % rawMaterials.length] : null;
    const items = [
      { id: base[0].id, amount: 2 },
      { id: base[1].id, amount: 1 },
      ...(bonus ? [{ id: bonus.id, amount: 1 }] : []),
      ...(magic ? [{ id: magic.id, amount: 1 }] : [])
    ];
    return { items, label: items.map((item) => `${rawById[item.id].label} x${item.amount}`).join(" · ") };
  }

  function tryCaptiveRecipe(save, slotIds) {
    const ids = slotIds.filter(Boolean);
    if (ids.length < 2) return { ok: false, message: "Elige dos o tres materias." };
    const recipe = recipeByKey[recipeKey(ids)];
    if (!recipe) return { ok: false, message: "No reaccionan todavía." };
    const needed = ids.reduce((map, id) => {
      map[id] = (map[id] || 0) + 1;
      return map;
    }, {});
    const hasEnough = Object.entries(needed).every(([id, amount]) => (save.rawMaterials?.[id] || 0) >= amount);
    if (!hasEnough) return { ok: false, message: "Falta materia prima." };
    Object.entries(needed).forEach(([id, amount]) => root.spendInventory(save, "rawMaterials", id, amount));
    root.addCaptive(save, recipe.id, 1);
    save.captiveDiscoveries ||= [];
    if (!save.captiveDiscoveries.includes(recipe.id)) save.captiveDiscoveries.push(recipe.id);
    root.writeSave(save);
    return { ok: true, recipe, message: `${recipe.label} despertó.` };
  }

  function applyCaptiveBoost(traits, captive) {
    if (!captive?.effect?.traits) return traits;
    Object.entries(captive.effect.traits).forEach(([trait, value]) => {
      traits[trait] = (traits[trait] || 0) + value;
    });
    return traits;
  }

  root.rawMaterials = rawMaterials;
  root.rawById = rawById;
  root.captiveRecipes = captiveRecipes;
  root.captiveById = captiveById;
  root.rewardForRound = rewardForRound;
  root.tryCaptiveRecipe = tryCaptiveRecipe;
  root.applyCaptiveBoost = applyCaptiveBoost;
  window.KM = root;
})();
