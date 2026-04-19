(function () {
  const root = window.KM || {};

  const auraRules = [
    { id: "romantico", label: "Romántico", from: { floral: 0.48, sweet: 0.25, sensual: 0.25 } },
    { id: "elegante", label: "Elegante", from: { floral: 0.34, sensual: 0.28, fresh: 0.2 } },
    { id: "chispeante", label: "Chispeante", from: { bright: 0.52, fruity: 0.28, fresh: 0.18 } },
    { id: "calmante", label: "Calmante", from: { fresh: 0.34, green: 0.34, floral: 0.16 } },
    { id: "misterioso", label: "Misterioso", from: { sensual: 0.44, warm: 0.34, sweet: 0.12 } },
    { id: "limpio", label: "Limpio", from: { fresh: 0.38, marine: 0.34, green: 0.22 } },
    { id: "atrevido", label: "Atrevido", from: { sensual: 0.34, fruity: 0.26, bright: 0.22, warm: 0.14 } },
    { id: "dulce", label: "Dulce", from: { sweet: 0.62, gourmand: 0.28 } },
    { id: "travieso", label: "Travieso", from: { fruity: 0.4, bright: 0.26, sweet: 0.2 } },
    { id: "sofisticado", label: "Sofisticado", from: { sensual: 0.3, floral: 0.26, warm: 0.2, fresh: 0.12 } },
    { id: "sonador", label: "Soñador", from: { sweet: 0.3, floral: 0.26, marine: 0.18 } },
    { id: "refrescante", label: "Refrescante", from: { fresh: 0.52, marine: 0.32, green: 0.18 } },
    { id: "magico", label: "Mágico", from: { bright: 0.22, sensual: 0.2, sweet: 0.16 }, magic: true }
  ];

  const trends = [
    { id: "limpio", label: "Hoy brillan los aromas limpios", attr: "limpio" },
    { id: "floral-nocturno", label: "Tendencia floral nocturna", attr: "misterioso" },
    { id: "dulce-suave", label: "Semana de nubes dulces", attr: "dulce" },
    { id: "chispa", label: "La ciudad pide chispa", attr: "chispeante" },
    { id: "maggic", label: "La magia está inquieta", attr: "magico" }
  ];

  const secretAuraCombos = [
    { id: "cupido-pop", label: "Cupido Pop", needs: ["Romántico", "Chispeante"], bottle: "lazo brillante" },
    { id: "medianoche-rubi", label: "Medianoche de Rubí", needs: ["Misterioso", "Sofisticado"], bottle: "vidrio lunar" },
    { id: "nube-de-spa", label: "Nube de Spa", needs: ["Calmante", "Refrescante"], bottle: "bruma cristal" },
    { id: "maggic-couture", label: "Maggic Couture", needs: ["Mágico", "Elegante"], bottle: "corona iris" },
    { id: "caramelo-travieso", label: "Caramelo Travieso", needs: ["Dulce", "Travieso"], bottle: "tapón confeti" }
  ];

  function clamp(value, min = 0, max = 10) {
    return Math.max(min, Math.min(max, value));
  }

  function trendForRound(index) {
    return trends[index % trends.length];
  }

  function auraScore(rule, traits, magicUnits, refined, lastTouch) {
    let score = Object.entries(rule.from).reduce((sum, [trait, weight]) => sum + (traits[trait] || 0) * weight, 0);
    if (rule.magic) score += Math.min(4, magicUnits / 8);
    if (refined && (rule.id === "elegante" || rule.id === "sofisticado" || rule.id === "calmante")) score += 0.9;
    if (lastTouch && (rule.id === "chispeante" || rule.id === "magico" || rule.id === "travieso")) score += 0.9;
    return clamp(score);
  }

  // Sistema de aura: convierte rasgos olfativos internos en 1-3 palabras emocionales.
  function buildPerfumeProfile({ level, traits, usage, bubbles, risk, refined, lastTouch, trend }) {
    const chunks = bubbles.flatMap((bubble) => bubble.chunks);
    const solvent = chunks.filter((chunk) => chunk.id === "Solvente").reduce((sum, chunk) => sum + chunk.amount, 0);
    const magicUnits = chunks.filter((chunk) => chunk.id === "Maggic").reduce((sum, chunk) => sum + chunk.amount, 0);
    const total = Math.max(1, Object.values(usage).reduce((sum, amount) => sum + amount, 0));
    const families = new Set(Object.keys(usage).filter((id) => usage[id] > 0).map((id) => root.noteById[id]?.family).filter(Boolean));
    const dominantShare = Math.max(0, ...Object.values(usage)) / total;
    const aura = auraRules
      .map((rule) => ({ id: rule.id, label: rule.label, score: auraScore(rule, traits, magicUnits, refined, lastTouch) }))
      .sort((a, b) => b.score - a.score)
      .filter((item, index) => item.score >= (index === 0 ? 2.4 : 3.15))
      .slice(0, 3);
    if (!aura.length) aura.push({ id: "suave", label: "Suave", score: 2 });

    const wanted = level.emotion?.wants || [];
    const rejects = level.emotion?.rejects || [];
    const auraLabels = aura.map((item) => item.label);
    const emotionFit = wanted.reduce((sum, want) => sum + (auraLabels.includes(want) ? 9 : 0), 0)
      - rejects.reduce((sum, reject) => sum + (auraLabels.includes(reject) ? 10 : 0), 0);
    const trendHit = trend && aura.some((item) => item.id === trend.attr || item.label.toLowerCase() === trend.attr);

    return {
      aura,
      auraText: aura.map((item) => item.label).join(" · "),
      riskLabel: riskLabel(risk, dominantShare),
      emotionFit,
      solvent,
      magicUnits,
      dominantShare,
      familyCount: families.size,
      refined,
      lastTouch,
      trendHit,
      secret: secretForAura(aura),
      descriptors: aura.map((item) => item.label.toLowerCase()).slice(0, 3)
    };
  }

  function riskLabel(risk, dominantShare = 0) {
    const adjusted = risk + (dominantShare > 0.52 ? 8 : 0);
    if (adjusted <= 7) return "estable";
    if (adjusted <= 17) return "vibrante";
    if (adjusted <= 29) return "atrevido";
    return "frágil";
  }

  function secretForAura(aura) {
    const labels = aura.map((item) => item.label);
    return secretAuraCombos.find((combo) => combo.needs.every((need) => labels.includes(need))) || null;
  }

  // Habilidades pasivas: cada mascota altera riesgo o recompensa de forma pequeña y legible.
  function passiveImpact(noteId, context) {
    const note = root.noteById[noteId];
    if (!note) return { riskDelta: 0 };
    const wants = context.level.emotion?.wants || [];
    const bubbleFamilies = new Set(context.bubble.chunks.map((chunk) => root.noteById[chunk.id]?.family).filter(Boolean));
    let riskDelta = context.amount >= 15 ? 2 : 0;
    let message = "";

    if (note.family === context.bubble.targetFamily) riskDelta -= 1;
    if (noteId === "Naranjita" && (context.level.target.fresh || context.level.target.bright)) riskDelta -= 1;
    if (noteId === "Rosamel" && (wants.includes("Romántico") || wants.includes("Suave"))) riskDelta -= 1;
    if (noteId === "Canelito" && (bubbleFamilies.has("gourmand") || wants.includes("Misterioso"))) riskDelta -= 1;
    if (noteId === "Rubiluna" && context.amount >= 15) { riskDelta += 2; message = "Rubiluna brilla fuerte."; }
    if (noteId === "Fresilina" && bubbleFamilies.has("floral")) message = "Fresilina hace cosquillas al pétalo.";
    if (noteId === "Mocachin" && !bubbleFamilies.has("spice") && context.amount >= 15) riskDelta += 2;
    if (noteId === "Marinita" && context.solvent > 0) riskDelta -= 2;
    if (noteId === "Verditia" && context.currentRisk > 12) { riskDelta -= 2; message = "Verditia calma el frasco."; }

    return { riskDelta, message };
  }

  // Eventos sorpresa: no abren menús; solo dan micro-giros al flujo cuando la mezcla cambia.
  function dynamicEventFor({ noteId, profile, risk, seen }) {
    if (risk > 26 && !seen.has("risk-high")) {
      return { id: "risk-high", message: "La esencia tiembla. Refinar podría salvarla.", explain: "El riesgo está alto. Refinar limpia sobredosis una sola vez y baja la inestabilidad.", riskDelta: 0 };
    }
    if (profile.dominantShare > 0.54 && !seen.has("dominant-note")) {
      return { id: "dominant-note", message: `${noteId} quiere ser protagonista.`, explain: "Una nota domina mucho. Puede dar carácter, pero sube el riesgo y el cliente puede sentirlo intenso.", riskDelta: 3 };
    }
    if (profile.secret && !seen.has(`secret-${profile.secret.id}`)) {
      return { id: `secret-${profile.secret.id}`, message: `Algo secreto brilla: ${profile.secret.label}.`, explain: "Has juntado auras compatibles. Si terminas bien, este secreto queda registrado en la Perfupedia.", riskDelta: -2 };
    }
    if (profile.trendHit && !seen.has("trend-hit")) {
      return { id: "trend-hit", message: "La tendencia del día sonríe.", explain: "Tu aura encaja con la moda de hoy. El resultado final gana una pequeña ventaja.", riskDelta: -2 };
    }
    if (profile.magicUnits > 0 && !seen.has("maggic-watch")) {
      return { id: "maggic-watch", message: "Maggic mira la mezcla como si supiera algo.", explain: "Maggic puede revelar pistas, estabilizar o empujar un resultado raro si la mezcla ya apunta a algo especial.", riskDelta: -1 };
    }
    return null;
  }

  // Reacciones: combinan puntuación, personalidad del cliente, aura, tendencia y riesgo.
  function reactionFor(level, profile, score) {
    const style = level.emotion?.reactionStyle || "suave";
    if (score >= 90 && profile.secret) return `Se queda obsesionad${style === "directo" ? "o" : "a"} con ${profile.secret.label}.`;
    if (score >= 86 && profile.trendHit) return "Lo recomienda al instante: justo lo que se lleva hoy.";
    if (score >= 82 && profile.emotionFit > 0) return "Le cambia la cara: era exactamente la sensación que buscaba.";
    if (score >= 70 && profile.riskLabel === "atrevido") return "Le intriga. No era obvio, pero tiene carácter.";
    if (score >= 62) return "Le gusta, aunque pide una versión un poco más afinada.";
    if (profile.riskLabel === "frágil") return "La siente intensa y pide algo más estable.";
    if (profile.familyCount <= 2) return "La nota bonita, pero demasiado plana.";
    return "Sonríe con duda. Hay una idea, falta magia.";
  }

  root.trendForRound = trendForRound;
  root.buildPerfumeProfile = buildPerfumeProfile;
  root.riskLabel = riskLabel;
  root.passiveImpact = passiveImpact;
  root.dynamicEventFor = dynamicEventFor;
  root.reactionFor = reactionFor;
  window.KM = root;
})();
