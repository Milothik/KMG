(function () {
  const root = window.KM || {};

  function hexToRgb(hex) {
    const clean = hex.replace("#", "");
    return [0, 2, 4].map((start) => parseInt(clean.slice(start, start + 2), 16) / 255);
  }

  function channelToLinear(value) {
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  }

  function linearToChannel(value) {
    const gam = value <= 0.0031308 ? 12.92 * value : 1.055 * (value ** (1 / 2.4)) - 0.055;
    return Math.round(Math.min(1, Math.max(0, gam)) * 255);
  }

  function mixWeightedColors(items, dilution = 0) {
    const usable = items.filter((item) => item.amount > 0 && item.color);
    if (!usable.length) return "rgb(255, 255, 255)";
    const total = usable.reduce((sum, item) => sum + item.amount, 0);
    const linear = [0, 0, 0];

    usable.forEach((item) => {
      const weight = item.amount / total;
      hexToRgb(item.color).map(channelToLinear).forEach((channel, index) => {
        linear[index] += channel * weight;
      });
    });

    const white = Math.min(0.74, Math.max(0, dilution));
    const diluted = linear.map((channel) => channel * (1 - white) + 1 * white);
    return `rgb(${diluted.map(linearToChannel).join(", ")})`;
  }

  function colorForChunks(chunks, resolvedMagicId) {
    const items = [];
    let solvent = 0;
    chunks.forEach((chunk) => {
      if (chunk.id === "Solvente") {
        solvent += chunk.amount;
        return;
      }
      const id = chunk.id === "Maggic" ? resolvedMagicId : chunk.id;
      const note = root.noteById[id];
      if (note) items.push({ color: note.color, amount: chunk.amount });
    });
    return mixWeightedColors(items, solvent / 95);
  }

  root.mixWeightedColors = mixWeightedColors;
  root.colorForChunks = colorForChunks;
  window.KM = root;
})();
