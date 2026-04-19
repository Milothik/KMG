(function () {
  const root = window.KM || {};

  function bestNoteForTarget(level, stock) {
    const target = level.target || {};
    const avoid = level.avoid || {};
    return root.noteIds
      .map((id) => {
        const note = root.noteById[id];
        let score = (stock[id] || 0) * 0.12;
        Object.entries(target).forEach(([trait, value]) => {
          score += (note.traits[trait] || 0) * value;
        });
        Object.entries(avoid).forEach(([trait, limit]) => {
          score -= Math.max(0, (note.traits[trait] || 0) - limit) * 7;
        });
        return { id, score };
      })
      .sort((a, b) => b.score - a.score)[0]?.id || root.noteIds[0];
  }

  function planMaggic(state) {
    const required = state.solventBubbleIds || state.level.solvente?.obligatorias || [];
    const solventBubble = state.bubbles.find((bubble) => (bubble.solventRequired || required.includes(bubble.id)) && bubble.remaining > 0);
    if (solventBubble) {
      return {
        type: "solvent",
        bubbleId: solventBubble.id,
        amount: Math.min(solventBubble.remaining, 15),
        message: "Maggic convierte el hueco obligatorio en solvente limpio."
      };
    }

    const closeBubble = state.bubbles
      .filter((bubble) => bubble.filled > 0 && bubble.remaining > 0 && bubble.remaining <= 12)
      .sort((a, b) => a.remaining - b.remaining)[0];
    if (closeBubble) {
      return {
        type: "complete",
        bubbleId: closeBubble.id,
        amount: closeBubble.remaining,
        message: "Maggic cierra una burbuja sin crear bonus."
      };
    }

    const best = bestNoteForTarget(state.level, state.stock);
    if ((state.stock[best] || 0) < 12) {
      return {
        type: "grant",
        noteId: best,
        amount: 12,
        message: `Maggic prepara ${best} para acercarte al pedido.`
      };
    }

    const trait = Object.entries(state.level.target || {}).sort((a, b) => b[1] - a[1])[0]?.[0];
    return {
      type: "hint",
      noteId: best,
      message: `Maggic escucha ${root.traitLabels[trait] || "armonía"} y señala a ${best}.`
    };
  }

  root.bestNoteForTarget = bestNoteForTarget;
  root.planMaggic = planMaggic;
  window.KM = root;
})();
