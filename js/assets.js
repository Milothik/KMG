(function () {
  const root = window.KM || {};
  const prefix = window.KM_ASSET_PREFIX || "assets/images/";
  const assets = window.KM_ASSETS || {};
  const asset = (file) => assets[file] || `${prefix}${file}`;

  const notes = [
    {
      id: "Naranjita",
      family: "citrus",
      passive: "chispa amable: baja el riesgo cuando ilumina una mezcla fresca",
      color: "#ffb23e",
      logo: "Naranjita.png",
      traits: { fresh: 9, bright: 10, fruity: 4, floral: 1, marine: 0, warm: 0, sweet: 2, sensual: 0, green: 1, gourmand: 0 }
    },
    {
      id: "Rosamel",
      family: "floral",
      passive: "abrazo floral: mejora pedidos románticos y suaves",
      color: "#f589b4",
      logo: "Rosamel.png",
      traits: { fresh: 2, bright: 2, fruity: 1, floral: 10, marine: 0, warm: 1, sweet: 3, sensual: 3, green: 1, gourmand: 0 }
    },
    {
      id: "Canelito",
      family: "spice",
      passive: "fijador tibio: estabiliza mezclas dulces o nocturnas",
      color: "#b9794b",
      logo: "Canelito.png",
      traits: { fresh: 0, bright: 0, fruity: 0, floral: 0, marine: 0, warm: 9, sweet: 7, sensual: 4, green: 0, gourmand: 2 }
    },
    {
      id: "Rubiluna",
      family: "amber",
      passive: "brillo lunar: sube el aura misteriosa, pero añade riesgo si domina",
      color: "#e95b68",
      logo: "Rubiluna.png",
      traits: { fresh: 0, bright: 1, fruity: 1, floral: 1, marine: 0, warm: 7, sweet: 3, sensual: 10, green: 0, gourmand: 0 }
    },
    {
      id: "Fresilina",
      family: "fruity",
      passive: "alegría frutal: aumenta sorpresa y descubrimientos chispeantes",
      color: "#f55f91",
      logo: "Fresilina.png",
      traits: { fresh: 5, bright: 6, fruity: 10, floral: 2, marine: 0, warm: 1, sweet: 6, sensual: 1, green: 0, gourmand: 1 }
    },
    {
      id: "Mocachin",
      family: "gourmand",
      passive: "nube dulce: suaviza perfumes tiernos, pero puede saturar",
      color: "#9c6844",
      logo: "Mocachin.png",
      traits: { fresh: 0, bright: 0, fruity: 1, floral: 0, marine: 0, warm: 7, sweet: 10, sensual: 4, green: 0, gourmand: 10 }
    },
    {
      id: "Marinita",
      family: "marine",
      passive: "aire limpio: reduce penalización de solvente y refresca",
      color: "#48aee8",
      logo: "Marinita.png",
      traits: { fresh: 7, bright: 4, fruity: 1, floral: 1, marine: 10, warm: 0, sweet: 2, sensual: 1, green: 0, gourmand: 0 }
    },
    {
      id: "Verditia",
      family: "green",
      passive: "hojita calma: el refinado funciona mejor si está presente",
      color: "#72bf69",
      logo: "Verditia.png",
      traits: { fresh: 8, bright: 5, fruity: 0, floral: 1, marine: 1, warm: 0, sweet: 0, sensual: 0, green: 10, gourmand: 0 }
    },
    {
      id: "Maggic",
      family: "magic",
      passive: "Maggic sabe algo: revela, estabiliza o convierte el aura",
      color: "#5b83d7",
      logo: "Maggic.png",
      traits: { fresh: 0, bright: 0, fruity: 0, floral: 0, marine: 0, warm: 0, sweet: 0, sensual: 0, green: 0, gourmand: 0 }
    },
    {
      id: "Solvente",
      family: "solvent",
      passive: "gota infinita: limpia, diluye y ayuda a cerrar burbujas",
      color: "#9eddf6",
      logo: "Solvente.png",
      unlimited: true,
      traits: { fresh: 0, bright: 1, fruity: 0, floral: 0, marine: 1, warm: 0, sweet: 0, sensual: 0, green: 0, gourmand: 0 }
    }
  ];

  const traitLabels = {
    fresh: "fresco",
    bright: "brillante",
    fruity: "frutal",
    floral: "floral",
    marine: "marino",
    warm: "cálido",
    sweet: "dulce",
    sensual: "sensual",
    green: "verde",
    gourmand: "gourmand"
  };

  const synergies = [
    { id: "petalo-frutal", label: "Pétalo frutal", families: ["floral", "fruity"] },
    { id: "ola-verde", label: "Ola verde", families: ["marine", "green"] },
    { id: "abrazo-dulce", label: "Abrazo dulce", families: ["spice", "gourmand"] },
    { id: "luna-rosa", label: "Luna rosa", families: ["amber", "floral"] },
    { id: "chispa-marina", label: "Chispa marina", families: ["citrus", "marine"] },
    { id: "bosque-citrico", label: "Bosque cítrico", families: ["citrus", "green"] }
  ];

  root.asset = asset;
  root.notes = notes;
  root.noteIds = notes.filter((note) => note.id !== "Maggic" && note.id !== "Solvente").map((note) => note.id);
  root.noteById = Object.fromEntries(notes.map((note) => [note.id, note]));
  root.traitLabels = traitLabels;
  root.synergies = synergies;
  root.familyLabel = {
    citrus: "cítrica",
    floral: "floral",
    spice: "especiada",
    amber: "ámbar",
    fruity: "frutal",
    gourmand: "gourmand",
    marine: "marina",
    green: "verde",
    magic: "mágica"
  };

  window.KM = root;
})();
