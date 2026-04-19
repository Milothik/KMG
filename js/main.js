(function () {
  const KM = window.KM;
  const $ = (id) => document.getElementById(id);
  const APP_VERSION = "v1.3";
  const ALIQUOT_MIN = 1;
  const ALIQUOT_MAX = 15;
  const MIX_PHASES = [
    { id: "fondo", label: "Fondo", hint: "Base suave" },
    { id: "corazon", label: "Corazón", hint: "Acorde vivo" },
    { id: "salida", label: "Salida", hint: "Brillo final" }
  ];
  const FRASCO_BOTTLES = [
    { file: "Frasco_transparent.png", label: "rosado", from: 330, to: 360 },
    { file: "Frasco7_transparent.png", label: "rubí", from: 0, to: 14 },
    { file: "Frasco8_transparent.png", label: "mandarina", from: 14, to: 34 },
    { file: "Frasco4_transparent.png", label: "dorado", from: 34, to: 76 },
    { file: "Frasco2_transparent.png", label: "verde", from: 76, to: 166 },
    { file: "Frasco3_transparent.png", label: "cristal", from: 166, to: 256 },
    { file: "Frasco5_transparent.png", label: "floral", from: 256, to: 330 },
    { file: "Frasco6_transparent.png", label: "ámbar", special: "warm-dark" }
  ];

  const state = {
    levels: [],
    levelIndex: 0,
    level: null,
    save: KM.loadSave(),
    stock: {},
    bubbles: [],
    phaseBubbles: [],
    phaseIndex: 0,
    phaseAdvancePending: false,
    phaseCores: [],
    selectedBubbleId: null,
    selectedNote: null,
    aliquotAmount: 5,
    memory: null,
    timer: null,
    particles: null,
    trend: null,
    risk: 0,
    overdoseCount: 0,
    refined: false,
    refinedPhase: null,
    lastTouch: false,
    lastTouchBoost: null,
    eventsSeen: new Set(),
    solventBubbleIds: [],
    dialogTimer: null,
    pediaTab: "perfumes",
    captiveSlots: [],
    lastPerfume: null,
    guideTimer: null,
    guideAfterClose: null,
    pendingTimers: new Set(),
    tutorialStep: null,
    roundStartedAsTutorial: false
  };

  const els = {};
  const CLIENT_IMAGE_BY_LEVEL = {
    "bruma-jardin": "C-CLARA.png",
    "sorbete-rosita": "C-LUZ.png",
    "noche-bonita": "C-RAQUEL.png",
    "ola-de-cristal": "C-JORDI.png",
    "merienda-suave": "C-FERNANDO.png",
    "bosque-chispa": "C-GLORIA.png",
    "rubi-de-feria": "C-GEMMA.png",
    "lluvia-azucar": "C-LAURa.png",
    "mandarina-zen": "C-FERNANDO.png",
    "corona-maggic": "C-KMG.png"
  };

  async function init() {
    [
      "appBackgroundImg", "musicToggleBtn", "sfxToggleBtn", "buildVersion", "logoImg", "homeLogoImg", "newGameArt", "playArt", "pediaArt", "captiveArt", "elaborationsArt", "familyArt", "headerPediaArt", "headerCaptiveArt", "startMemoryArt", "phaseLabel", "orderTitle", "orderClient", "randomOrderBtn", "newGameBtn", "playBtn", "introTitle", "introDesc", "emotionBrief", "introTags", "clientPortrait", "clientPortraitImg",
      "startMemoryBtn", "memoryBoard", "pairsStat", "streakStat", "timerStat", "dropsStat",
      "timerFill", "restartMemoryBtn", "mixPhaseEyebrow", "mixTitle", "bubbleChart", "filledBadge", "noteTray",
      "aliquotRow", "selectedNoteLabel", "dominantBadge", "auraBadge", "riskBadge", "traitList", "maggicHint",
      "refineBtn", "lastTouchBtn", "lastTouchMenu", "lastTouchChoices", "closeLastTouchBtn", "clearBtn", "evaluateBtn", "scoreOrb", "rarityLabel", "resultTitle", "resultAura", "resultFeedback", "resultReaction",
      "finalBottleImg", "finalLiquid", "finalOrbiters", "finalPyramid", "resultTags", "resultRewards", "retryBtn", "nextBtn", "pediaBtn", "headerPediaBtn", "pediaPanel",
      "closePediaBtn", "pediaTabs", "pediaGrid", "captiveBtn", "headerCaptiveBtn", "captivePanel", "closeCaptiveBtn", "captiveSlots", "rawGrid", "captiveGrid",
      "elaborationsBtn", "elaborationsPanel", "closeElaborationsBtn", "elaborationsList", "familyBtn", "familyPanel", "closeFamilyBtn", "familyContent",
      "mixCaptiveBtn", "clearCaptiveBtn", "captiveResult", "phaseCoreLayer", "phaseBanner", "phaseBannerEyebrow", "phaseBannerTitle", "guideBubble", "guideEyebrow", "guideTitle", "guideText", "guideOkBtn", "toast", "fxCanvas"
    ].forEach((id) => { els[id] = $(id); });

    els.logoImg.src = KM.asset("Logo.png");
    els.homeLogoImg.src = KM.asset("Logo.png");
    els.buildVersion.textContent = APP_VERSION;
    setThemeAssets();
    state.particles = new KM.ParticleSystem(els.fxCanvas);
    bindEvents();
    state.levels = await loadLevels();
    renderHome();
    updateNotificationBadges();
    updateSoundToggle();
    showScreen("home");
  }

  async function loadLevels() {
    if (Array.isArray(window.KM_LEVELS)) return window.KM_LEVELS;
    const response = await fetch("./data/levels.json");
    if (!response.ok) throw new Error("No se pudieron cargar los niveles");
    return response.json();
  }

  function bindEvents() {
    els.newGameBtn.addEventListener("click", () => showScreen("menu"));
    els.playBtn.addEventListener("click", () => initRound(randomLevelIndex()));
    els.logoImg.addEventListener("click", goToMainMenu);
    els.logoImg.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      goToMainMenu();
    });
    els.randomOrderBtn.addEventListener("click", changeRandomOrder);
    els.musicToggleBtn.addEventListener("click", () => {
      KM.toggleMusic?.();
      updateSoundToggle();
    });
    els.sfxToggleBtn.addEventListener("click", () => {
      KM.toggleSfx?.();
      updateSoundToggle();
    });
    document.addEventListener("km:soundchange", updateSoundToggle);
    els.startMemoryBtn.addEventListener("click", startMemory);
    els.restartMemoryBtn.addEventListener("click", startMemory);
    els.refineBtn.addEventListener("click", refinePerfume);
    els.lastTouchBtn.addEventListener("click", openLastTouchMenu);
    els.closeLastTouchBtn.addEventListener("click", closeLastTouchMenu);
    els.lastTouchChoices.addEventListener("click", onLastTouchChoice);
    els.clearBtn.addEventListener("click", clearBottle);
    els.evaluateBtn.addEventListener("click", evaluate);
    els.retryBtn.addEventListener("click", () => initRound(state.levelIndex));
    els.nextBtn.addEventListener("click", () => initRound(nextRoundIndex()));
    els.pediaBtn.addEventListener("click", openPedia);
    els.headerPediaBtn.addEventListener("click", openPedia);
    els.closePediaBtn.addEventListener("click", closePedia);
    els.pediaPanel.addEventListener("click", (event) => {
      if (event.target === els.pediaPanel) closePedia();
    });
    els.captiveBtn.addEventListener("click", openCaptiveMixer);
    els.headerCaptiveBtn.addEventListener("click", openCaptiveMixer);
    els.closeCaptiveBtn.addEventListener("click", closeCaptiveMixer);
    els.captivePanel.addEventListener("click", (event) => {
      if (event.target === els.captivePanel) closeCaptiveMixer();
    });
    els.rawGrid.addEventListener("click", onRawClick);
    els.captiveGrid.addEventListener("click", onCaptiveClick);
    els.captiveSlots.addEventListener("click", onCaptiveSlotClick);
    els.mixCaptiveBtn.addEventListener("click", mixCaptive);
    els.clearCaptiveBtn.addEventListener("click", clearCaptiveSlots);
    els.elaborationsBtn.addEventListener("click", openElaborations);
    els.closeElaborationsBtn.addEventListener("click", closeElaborations);
    els.elaborationsPanel.addEventListener("click", (event) => {
      if (event.target === els.elaborationsPanel) closeElaborations();
    });
    els.elaborationsList.addEventListener("click", onElaborationClick);
    els.familyBtn.addEventListener("click", openFamilyLore);
    els.closeFamilyBtn.addEventListener("click", closeFamilyLore);
    els.familyPanel.addEventListener("click", (event) => {
      if (event.target === els.familyPanel) closeFamilyLore();
    });
    els.guideOkBtn.addEventListener("click", closeGuide);
    document.addEventListener("click", (event) => {
      const button = event.target.closest("button");
      if (!button || button.disabled || button.matches(".memory-card, .note-card, .mix-bubble, .aliquot-step")) return;
      KM.playSfx?.("tap", { volume: 0.34, cooldown: 80 });
    }, { capture: true });
    els.pediaTabs.addEventListener("click", (event) => {
      const tab = event.target.closest("[data-pedia-tab]");
      if (!tab) return;
      state.pediaTab = tab.dataset.pediaTab;
      renderPedia();
    });
    els.memoryBoard.addEventListener("click", onMemoryClick);
    els.bubbleChart.addEventListener("click", onBubbleClick);
    els.noteTray.addEventListener("click", onNoteClick);
    document.addEventListener("input", (event) => {
      const slider = event.target.closest("#aliquotSlider");
      if (!slider) return;
      if (isTutorialRound() && state.tutorialStep === "aliquot") {
        event.preventDefault();
        state.aliquotAmount = tutorialAliquotAmount();
        setTutorialStep("bubble");
        renderMix();
        return;
      }
      setAliquotAmount(Number(slider.value));
    });
    els.aliquotRow.addEventListener("click", onAliquotStepClick);
  }

  function renderHome() {
    renderHeader("Overlord");
    els.orderTitle.textContent = "Kawaii Mixer Game";
    els.orderClient.textContent = "Perfumes con burbujas, clientes y secretos.";
  }

  function setThemeAssets() {
    const root = document.documentElement;
    const cssAssetUrl = (file) => {
      const value = KM.asset(file);
      return value.startsWith("data:") ? value : `../${value.replace(/^\.?\//, "")}`;
    };
    const setCssAsset = (name, file) => {
      root.style.setProperty(name, `url("${cssAssetUrl(file)}")`);
    };
    root.style.setProperty("--wood-bg", `url("${cssAssetUrl("Fondo.png")}")`);
    root.style.setProperty("--start-button-img", `url("${cssAssetUrl("Empezar-btn.png")}")`);
    root.style.setProperty("--play-button-img", `url("${cssAssetUrl("Jugar-btn.png")}")`);
    root.style.setProperty("--pedia-button-img", `url("${cssAssetUrl("Perfupedia-btn.png")}")`);
    root.style.setProperty("--captive-button-img", `url("${cssAssetUrl("Cautivos-btn.png")}")`);
    root.style.setProperty("--family-button-img", `url("${cssAssetUrl("La Familia del Mezclador.png")}")`);
    root.style.setProperty("--memory-card-img", `url("${cssAssetUrl("memory.png")}")`);
    setCssAsset("--ui-panel-aliquot", "Paneles Jugar/Alicuota.png");
    setCssAsset("--ui-panel-reading", "Paneles Jugar/Lectura Acorde actual.png");
    setCssAsset("--ui-game-backdrop", "Paneles Jugar/Fondo Taller.png");
    setCssAsset("--ui-button-refine", "Paneles Jugar/ui-clean/refinar.png");
    setCssAsset("--ui-button-last-touch", "Paneles Jugar/ui-clean/ultimo-toque.png");
    setCssAsset("--ui-button-clear", "Paneles Jugar/ui-clean/vaciar.png");
    setCssAsset("--ui-button-present", "Paneles Jugar/ui-clean/presentar.png");
    setCssAsset("--ui-button-mix", "Paneles Jugar/ui-clean/mezclar.png");
    setCssAsset("--ui-badge-drops", "Paneles Jugar/QtyGotas.png");
    els.appBackgroundImg.src = KM.asset("Fondo.png");
    els.newGameArt.src = KM.asset("Empezar-btn.png");
    els.playArt.src = KM.asset("Jugar-btn.png");
    els.pediaArt.src = KM.asset("Perfupedia-btn.png");
    els.captiveArt.src = KM.asset("Cautivos-btn.png");
    els.elaborationsArt.src = KM.asset("Elaboraciones-btn.png");
    els.familyArt.src = KM.asset("La Familia del Mezclador.png");
    els.headerPediaArt.src = KM.asset("Perfupedia-btn.png");
    els.headerCaptiveArt.src = KM.asset("Cautivos-btn.png");
    els.startMemoryArt.src = KM.asset("Empezar-btn.png");
    els.finalBottleImg.src = KM.asset("Frasco_transparent.png");
    els.clientPortraitImg.src = KM.asset("C-CLARA.png");
    root.classList.add("km-theme-ready");
  }

  function tutorialLevelIndices() {
    return state.levels
      .map((level, index) => ({ index, order: level.tutorial?.order }))
      .filter((item) => Number.isInteger(item.order))
      .sort((a, b) => a.order - b.order)
      .map((item) => item.index)
      .slice(0, 3);
  }

  function nextTutorialLevelIndex() {
    if (state.save.tutorial?.completed) return null;
    const levels = tutorialLevelIndices();
    if (!levels.length) return null;
    const cursor = clamp(Math.round(state.save.tutorial?.levelIndex || 0), 0, levels.length);
    return levels[cursor] ?? null;
  }

  function nextRoundIndex() {
    const tutorialIndex = nextTutorialLevelIndex();
    if (tutorialIndex !== null) return tutorialIndex;
    return (state.levelIndex + 1) % state.levels.length;
  }

  function firstLevelIndex() {
    const tutorialIndex = tutorialLevelIndices()[0];
    if (Number.isInteger(tutorialIndex)) return tutorialIndex;
    const bruma = state.levels.findIndex((level) => level.id === "bruma-jardin");
    return bruma >= 0 ? bruma : 0;
  }

  function randomLevelIndex() {
    const tutorialIndex = nextTutorialLevelIndex();
    if (tutorialIndex !== null) return tutorialIndex;
    return randomPlayableLevelIndex();
  }

  function randomDifferentLevelIndex() {
    const indices = playableLevelIndices();
    if (indices.length <= 1) return indices[0] ?? 0;
    let nextIndex = indices[randomInt(0, indices.length - 1)];
    let attempts = 0;
    while (nextIndex === state.levelIndex && attempts < 12) {
      nextIndex = indices[randomInt(0, indices.length - 1)];
      attempts += 1;
    }
    return nextIndex === state.levelIndex ? indices.find((index) => index !== state.levelIndex) ?? nextIndex : nextIndex;
  }

  function playableLevelIndices() {
    const indices = state.levels
      .map((level, index) => ({ level, index }))
      .filter((item) => !item.level.tutorial)
      .map((item) => item.index);
    return indices.length ? indices : state.levels.map((_, index) => index);
  }

  function randomPlayableLevelIndex() {
    const indices = playableLevelIndices();
    return indices[randomInt(0, Math.max(0, indices.length - 1))] ?? 0;
  }

  function scheduleTask(callback, delay) {
    const timer = setTimeout(() => {
      state.pendingTimers.delete(timer);
      callback();
    }, delay);
    state.pendingTimers.add(timer);
    return timer;
  }

  function clearRoundTimers() {
    clearInterval(state.timer);
    state.timer = null;
    clearInterval(state.dialogTimer);
    state.dialogTimer = null;
    clearTimeout(state.guideTimer);
    state.guideTimer = null;
    clearTimeout(showPhaseBanner.timer);
    showPhaseBanner.timer = null;
    clearTimeout(toast.timer);
    toast.timer = null;
    state.pendingTimers.forEach((timer) => clearTimeout(timer));
    state.pendingTimers.clear();
  }

  function hideTransientUi() {
    state.guideAfterClose = null;
    state.phaseAdvancePending = false;
    state.tutorialStep = null;
    document.body.classList.remove("tutorial-active");
    els.guideBubble.classList.remove("show", "urgent", "large");
    els.guideBubble.setAttribute("aria-hidden", "true");
    els.phaseBanner.classList.remove("show");
    els.phaseBanner.setAttribute("aria-hidden", "true");
    els.toast.classList.remove("show");
    document.querySelectorAll(".floating-badge").forEach((badge) => badge.remove());
    closeLastTouchMenu();
    closePedia();
    closeCaptiveMixer();
    closeElaborations();
    closeFamilyLore();
  }

  function leaveActiveRound() {
    clearRoundTimers();
    hideTransientUi();
  }

  function goToMainMenu() {
    leaveActiveRound();
    showScreen("menu");
  }

  function changeRandomOrder() {
    if (!state.levels.length) return;
    if (nextTutorialLevelIndex() !== null) {
      toast("Completa primero los tres pedidos tutorial.");
      initRound(nextTutorialLevelIndex());
      return;
    }
    leaveActiveRound();
    initRound(randomDifferentLevelIndex());
  }

  function shouldStartTutorialRound(index) {
    const tutorialIndex = nextTutorialLevelIndex();
    return tutorialIndex !== null && index === tutorialIndex;
  }

  function tutorialActive() {
    return isTutorialRound();
  }

  function isTutorialRound() {
    return state.roundStartedAsTutorial && Boolean(state.level?.tutorial);
  }

  function tutorialPlan() {
    return isTutorialRound() ? state.level.tutorial : null;
  }

  function tutorialPhasePlan() {
    return tutorialPlan()?.phases?.[state.phaseIndex] || null;
  }

  function tutorialAliquotAmount() {
    return tutorialPlan()?.aliquot || 3;
  }

  function expectedTutorialBubbleId() {
    return state.bubbles.find((bubble) => !bubble.absorbed)?.id ?? null;
  }

  function expectedTutorialNoteId() {
    return tutorialPhasePlan()?.note || null;
  }

  function tutorialStepText(step) {
    const phase = MIX_PHASES[state.phaseIndex];
    const note = expectedTutorialNoteId();
    const label = phase ? `${phase.label} ${state.phaseIndex + 1}/3` : "Paso";
    if (step === "aliquot") return {
      eyebrow: label,
      title: `${tutorialAliquotAmount()} gotas`,
      text: "Toca el selector de alícuota. En estos pedidos tutorial cada fase se cierra con una dosis pequeña."
    };
    if (step === "bubble") return {
      eyebrow: label,
      title: "Toca la burbuja",
      text: "La burbuja encendida es la que vas a llenar. Primero se elige burbuja, luego Massnota."
    };
    if (step === "note") return {
      eyebrow: label,
      title: `Ahora ${note}`,
      text: `Toca ${note}. Solo esa Massnota está permitida en este paso para que veas cómo cambia el acorde.`
    };
    if (step === "present") return {
      eyebrow: "Cierre",
      title: "Presenta el perfume",
      text: "Las tres fases ya están llenas. Toca Presentar para ver el resultado y pasar al siguiente pedido tutorial."
    };
    return null;
  }

  function setTutorialStep(step, options = {}) {
    if (!isTutorialRound()) return;
    state.tutorialStep = step;
    const expectedNote = expectedTutorialNoteId();
    if (expectedNote && ["aliquot", "bubble", "note"].includes(step)) state.selectedNote = expectedNote;
    document.body.classList.toggle("tutorial-active", Boolean(step));
    if (options.silent) return;
    const copy = tutorialStepText(step);
    if (copy) showGuide(copy.eyebrow, copy.title, copy.text, { urgent: step === "aliquot" || step === "present" });
  }

  function tutorialFocusClass(kind, id = null) {
    if (!isTutorialRound()) return "";
    if (state.tutorialStep === kind) {
      if (kind === "bubble" && id !== expectedTutorialBubbleId()) return "";
      if (kind === "note" && id !== expectedTutorialNoteId()) return "";
      return "tutorial-focus";
    }
    return "";
  }

  function blockTutorialAction(kind, id = null) {
    if (!isTutorialRound() || !state.tutorialStep) return false;
    if (kind === "aliquot" && state.tutorialStep === "aliquot") return false;
    if (kind === "bubble" && state.tutorialStep === "bubble" && id === expectedTutorialBubbleId()) return false;
    if (kind === "note" && state.tutorialStep === "note" && id === expectedTutorialNoteId()) return false;
    if (kind === "present" && state.tutorialStep === "present") return false;
    const copy = tutorialStepText(state.tutorialStep);
    toast(copy?.title || "Sigue el paso iluminado.");
    return true;
  }

  function beginTutorialMix() {
    if (!isTutorialRound()) return;
    state.aliquotAmount = tutorialAliquotAmount();
    setTutorialStep("aliquot");
  }

  function advanceTutorialAfterBubble() {
    if (isTutorialRound() && state.tutorialStep === "bubble") {
      setTutorialStep("note");
      renderMix();
    }
  }

  function advanceTutorialAfterDrop() {
    if (isTutorialRound() && state.tutorialStep === "note") setTutorialStep("wait", { silent: true });
  }

  // Guía inicial: bocadillos breves que aparecen mientras juegas, sin abrir menús largos.
  function guideOnce(id, eyebrow, title, text, options = {}) {
    if (!options.force && !tutorialActive()) return;
    if (KM.hasHintSeen(state.save, id)) return;
    KM.markHintSeen(state.save, id);
    showGuide(eyebrow, title, text, options);
  }

  function guideEvent(event) {
    const id = `event-guide-${event.id}`;
    if (KM.hasHintSeen(state.save, id)) return;
    KM.markHintSeen(state.save, id);
    showGuide("Evento", event.message, event.explain || "Algo nuevo acaba de modificar la mezcla.", { force: true });
  }

  function showGuide(eyebrow, title, text, options = {}) {
    clearTimeout(state.guideTimer);
    state.guideAfterClose = typeof options.onClose === "function" ? options.onClose : null;
    els.guideEyebrow.textContent = eyebrow;
    els.guideTitle.textContent = title;
    els.guideText.textContent = text;
    els.guideBubble.classList.toggle("urgent", Boolean(options.urgent));
    els.guideBubble.classList.toggle("large", Boolean(options.large));
    els.guideBubble.classList.add("show");
    els.guideBubble.setAttribute("aria-hidden", "false");
    if (options.autoClose) {
      state.guideTimer = setTimeout(closeGuide, options.autoClose);
    }
  }

  function closeGuide() {
    clearTimeout(state.guideTimer);
    const afterClose = state.guideAfterClose;
    state.guideAfterClose = null;
    els.guideBubble.classList.remove("show", "urgent", "large");
    els.guideBubble.setAttribute("aria-hidden", "true");
    if (afterClose) afterClose();
  }

  function showGameObjectiveTutorial(onDone) {
    if (KM.hasHintSeen(state.save, "tutorial-game-objective")) {
      onDone();
      return;
    }
    KM.startTutorial(state.save);
    KM.markHintSeen(state.save, "tutorial-game-objective");
    showGuide(
      "Tutorial",
      "Cómo se elabora",
      "Completa Fondo, Corazón y Salida dentro del frasco. Primero toca una burbuja y luego toca una Massnota: se añadirá la alícuota elegida. Cada Massnota solo puede entrar una vez en la misma burbuja, así que decide bien. Si te quedas sin gotas aromáticas, el Solvente cierra lo que falte. Puedes sobredosificar, pero a la tercera sobredosis repites el nivel. Refinar resetea las sobredosis una vez por partida. El toque final mejora la composición con ingredientes Cautivos.",
      { urgent: true, large: true, onClose: onDone }
    );
  }

  // Novedades: Perfupedia recibe hallazgos; Mixer recibe materia prima o cautivos listos.
  function markUnread(kind, amount = 1) {
    KM.markUnread(state.save, kind, amount);
    updateNotificationBadges();
  }

  function clearUnread(kind) {
    KM.clearUnread(state.save, kind);
    updateNotificationBadges();
  }

  function updateNotificationBadges() {
    const pedia = state.save.unread?.pedia || 0;
    const captive = state.save.unread?.captive || 0;
    setBadge(els.pediaBtn, pedia);
    setBadge(els.headerPediaBtn, pedia);
    setBadge(els.captiveBtn, captive);
    setBadge(els.headerCaptiveBtn, captive);
  }

  function setBadge(button, count) {
    if (!button) return;
    button.classList.toggle("has-news", count > 0);
    if (count > 0) button.dataset.badge = count > 9 ? "9+" : String(count);
    else delete button.dataset.badge;
  }

  function updateSoundToggle() {
    setAudioToggle(els.musicToggleBtn, KM.musicEnabled?.() ?? true, "MUS", "música");
    setAudioToggle(els.sfxToggleBtn, KM.sfxEnabled?.() ?? true, "FX", "efectos");
  }

  function setAudioToggle(button, enabled, shortLabel, fullLabel) {
    if (!button) return;
    button.innerHTML = `<span>${shortLabel}</span><b>${enabled ? "ON" : "OFF"}</b>`;
    button.classList.toggle("muted", !enabled);
    button.setAttribute("aria-pressed", String(enabled));
    button.setAttribute("aria-label", enabled ? `Desactivar ${fullLabel}` : `Activar ${fullLabel}`);
  }

  function unlockPedia(discovery) {
    const unlocked = KM.unlockDiscovery(state.save, discovery);
    if (unlocked) markUnread("pedia");
    return unlocked;
  }

  function initRound(index) {
    clearRoundTimers();
    hideTransientUi();
    state.levelIndex = index;
    state.level = state.levels[index];
    state.roundStartedAsTutorial = shouldStartTutorialRound(index);
    state.tutorialStep = null;
    state.trend = KM.trendForRound(index);
    state.risk = 0;
    state.overdoseCount = 0;
    state.refined = false;
    state.refinedPhase = null;
    state.lastTouch = false;
    state.lastTouchBoost = null;
    state.phaseIndex = 0;
    state.phaseAdvancePending = false;
    state.phaseCores = [];
    state.selectedBubbleId = null;
    state.aliquotAmount = state.level.tutorial?.aliquot || 5;
    state.captiveSlots = [];
    state.eventsSeen = new Set();
    resetRoundStock();
    state.phaseBubbles = buildRoundPhases(state.level);
    state.bubbles = state.phaseBubbles[state.phaseIndex];
    state.selectedBubbleId = state.bubbles.find((bubble) => !bubble.absorbed)?.id ?? null;
    state.solventBubbleIds = allBubbles().filter((bubble) => bubble.solventRequired).map((bubble) => bubble.id);
    state.selectedNote = tutorialPhasePlan()?.note || roundNotePool().find((id) => id !== "Maggic") || roundNotePool()[0];
    state.memory = null;
    state.lastPerfume = null;
    renderHeader("Pedido nuevo");
    renderIntro();
    renderAliquots();
    renderMix();
    showScreen("intro");
  }

  function resetRoundStock() {
    state.stock = Object.fromEntries(KM.notes.map((note) => [note.id, 0]));
    roundNotePool(state.level).forEach((id) => {
      state.stock[id] = 0;
    });
  }

  function roundNotePool(level = state.level) {
    const pool = [
      ...(level?.poolNotas || []),
      ...tutorialNoteIds(level)
    ];
    return pool.filter((id, index, list) => id && list.indexOf(id) === index);
  }

  function tutorialNoteIds(level = state.level) {
    return (level?.tutorial?.phases || []).map((phase) => phase.note).filter(Boolean);
  }

  // Ronda por capas: cada perfume se construye en Fondo, Corazón y Salida.
  // Cada fase genera un número aleatorio de burbujas ocultas para evitar recetas mecánicas.
  function buildRoundPhases(level) {
    if (level.tutorial?.phases?.length) return buildTutorialPhases(level);
    let id = 0;
    const familyPool = shuffle(level.bubbles.map((bubble) => bubble.targetFamily));
    return MIX_PHASES.map((phase, phaseIndex) => {
      const config = phaseBubbleConfig(phase.id);
      const count = randomInt(config.min, config.max);
      const caps = randomizePhaseCaps(count, randomInt(config.totalMin, config.totalMax), config.capMin);
      const sizes = caps.map((cap) => clamp(6.4 + cap * 0.54, config.sizeMin, config.sizeMax));
      const positions = clusterBubblePositions(sizes, phaseIndex);
      const families = Array.from({ length: count }, (_, index) => familyPool[(index + phaseIndex * 2) % familyPool.length] || "floral");
      return buildPhaseBubbles({ phase, phaseIndex, caps, sizes, positions, families, firstId: id }).map((bubble) => {
        id += 1;
        return bubble;
      });
    });
  }

  function buildTutorialPhases(level) {
    const cap = level.tutorial.aliquot || 3;
    const positions = [
      { x: 41, y: 68 },
      { x: 41, y: 50 },
      { x: 41, y: 30 }
    ];
    return MIX_PHASES.map((phase, phaseIndex) => {
      const plan = level.tutorial.phases[phaseIndex] || {};
      const note = KM.noteById[plan.note];
      const position = positions[phaseIndex] || positions[1];
      return [{
        id: phaseIndex,
        phaseId: phase.id,
        phaseIndex,
        cap: plan.capUnits || cap,
        size: plan.size || 18,
        x: plan.x ?? position.x,
        y: plan.y ?? position.y,
        glow: hexToRgba(note?.color || "#f4ad41", .32),
        float: "9.2s",
        phase: `${(-phaseIndex * .6).toFixed(1)}s`,
        targetFamily: plan.family || note?.family || "floral",
        solventRequired: false,
        chunks: [],
        rewarded: false,
        absorbed: false,
        overdosed: false,
        diluted: false,
        synergyId: null
      }];
    });
  }

  function phaseBubbleConfig(phaseId) {
    const configs = {
      fondo: { min: 7, max: 10, totalMin: 58, totalMax: 86, capMin: 4, sizeMin: 8.8, sizeMax: 13.4 },
      corazon: { min: 7, max: 10, totalMin: 54, totalMax: 80, capMin: 4, sizeMin: 9.0, sizeMax: 13.8 },
      salida: { min: 5, max: 10, totalMin: 38, totalMax: 66, capMin: 4, sizeMin: 9.4, sizeMax: 14.4 }
    };
    return configs[phaseId] || configs.fondo;
  }

  function buildPhaseBubbles({ phase, phaseIndex, caps, sizes, positions, families, firstId }) {
    const glows = shuffle([
      "rgba(244, 93, 143, .28)",
      "rgba(66, 190, 167, .30)",
      "rgba(85, 174, 230, .28)",
      "rgba(244, 173, 65, .30)",
      "rgba(114, 191, 105, .26)",
      "rgba(245, 95, 145, .24)",
      "rgba(91, 131, 215, .26)"
    ]);

    return shuffle(Array.from({ length: caps.length }, (_, index) => {
      const cap = caps[index];
      const size = sizes[index];
      const pos = positions[index];
      const targetFamily = families[index % families.length];
      return {
        id: firstId + index,
        phaseId: phase.id,
        phaseIndex,
        cap,
        size,
        x: pos.x,
        y: pos.y,
        glow: glows[index % glows.length],
        float: `${(8.5 + index * 0.9 + Math.random() * 2.8).toFixed(1)}s`,
        phase: `${(-index * 0.7).toFixed(1)}s`,
        targetFamily,
        solventRequired: targetFamily === "solvent",
        chunks: [],
        rewarded: false,
        absorbed: false,
        overdosed: false,
        diluted: false,
        synergyId: null
      };
    }));
  }

  function clusterBubblePositions(sizes, phaseIndex = 1) {
    const count = sizes.length;
    const bands = [
      { cy: 73, minY: 56, maxY: 88, rx: 31, ry: 15 },
      { cy: 52, minY: 35, maxY: 68, rx: 30, ry: 14 },
      { cy: 31, minY: 12, maxY: 46, rx: 28, ry: 13 }
    ];
    const band = bands[phaseIndex] || bands[1];
    const golden = Math.PI * (3 - Math.sqrt(5));
    const seed = Array.from({ length: count }, (_, index) => {
      const radius = Math.sqrt((index + 0.5) / Math.max(1, count));
      const angle = index * golden - Math.PI / 2;
      return [
        50 + Math.cos(angle) * radius * band.rx,
        band.cy + Math.sin(angle) * radius * band.ry
      ];
    });
    const nodes = seed.map(([x, y], index) => ({ x, y, size: sizes[index] }));

    for (let pass = 0; pass < 240; pass += 1) {
      for (let a = 0; a < nodes.length; a += 1) {
        for (let b = a + 1; b < nodes.length; b += 1) {
          const left = nodes[a];
          const right = nodes[b];
          const dx = right.x - left.x;
          const dy = right.y - left.y;
          const dist = Math.max(0.01, Math.hypot(dx, dy));
          const minDist = (left.size + right.size) / 2 + 0.12;
          if (dist < minDist) {
            const push = (minDist - dist) / 2;
            const nx = dx / dist;
            const ny = dy / dist;
            left.x -= nx * push;
            left.y -= ny * push;
            right.x += nx * push;
            right.y += ny * push;
          }
        }
      }
      nodes.forEach((node) => {
        const pad = node.size / 2 + 1.4;
        node.x = clamp(node.x, 17 + pad, 83 - pad);
        node.y = clamp(node.y, band.minY + pad, band.maxY - pad);
      });
    }

    const avgX = nodes.reduce((sum, node) => sum + node.x, 0) / nodes.length;
    const avgY = nodes.reduce((sum, node) => sum + node.y, 0) / nodes.length;
    const moveX = 50 - avgX;
    const moveY = band.cy - avgY;
    return nodes.map((node) => {
      const pad = node.size / 2 + 1.4;
      const x = clamp(node.x + moveX, 17 + pad, 83 - pad);
      const y = clamp(node.y + moveY, band.minY + pad, band.maxY - pad);
      return { x: Math.round((x - node.size / 2) * 10) / 10, y: Math.round((y - node.size / 2) * 10) / 10 };
    });
  }

  function randomizePhaseCaps(count, targetTotal, minCap = 4) {
    const raw = Array.from({ length: count }, () => randomInt(minCap, minCap + 7));
    const rawTotal = raw.reduce((sum, cap) => sum + cap, 0);
    const caps = raw.map((cap) => Math.max(minCap, Math.round((cap / rawTotal) * targetTotal)));
    let diff = targetTotal - caps.reduce((sum, cap) => sum + cap, 0);
    let cursor = 0;
    while (diff !== 0 && cursor < 200) {
      const index = cursor % caps.length;
      if (diff > 0) {
        caps[index] += 1;
        diff -= 1;
      } else if (caps[index] > minCap) {
        caps[index] -= 1;
        diff += 1;
      }
      cursor += 1;
    }
    return caps;
  }

  function showScreen(name) {
    document.querySelectorAll(".screen").forEach((screen) => screen.classList.remove("active"));
    $(`${name}Screen`).classList.add("active");
    document.body.className = document.body.className
      .split(" ")
      .filter((token) => token && !token.startsWith("screen-"))
      .concat(`screen-${name}`)
      .join(" ");
    const labels = { home: "Overlord", menu: "Overlord", intro: "Pedido nuevo", memory: "Memory", mix: currentPhase().label, result: "Resultado" };
    renderHeader(labels[name] || "Kawaii Mixer");
    updateNotificationBadges();
  }

  function renderHeader(phase) {
    els.phaseLabel.textContent = phase;
    els.orderTitle.textContent = state.level?.title || "Kawaii Mixer Game";
    els.orderClient.textContent = state.level ? state.level.client : "Mezcla adorable";
    const tutorialLocked = nextTutorialLevelIndex() !== null;
    els.randomOrderBtn.disabled = tutorialLocked;
    els.randomOrderBtn.title = tutorialLocked ? "Disponible después del tutorial" : "Cambiar pedido";
  }

  function renderIntro() {
    els.introTitle.textContent = state.level.title;
    renderClientPortrait();
    typeClientDialog(state.level.emotion?.wish || state.level.desc);
    els.emotionBrief.textContent = state.trend.label;
    els.introTags.innerHTML = [...state.level.personality, ...(state.level.emotion?.wants || []).slice(0, 2)]
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");
  }

  function renderClientPortrait() {
    const file = state.level.clientImage || CLIENT_IMAGE_BY_LEVEL[state.level.id] || "C-CLARA.png";
    els.clientPortraitImg.src = KM.asset(file);
    els.clientPortraitImg.alt = state.level.client || "";
  }

  function typeClientDialog(text) {
    clearInterval(state.dialogTimer);
    els.startMemoryBtn.classList.remove("ready");
    els.startMemoryBtn.disabled = true;
    els.introDesc.textContent = "";
    let index = 0;
    state.dialogTimer = setInterval(() => {
      els.introDesc.textContent = text.slice(0, index);
      index += 1;
      if (index > text.length) {
        clearInterval(state.dialogTimer);
        els.startMemoryBtn.disabled = false;
        els.startMemoryBtn.classList.add("ready");
        guideOnce(
          "tutorial-intro-order",
          "Primer pedido",
          "Lee la emoción",
          "No buscas una receta exacta: interpreta lo que quiere la clienta y piensa en sensaciones."
        );
      }
    }, 24);
  }

  function startMemory(options = {}) {
    if (!options.skipObjective && isTutorialRound()) {
      KM.startTutorial(state.save);
      const step = (state.save.tutorial?.levelIndex || 0) + 1;
      const notes = (state.level.tutorial?.phases || []).map((phase) => phase.note).join(", ");
      showGuide(
        `Tutorial ${step}/3`,
        "Memory fácil",
        `Encuentra las parejas de ${notes}. Cada pareja da exactamente las gotas que usarás después.`,
        { urgent: true, onClose: () => startMemory({ skipObjective: true }) }
      );
      return;
    }
    resetRoundStock();
    const tutorialNotes = isTutorialRound() ? tutorialNoteIds() : null;
    const notePool = tutorialNotes?.length ? tutorialNotes : roundNotePool().filter((id) => id !== "Maggic");
    const pairCount = Math.min(state.level.memory.pairs, notePool.length);
    const ids = tutorialNotes?.length ? notePool.slice(0, pairCount) : shuffle(notePool).slice(0, pairCount);
    state.memory = {
      deck: shuffle([...ids, ...ids]).map((id, index) => ({ uid: `${id}-${index}`, id, open: false, done: false })),
      open: [],
      lock: false,
      pairs: 0,
      streak: 0,
      drops: 0,
      time: state.level.memory.time,
      maxTime: state.level.memory.time
    };
    showScreen("memory");
    renderMemory();
    clearInterval(state.timer);
    state.timer = setInterval(tickMemory, 1000);
    guideOnce(
      "tutorial-memory-start",
      "Memory",
      "Gana gotitas",
      "Encuentra parejas. Cada pareja te da Massnotas para mezclar en el frasco."
    );
  }

  function tickMemory() {
    if (!state.memory) return;
    state.memory.time = Math.max(0, state.memory.time - 1);
    renderMemoryStats();
    if (state.memory.time <= 0) {
      clearInterval(state.timer);
      toast("Memory terminado. Hora de mezclar.");
      scheduleTask(goMix, 400);
    }
  }

  function renderMemory() {
    els.memoryBoard.innerHTML = state.memory.deck.map((card) => {
      const visible = card.open || card.done;
      const note = KM.noteById[card.id];
      return `
        <button class="memory-card ${visible ? "open" : ""} ${card.done ? "done" : ""}" data-card="${card.uid}" type="button">
          <span class="memory-face memory-back"><img class="memory-back-img" src="${KM.asset("memory.png")}" alt=""></span>
          <span class="memory-face memory-front"><img src="${KM.asset(note.logo)}" alt="${note.id}"></span>
        </button>
      `;
    }).join("");
    renderMemoryStats();
  }

  function renderMemoryStats() {
    if (!state.memory) return;
    const totalPairs = state.memory.deck.length / 2;
    els.pairsStat.textContent = `${state.memory.pairs}/${totalPairs}`;
    els.streakStat.textContent = `x${state.memory.streak}`;
    els.timerStat.textContent = `${state.memory.time}s`;
    els.dropsStat.textContent = state.memory.drops;
    els.timerFill.style.transform = `scaleX(${state.memory.time / state.memory.maxTime})`;
  }

  function pulseMemoryMatch(firstUid, secondUid) {
    KM.playSfx?.("match", { volume: 0.58, rate: 1.08 });
    [firstUid, secondUid].forEach((uid) => {
      const card = els.memoryBoard.querySelector(`[data-card="${uid}"]`);
      card?.classList.add("match-burst");
      if (card) popParticles(card, KM.noteById[state.memory.deck.find((item) => item.uid === uid)?.id]?.color || "#f4ad41", "magic");
    });
    showFloatingBadge(els.memoryBoard, "pareja");
  }

  function onMemoryClick(event) {
    const cardButton = event.target.closest("[data-card]");
    if (!cardButton || !state.memory || state.memory.lock) return;
    const card = state.memory.deck.find((item) => item.uid === cardButton.dataset.card);
    if (!card || card.open || card.done) return;
    KM.playSfx?.("card", { volume: 0.44, rate: 0.96 + Math.random() * 0.08 });

    card.open = true;
    state.memory.open.push(card.uid);
    renderMemory();

    if (state.memory.open.length !== 2) return;
    state.memory.lock = true;
    const [first, second] = state.memory.open.map((uid) => state.memory.deck.find((item) => item.uid === uid));
    if (first.id === second.id) {
      pulseMemoryMatch(first.uid, second.uid);
      scheduleTask(() => {
        first.done = true;
        second.done = true;
        state.memory.open = [];
        state.memory.lock = false;
        state.memory.pairs += 1;
        state.memory.streak += 1;
        rewardMemory(first.id, cardButton);
        if (state.memory.deck.every((item) => item.done)) {
          toast("Tablero completo. Vamos al frasco.");
          scheduleTask(goMix, 650);
        } else {
          renderMemory();
        }
      }, 260);
    } else {
      KM.playSfx?.("miss", { volume: 0.34, rate: 0.86 });
      scheduleTask(() => {
        first.open = false;
        second.open = false;
        state.memory.open = [];
        state.memory.lock = false;
        state.memory.streak = 0;
        renderMemory();
      }, 560);
    }
  }

  function rebuildMemoryDeck() {
    const notePool = roundNotePool().filter((id) => id !== "Maggic");
    const pairCount = Math.min(state.level.memory.pairs, notePool.length);
    const ids = shuffle(notePool).slice(0, pairCount);
    state.memory.deck = shuffle([...ids, ...ids]).map((id, index) => ({ uid: `${id}-${Date.now()}-${index}`, id, open: false, done: false }));
    renderMemory();
  }

  function rewardMemory(noteId, sourceEl) {
    const tutorial = isTutorialRound();
    const fastBonus = tutorial ? 0 : state.memory.time > state.memory.maxTime * 0.5 ? 5 : 0;
    const streakBonus = tutorial ? 0 : Math.min(8, state.memory.streak * 2);
    const amount = tutorial ? tutorialAliquotAmount() : state.level.memory.coinBase + fastBonus + streakBonus;
    state.stock[noteId] += amount;
    state.memory.drops += amount;
    if (!tutorial && state.memory.streak > 0 && state.memory.streak % 3 === 0) {
      state.stock.Maggic += 5;
      toast(`Racha ${state.memory.streak}: Maggic entra en la mezcla.`);
    } else {
      toast(`+${amount} ${noteId}`);
    }
    popParticles(sourceEl, KM.noteById[noteId].color, KM.noteById[noteId].family);
    renderMemoryStats();
    renderMix();
    guideOnce(
      "tutorial-memory-match",
      "Pareja",
      "Reserva aromática",
      "Las gotitas ganadas aparecen luego alrededor del frasco. Si haces racha, Maggic puede entrar."
    );
  }

  function goMix() {
    clearInterval(state.timer);
    selectFirstAvailableNote();
    renderMix();
    showScreen("mix");
    KM.playSfx?.("phase", { volume: 0.36, rate: 1 });
    showPhaseBanner("Primera fase", currentPhase().label);
    if (isTutorialRound()) {
      beginTutorialMix();
      return;
    }
    guideOnce(
      "tutorial-mix-start",
      "Mezcla",
      "Toca y añade",
      "Elige gotas con el deslizador, toca una burbuja del frasco y después toca la Massnota que quieras verter. No sabes cuál es perfecta: observa y experimenta."
    );
  }

  function selectFirstAvailableNote() {
    const earned = roundNotePool().find((id) => id !== "Maggic" && (state.stock[id] || 0) > 0);
    state.selectedNote = earned || "Solvente";
  }

  function renderMix() {
    ensureSelectedBubble();
    renderPhaseHud();
    renderBubbles();
    renderPhaseCores();
    renderAliquots();
    renderTray();
    renderTraits();
    updatePhaseActions();
  }

  function renderPhaseHud() {
    const phase = currentPhase();
    els.mixPhaseEyebrow.textContent = `Fase ${state.phaseIndex + 1}/3`;
    els.mixTitle.textContent = phase.label;
    renderHeader(phase.label);
  }

  function renderBubbles() {
    const resolvedMagic = KM.bestNoteForTarget(state.level, state.stock);
    const visibleBubbles = state.bubbles.filter((bubble) => !bubble.absorbed);
    els.bubbleChart.innerHTML = visibleBubbles.map((bubble) => {
      const filled = bubbleFilled(bubble);
      const progress = Math.min(100, Math.round((filled / bubble.cap) * 100));
      const overdosed = filled > bubble.cap;
      const size = bubble.size;
      const color = KM.colorForChunks(bubble.chunks, resolvedMagic);
      const glow = "rgba(245, 224, 184, .30)";
      const selected = bubble.id === state.selectedBubbleId;
      const synergy = bubble.synergyId ? `synergy-${bubble.synergyId}` : "";
      const focus = tutorialFocusClass("bubble", bubble.id);
      const tutorialMuted = isTutorialRound() && state.tutorialStep && !focus;
      return `
        <button class="mix-bubble ${filled === 0 ? "empty" : ""} ${selected ? "selected" : ""} ${filled >= bubble.cap ? "complete" : ""} ${overdosed ? "overdosed" : ""} ${synergy} ${focus} ${tutorialMuted ? "tutorial-muted" : ""} ${state.phaseAdvancePending ? "merge-out" : ""}" data-bubble="${bubble.id}" type="button"
          aria-pressed="${selected ? "true" : "false"}"
          style="width:${size}%;left:${bubble.x}%;top:${bubble.y}%;--glow:${glow};--float:${bubble.float};--phase:${bubble.phase}">
          <span class="bubble-liquid" style="height:${progress}%;background:linear-gradient(180deg, rgba(255,255,255,.18), ${color})"></span>
          <span class="bubble-label" aria-hidden="true"></span>
        </button>
      `;
    }).join("");
    const filledCount = state.bubbles.filter((bubble) => bubbleFilled(bubble) >= bubble.cap).length;
    els.filledBadge.textContent = `${currentPhase().label} ${filledCount}/${state.bubbles.length} · sobre ${state.overdoseCount}/3`;
  }

  function renderPhaseCores() {
    if (!els.phaseCoreLayer) return;
    const layers = MIX_PHASES.map((phase, index) => {
      const core = state.phaseCores[index];
      const active = index === state.phaseIndex && !core;
      const activeFill = active ? `${(phaseProgress(index) * 33.34).toFixed(1)}%` : "0%";
      return `
        <span class="phase-bottle-fill ${core ? "filled" : ""} ${active ? "active" : ""}" style="--layer-color:${active ? phaseLiveColor(index) : core?.color || "rgba(255,255,255,.34)"};--active-fill:${activeFill}">
          <b>${phase.label}</b>
        </span>
      `;
    }).reverse().join("");
    const labels = MIX_PHASES.map((phase, index) => `
      <span class="${state.phaseCores[index] ? "done" : index === state.phaseIndex ? "active" : ""}">${phase.label}</span>
    `).join("");
    els.phaseCoreLayer.innerHTML = `
      <div class="phase-progress-bottle">
        <span class="phase-bottle-cap"></span>
        <span class="phase-bottle-neck"></span>
        <div class="phase-bottle-body">${layers}</div>
      </div>
      <div class="phase-progress-labels">${labels}</div>
    `;
  }

  function phaseProgress(phaseIndex) {
    const bubbles = state.phaseBubbles[phaseIndex] || [];
    if (!bubbles.length) return 0;
    return bubbles.filter((bubble) => bubbleFilled(bubble) >= bubble.cap).length / bubbles.length;
  }

  function phaseLiveColor(phaseIndex) {
    const chunks = (state.phaseBubbles[phaseIndex] || []).flatMap((bubble) => bubble.chunks);
    if (!chunks.length) return "rgba(255,255,255,.34)";
    return KM.colorForChunks(chunks, KM.bestNoteForTarget(state.level, state.stock));
  }

  function renderAliquots() {
    const aliquot = selectedAliquot();
    const fill = ((aliquot.amount - ALIQUOT_MIN) / (ALIQUOT_MAX - ALIQUOT_MIN)) * 100;
    const ticks = Array.from({ length: ALIQUOT_MAX - ALIQUOT_MIN + 1 }, (_, index) => {
      const value = ALIQUOT_MIN + index;
      return `<span class="${[1, 5, 10, 15].includes(value) ? "major" : ""}"></span>`;
    }).join("");
    els.aliquotRow.innerHTML = `
      <div class="aliquot-control-row ${tutorialFocusClass("aliquot")}">
        <button class="aliquot-step" type="button" data-aliquot-step="-1" aria-label="Bajar alícuota" ${aliquot.amount <= ALIQUOT_MIN ? "disabled" : ""}>-</button>
        <div class="aliquot-slider-wrap">
          <input id="aliquotSlider" class="aliquot-slider" type="range" min="${ALIQUOT_MIN}" max="${ALIQUOT_MAX}" value="${aliquot.amount}" step="1" aria-label="Gotas de alícuota">
          <div class="aliquot-ticks" aria-hidden="true">${ticks}</div>
          <strong class="aliquot-value" id="aliquotValue">${aliquot.amount}</strong>
        </div>
        <button class="aliquot-step" type="button" data-aliquot-step="1" aria-label="Subir alícuota" ${aliquot.amount >= ALIQUOT_MAX ? "disabled" : ""}>+</button>
      </div>
    `;
    els.aliquotRow.style.setProperty("--fill", `${fill}%`);
    updateAliquotReadout();
  }

  function updateAliquotReadout() {
    const note = KM.noteById[state.selectedNote];
    const aliquot = selectedAliquot();
    const bubble = selectedBubble();
    const fill = ((aliquot.amount - ALIQUOT_MIN) / (ALIQUOT_MAX - ALIQUOT_MIN)) * 100;
    const bubbleText = bubble ? "burbuja elegida" : "toca una burbuja";
    els.selectedNoteLabel.textContent = note ? `${bubbleText} · ${note.id}` : bubbleText;
    els.aliquotRow.style.setProperty("--fill", `${fill}%`);
    const value = document.getElementById("aliquotValue");
    if (value) {
      value.textContent = aliquot.amount;
      value.style.left = `${fill}%`;
    }
    const slider = document.getElementById("aliquotSlider");
    if (slider) slider.value = aliquot.amount;
  }

  function onAliquotStepClick(event) {
    if (isTutorialRound() && state.tutorialStep === "aliquot" && event.target.closest(".aliquot-control-row")) {
      state.aliquotAmount = tutorialAliquotAmount();
      setTutorialStep("bubble");
      renderMix();
      KM.playSfx?.("card", { volume: 0.22, rate: 1.04, cooldown: 70 });
      return;
    }
    const button = event.target.closest("[data-aliquot-step]");
    if (!button) return;
    const direction = Number(button.dataset.aliquotStep);
    setAliquotAmount((state.aliquotAmount || 5) + direction);
    KM.playSfx?.("card", { volume: 0.2, rate: direction > 0 ? 1.08 : 0.94, cooldown: 70 });
  }

  function setAliquotAmount(value) {
    state.aliquotAmount = clamp(Math.round(value), ALIQUOT_MIN, ALIQUOT_MAX);
    updateAliquotReadout();
  }

  function renderTray() {
    const ids = trayNoteIds();
    if (!ids.includes(state.selectedNote)) state.selectedNote = ids.find((id) => id !== "Solvente") || "Solvente";
    const max = Math.max(20, ...ids.map((id) => KM.noteById[id]?.unlimited ? 0 : (state.stock[id] || 0)));
    const usage = resolvedUsage();
    els.noteTray.innerHTML = ids.map((id, index) => {
      const note = KM.noteById[id];
      const amount = state.stock[id] || 0;
      const unlimited = note.unlimited;
      const fill = unlimited ? 100 : clamp(Math.round((amount / max) * 100), 0, 100);
      const grow = 1 + Math.min(0.34, ((usage[id] || 0) / 90));
      const pos = noteOrbitPosition(index, ids.length);
      const glow = hexToRgba(note.color, .34);
      const ring = hexToRgba(note.color, .42);
      const liquid = hexToRgba(note.color, .78);
      const label = hexToRgba(note.color, .88);
      const focus = tutorialFocusClass("note", id);
      const tutorialMuted = isTutorialRound() && state.tutorialStep && !focus;
      return `
        <button class="note-card ${state.selectedNote === id ? "active" : ""} ${unlimited ? "unlimited" : ""} ${focus} ${tutorialMuted ? "tutorial-muted" : ""}" data-note="${id}" type="button"
          aria-label="${note.id}: ${unlimited ? "infinito" : `${amount} gotitas`}" ${!unlimited && amount <= 0 ? "disabled" : ""}
          style="--note-color:${note.color};--note-glow:${glow};--note-ring:${ring};--note-liquid-color:${liquid};--note-fill:${fill}%;--note-x:${pos.x}%;--note-y:${pos.y}%;--note-float:${(7.5 + index * .7).toFixed(1)}s;--note-phase:${(-index * .35).toFixed(2)}s">
          <span class="note-orb" aria-hidden="true">
            <span class="note-liquid"></span>
            <img src="${KM.asset(note.logo)}" alt="" style="transform:scale(${grow})">
          </span>
          <span class="note-count">${unlimited ? "∞" : amount}</span>
        </button>
      `;
    }).join("");
  }

  function noteOrbitPosition(index, total) {
    const presets = {
      6: [[14, 23], [50, 9], [86, 23], [91, 78], [50, 94], [9, 78]],
      7: [[14, 23], [50, 9], [86, 23], [94, 50], [82, 86], [50, 94], [18, 86]],
      8: [[10, 24], [38, 9], [62, 9], [89, 27], [94, 62], [78, 91], [31, 94], [6, 67]]
    };
    if (presets[total]?.[index]) {
      const [x, y] = presets[total][index];
      return { x, y };
    }
    const angle = (-160 + (360 / Math.max(1, total)) * index) * Math.PI / 180;
    return {
      x: Number(clamp(50 + Math.cos(angle) * 44, 6, 94).toFixed(1)),
      y: Number(clamp(50 + Math.sin(angle) * 44, 8, 94).toFixed(1))
    };
  }

  function hexToRgba(hex, alpha) {
    const clean = String(hex || "").replace("#", "");
    const expanded = clean.length === 3 ? clean.split("").map((char) => char + char).join("") : clean;
    if (!/^[0-9a-f]{6}$/i.test(expanded)) return `rgba(66, 190, 167, ${alpha})`;
    const value = Number.parseInt(expanded, 16);
    return `rgba(${(value >> 16) & 255}, ${(value >> 8) & 255}, ${value & 255}, ${alpha})`;
  }

  function trayNoteIds() {
    return [...roundNotePool(), "Solvente"]
      .filter((id, index, list) => list.indexOf(id) === index)
      .filter((id) => id === "Solvente" || (state.stock[id] || 0) > 0);
  }

  function renderTraits() {
    const traits = currentTraits();
    const profile = currentProfile(traits);
    const interesting = Object.keys(KM.traitLabels).filter((key) => state.level.target[key] || traits[key] > 0.35);
    const dominant = interesting.sort((a, b) => (traits[b] || 0) - (traits[a] || 0))[0];
    els.dominantBadge.textContent = dominant ? KM.traitLabels[dominant] : "sin notas";
    els.auraBadge.textContent = profile.auraText;
    els.riskBadge.textContent = profile.riskLabel;
    els.traitList.innerHTML = interesting.map((key) => {
      const current = Math.min(10, traits[key] || 0);
      const target = Math.min(10, state.level.target[key] || 0);
      return `
        <div class="trait-row">
          <span>${KM.traitLabels[key]}</span>
          <span class="trait-track"><i style="width:${current * 10}%"></i><b style="left:calc(${target * 10}% - 1px)"></b></span>
          <span>${current.toFixed(1)}</span>
        </div>
      `;
    }).join("");
  }

  function currentProfile(traits = currentTraits()) {
    return KM.buildPerfumeProfile({
      level: state.level,
      traits,
      usage: resolvedUsage(),
      bubbles: allBubbles(),
      risk: state.risk,
      refined: false,
      lastTouch: state.lastTouch,
      trend: state.trend
    });
  }

  function onBubbleClick(event) {
    const target = event.target.closest("[data-bubble]");
    if (!target || state.phaseAdvancePending) return;
    const bubbleId = Number(target.dataset.bubble);
    if (blockTutorialAction("bubble", bubbleId)) return;
    if (selectBubble(bubbleId, true)) advanceTutorialAfterBubble();
  }

  function onNoteClick(event) {
    const card = event.target.closest("[data-note]");
    if (!card || card.disabled || state.phaseAdvancePending) return;
    const noteId = card.dataset.note;
    if (blockTutorialAction("note", noteId)) return;
    const note = KM.noteById[noteId];
    const stock = state.stock[noteId] || 0;
    if (!note?.unlimited && stock <= 0) {
      toast("No queda materia de esa nota.");
      return;
    }
    const bubble = selectedBubble();
    if (!bubble) {
      toast("Toca primero una burbuja del frasco.");
      return;
    }
    state.selectedNote = noteId;
    const aliquot = selectedAliquot();
    const amount = Math.min(note.unlimited ? aliquot.amount : stock, aliquot.amount);
    if (amount <= 0) {
      toast("No queda materia para esa alícuota.");
      return;
    }
    KM.playSfx?.(noteId === "Solvente" ? "card" : "tap", { volume: 0.3, rate: noteId === "Solvente" ? 0.85 : 1.05 });
    advanceTutorialAfterDrop();
    assignToBubble(bubble.id, noteId, amount, {
      targetEl: document.querySelector(`[data-bubble="${bubble.id}"]`),
      completedByMaggic: noteId === "Maggic"
    });
    renderAliquots();
  }

  function selectBubble(bubbleId, announce = false) {
    const bubble = state.bubbles.find((item) => item.id === bubbleId && !item.absorbed);
    if (!bubble) return false;
    state.selectedBubbleId = bubble.id;
    KM.playSfx?.("card", { volume: 0.22, rate: 1.08, cooldown: 80 });
    if (announce) toast("Burbuja preparada.");
    renderBubbles();
    renderAliquots();
    return true;
  }

  function ensureSelectedBubble() {
    if (selectedBubble()) return;
    state.selectedBubbleId = state.bubbles.find((bubble) => !bubble.absorbed)?.id ?? null;
  }

  function selectedBubble() {
    return state.bubbles.find((bubble) => bubble.id === state.selectedBubbleId && !bubble.absorbed) || null;
  }

  function assignToBubble(bubbleId, noteId, amount, options = {}) {
    const bubble = state.bubbles.find((item) => item.id === bubbleId);
    if (!bubble) return false;
    const before = bubbleFilled(bubble);
    if (bubble.absorbed || before >= bubble.cap) {
      toast("Esa burbuja ya subió al frasco.");
      return false;
    }
    const available = noteId === "Solvente" || options.freeStock ? amount : (state.stock[noteId] || 0);
    const real = Math.max(0, Math.min(available, amount));
    if (real <= 0) {
      toast("No queda suficiente materia.");
      return false;
    }
    if (!options.ignoreDuplicateRules && noteId !== "Solvente" && bubble.chunks.some((chunk) => chunk.id === noteId)) {
      toast("Esa Massnota ya perfumó esta burbuja.");
      return false;
    }
    const hadBlend = bubble.chunks.length > 0;
    if (noteId !== "Solvente" && !options.freeStock) {
      if ((state.stock[noteId] || 0) < real) {
        toast("No queda suficiente materia.");
        return false;
      }
      state.stock[noteId] -= real;
    }
    KM.playSfx?.("drop", { volume: 0.44, rate: 0.92 + Math.min(real, 10) * 0.018 });
    bubble.chunks.push({ id: noteId, amount: real });
    guideOnce(
      "tutorial-first-drop",
      "Gota",
      "Llena sin pasarte",
      "Cada toque vierte la alícuota elegida en la burbuja seleccionada. Puedes pasarte, pero tres sobredosis reinician la ronda."
    );
    const after = bubbleFilled(bubble);
    const justOverdosed = before <= bubble.cap && after > bubble.cap;
    if (justOverdosed) {
      bubble.overdosed = true;
      state.overdoseCount += 1;
      state.risk += 7;
    }
    // Sistema de riesgo + pasivas: cada gota cambia suavemente la estabilidad de la mezcla.
    const passive = KM.passiveImpact(noteId, {
      amount: real,
      bubble,
      level: state.level,
      solvent: totalSolvent(),
      currentRisk: state.risk
    });
    const aliquotRisk = noteId === "Solvente" ? -1 : real >= 20 ? 4 : real >= 15 ? 2 : 0;
    state.risk = Math.max(0, state.risk + aliquotRisk + (passive.riskDelta || 0));
    const hasSolvent = bubble.chunks.some((chunk) => chunk.id === "Solvente");
    const hasMascot = bubble.chunks.some((chunk) => chunk.id !== "Solvente");
    if (hasSolvent && hasMascot) {
      bubble.diluted = true;
      state.risk = Math.max(0, state.risk - 1);
    }
    if (passive.message) toast(passive.message);
    runDynamicEvent(noteId);
    renderMix();
    const el = document.querySelector(`[data-bubble="${bubble.id}"]`) || options.targetEl;
    pulseElement(el, "drop-bloom", 520);
    if (hadBlend || bubble.chunks.length > 1) {
      KM.playSfx?.("mix", { volume: 0.36, rate: hasSolvent && hasMascot ? 0.9 : 1.03, cooldown: 130 });
      pulseElement(el, "mix-swirling", 860);
      showFloatingBadge(el, hasSolvent && hasMascot ? "rebajada" : "mezcla");
    }
    if (justOverdosed) {
      KM.playSfx?.("miss", { volume: 0.5, rate: 0.72 });
      pulseElement(el, "overdose-flash", 900);
      showFloatingBadge(el, "sobredosis");
      toast(`Burbuja sobredosificada ${state.overdoseCount}/3.`);
      if (state.overdoseCount >= 3) {
        resetRoundDueToOverdose();
        return true;
      }
    }
    const note = KM.noteById[noteId] || { color: "#cfeef6", family: "solvent" };
    if (note.family && note.family === bubble.targetFamily) {
      KM.playSfx?.("synergy", { volume: 0.5, rate: 1.18, cooldown: 160 });
      pulseElement(el, "synergy-burst", 760);
      showFloatingBadge(el, "acorde");
    }
    popParticles(el, note.color, note.family);
    const discovery = before < bubble.cap && after >= bubble.cap
      ? completeBubble(bubble, options.completedByMaggic || noteId === "Maggic", el, { autoSolvent: options.autoSolvent })
      : null;
    if (discovery) scheduleTask(checkPhaseCompletion, 760);
    else checkPhaseCompletion();
    if (!options.autoSolvent) autoFillWithSolventIfOutOfMassnotas();
    return true;
  }

  function autoFillWithSolventIfOutOfMassnotas() {
    if (state.phaseAdvancePending || hasUsableMassnotaForPendingBubbles()) return;
    const pending = state.bubbles.filter((bubble) => !bubble.absorbed && bubbleFilled(bubble) < bubble.cap);
    if (!pending.length) return;
    pending.forEach((bubble) => {
      const remaining = Math.max(0, bubble.cap - bubbleFilled(bubble));
      if (remaining <= 0) return;
      bubble.chunks.push({ id: "Solvente", amount: remaining, auto: true });
      bubble.diluted = true;
      const el = document.querySelector(`[data-bubble="${bubble.id}"]`);
      pulseElement(el, "mix-swirling", 760);
      completeBubble(bubble, false, el, { autoSolvent: true });
    });
    KM.playSfx?.("refine", { volume: 0.4, rate: 1.14, cooldown: 200 });
    toast("Sin Massnotas: el Solvente cierra la fase.");
    renderMix();
    scheduleTask(checkPhaseCompletion, 760);
  }

  function hasUsableMassnotaForPendingBubbles() {
    const pending = state.bubbles.filter((bubble) => !bubble.absorbed && bubbleFilled(bubble) < bubble.cap);
    if (!pending.length) return true;
    return Object.entries(state.stock).some(([id, amount]) => (
      id !== "Solvente"
      && amount > 0
      && pending.some((bubble) => !bubble.chunks.some((chunk) => chunk.id === id))
    ));
  }

  function runDynamicEvent(noteId) {
    const event = KM.dynamicEventFor({
      noteId,
      profile: currentProfile(),
      risk: state.risk,
      seen: state.eventsSeen
    });
    if (!event) return;
    state.eventsSeen.add(event.id);
    state.risk = Math.max(0, state.risk + (event.riskDelta || 0));
    unlockPedia({ id: `event-${event.id}`, type: "event", label: event.message, families: [noteId] });
    KM.playSfx?.("magic", { volume: 0.42, rate: 1.12 });
    toast(event.message);
    guideEvent(event);
  }

  function completeBubble(bubble, completedByMaggic, el, options = {}) {
    if (bubble.rewarded) return;
    bubble.rewarded = true;
    const discovery = detectSynergy(bubble);
    bubble.synergyId = discovery?.id || null;
    if (discovery) {
      KM.playSfx?.("synergy", { volume: 0.62, rate: 1.24, cooldown: 120 });
      pulseElement(el, `synergy-${discovery.id}`, 1280);
      pulseElement(els.bubbleChart, "alchemy-glow", 1200);
      showFloatingBadge(el, discovery.label);
    }
    bubble.absorbed = true;
    if (state.selectedBubbleId === bubble.id) state.selectedBubbleId = null;
    if (completedByMaggic || options.autoSolvent) {
      if (completedByMaggic) toast("Maggic completó la burbuja sin bonus.");
      scheduleTask(renderMix, discovery ? 720 : 0);
      return discovery;
    }
    const normalChunks = bubble.chunks.filter((chunk) => chunk.id !== "Solvente" && chunk.id !== "Maggic");
    const families = new Set(normalChunks.map((chunk) => KM.noteById[chunk.id]?.family));
    if (families.size === 1 && normalChunks.length) {
      state.stock.Maggic += 5;
      toast("Burbuja pura: +1 Maggic.");
    } else if (normalChunks.length) {
      const picked = normalChunks[Math.floor(Math.random() * normalChunks.length)].id;
      state.stock[picked] += 6;
      toast(`Descubrimiento: +6 ${picked}.`);
    } else {
      toast("Burbuja sellada con solvente.");
    }
    KM.playSfx?.("complete", { volume: 0.5, rate: 1.04, cooldown: 140 });
    popParticles(el, "#f4ad41", "magic");
    scheduleTask(renderMix, discovery ? 720 : 0);
    return discovery;
  }

  function checkPhaseCompletion() {
    if (state.phaseAdvancePending || !phaseComplete()) return;
    state.phaseCores[state.phaseIndex] ||= phaseCoreData(state.phaseIndex);
    if (isFinalPhase()) {
      animatePhaseMerge("final-phase");
      KM.playSfx?.("phase", { volume: 0.58, rate: 1.08 });
      toast("Salida lista. Sella el perfume.");
      showPhaseBanner("Tres acordes", "Fusión final");
      if (isTutorialRound()) setTutorialStep("present", { silent: true });
      else guideOnce(
        "tutorial-final-ready",
        "Cierre",
        "Refina o sella",
        "Al final puedes usar Último toque con un cautivo. Refinar solo sirve si hay sobredosis pendiente."
      );
      renderMix();
      if (isTutorialRound()) setTutorialStep("present");
      return;
    }
    state.phaseAdvancePending = true;
    const nextPhase = MIX_PHASES[state.phaseIndex + 1];
    animatePhaseMerge("phase");
    KM.playSfx?.("phase", { volume: 0.5, rate: 0.96 });
    toast(`${currentPhase().label} completado.`);
    guideOnce(
      "tutorial-phase-complete",
      "Fase",
      "Se une al frasco",
      "Cuando llenas una fase, su color queda en el frasco. Las burbujas siguientes flotan sobre la línea ya rellenada."
    );
    renderMix();
    scheduleTask(() => {
      state.phaseIndex += 1;
      state.bubbles = state.phaseBubbles[state.phaseIndex];
      state.selectedBubbleId = null;
      state.phaseAdvancePending = false;
      showPhaseBanner("Nueva fase", nextPhase.label);
      KM.playSfx?.("complete", { volume: 0.36, rate: 1.1 });
      popParticles(els.bubbleChart, "#f4ad41", "magic");
      if (isTutorialRound()) setTutorialStep("bubble", { silent: true });
      renderMix();
      if (isTutorialRound()) setTutorialStep("bubble");
    }, 650);
  }

  function phaseCoreData(phaseIndex) {
    const bubbles = state.phaseBubbles[phaseIndex] || [];
    const chunks = bubbles.flatMap((bubble) => bubble.chunks);
    const best = KM.bestNoteForTarget(state.level, state.stock);
    const total = chunks.reduce((sum, chunk) => sum + chunk.amount, 0);
    return {
      id: MIX_PHASES[phaseIndex].id,
      label: MIX_PHASES[phaseIndex].label,
      color: KM.colorForChunks(chunks, best),
      total
    };
  }

  function animatePhaseMerge(kind) {
    els.bubbleChart.classList.remove("phase-merging", "final-merging");
    void els.bubbleChart.offsetWidth;
    els.bubbleChart.classList.add(kind === "final-phase" ? "final-merging" : "phase-merging");
    scheduleTask(() => els.bubbleChart.classList.remove("phase-merging", "final-merging"), 900);
  }

  function showPhaseBanner(eyebrow, title) {
    els.phaseBannerEyebrow.textContent = eyebrow;
    els.phaseBannerTitle.textContent = title;
    els.phaseBanner.setAttribute("aria-hidden", "false");
    els.phaseBanner.classList.remove("show");
    void els.phaseBanner.offsetWidth;
    els.phaseBanner.classList.add("show");
    clearTimeout(showPhaseBanner.timer);
    showPhaseBanner.timer = setTimeout(() => {
      els.phaseBanner.classList.remove("show");
      els.phaseBanner.setAttribute("aria-hidden", "true");
    }, 1300);
  }

  function detectSynergy(bubble) {
    const families = new Set(
      bubble.chunks
        .filter((chunk) => chunk.id !== "Solvente" && chunk.id !== "Maggic")
        .map((chunk) => KM.noteById[chunk.id]?.family)
        .filter(Boolean)
    );
    const discovery = KM.synergies.find((item) => item.families.every((family) => families.has(family)));
    if (discovery && unlockPedia({ ...discovery, type: "synergy" })) {
      toast(`Perfupedia: ${discovery.label}.`);
      guideOnce(
        `tutorial-synergy-${discovery.id}`,
        "Sinergia",
        discovery.label,
        "Una combinación acertada acaba de quedar registrada. Mira la Perfupedia cuando veas el aviso."
      );
    }
    return discovery;
  }

  function resetRoundDueToOverdose() {
    showPhaseBanner("Sobredosis", "Ronda reiniciada");
    toast("Tres burbujas se pasaron. Volvemos al pedido.");
    scheduleTask(() => initRound(state.levelIndex), 950);
  }

  // Refinado de rescate: una sola vez por ronda limpia las burbujas que se pasaron de gotas.
  function refinePerfume() {
    if (state.phaseAdvancePending) {
      toast("Espera al cambio de fase.");
      return;
    }
    if (state.refined) {
      toast(`Ya refinaste ${phaseLabelById(state.refinedPhase)}.`);
      return;
    }
    const overdosed = allBubbles().filter((bubble) => bubble.overdosed || bubbleFilled(bubble) > bubble.cap);
    if (!overdosed.length) {
      toast("No hay sobredosificación que limpiar.");
      return;
    }
    overdosed.forEach(trimBubbleToCap);
    state.overdoseCount = allBubbles().filter((bubble) => bubble.overdosed || bubbleFilled(bubble) > bubble.cap).length;
    const usage = resolvedUsage();
    const greenHelp = (usage.Verditia || 0) > 0;
    const marineHelp = (usage.Marinita || 0) > 0;
    const calm = 10 + overdosed.length * 3 + (greenHelp ? 4 : 0) + (marineHelp ? 2 : 0);
    state.risk = Math.max(0, state.risk - calm);
    state.refined = true;
    state.refinedPhase = currentPhase().id;
    KM.playSfx?.("refine", { volume: 0.52, rate: 1.08 });
    if (greenHelp) {
      toast(`Refinado: ${overdosed.length} burbuja${overdosed.length === 1 ? "" : "s"} calmada${overdosed.length === 1 ? "" : "s"} con Verditia.`);
    } else if (marineHelp) {
      toast(`Refinado: ${overdosed.length} burbuja${overdosed.length === 1 ? "" : "s"} limpia${overdosed.length === 1 ? "" : "s"} con Marinita.`);
    } else {
      toast(`Refinado: sobredosis retirada.`);
    }
    renderMix();
  }

  function trimBubbleToCap(bubble) {
    let extra = bubbleFilled(bubble) - bubble.cap;
    for (let index = bubble.chunks.length - 1; index >= 0 && extra > 0; index -= 1) {
      const chunk = bubble.chunks[index];
      const take = Math.min(chunk.amount, extra);
      chunk.amount -= take;
      extra -= take;
      if (chunk.amount <= 0) bubble.chunks.splice(index, 1);
    }
    bubble.overdosed = false;
    bubble.absorbed = bubbleFilled(bubble) >= bubble.cap;
  }

  function openLastTouchMenu() {
    if (!isFinalPhase() || !phaseComplete()) {
      toast("El último toque va al final.");
      return;
    }
    if (state.lastTouch) {
      toast("El último toque ya está sellado.");
      return;
    }
    renderLastTouchMenu();
    KM.playSfx?.("magic", { volume: 0.32, rate: 1.18 });
    els.lastTouchMenu.classList.add("open");
    els.lastTouchMenu.setAttribute("aria-hidden", "false");
  }

  function closeLastTouchMenu() {
    els.lastTouchMenu.classList.remove("open");
    els.lastTouchMenu.setAttribute("aria-hidden", "true");
  }

  function renderLastTouchMenu() {
    const owned = KM.captiveRecipes.filter((recipe) => (state.save.captives?.[recipe.id] || 0) > 0);
    els.lastTouchChoices.innerHTML = owned.length
      ? owned.map((recipe) => `
        <button class="last-touch-choice" data-last-captive="${recipe.id}" type="button">
          <strong>${recipe.label}</strong>
          <span>${captiveEffectText(recipe)}</span>
          <em>x${state.save.captives[recipe.id]}</em>
        </button>
      `).join("")
      : `<article class="last-touch-empty">Crea un cautivo en el Mixer para sellar un toque especial.</article>`;
  }

  function onLastTouchChoice(event) {
    const button = event.target.closest("[data-last-captive]");
    if (!button) return;
    applyLastTouch(button.dataset.lastCaptive);
  }

  // Último toque: ahora consume el cautivo elegido en el desplegable y modula el aura final.
  function applyLastTouch(captiveId) {
    const captive = KM.captiveById[captiveId];
    if (!captive || (state.save.captives?.[captive.id] || 0) <= 0) {
      toast("Elige un cautivo creado.");
      return;
    }
    if (!isFinalPhase() || !phaseComplete()) {
      toast("El último toque va al final.");
      return;
    }
    if (state.lastTouch) {
      toast("El último toque ya está sellado.");
      return;
    }
    state.lastTouch = true;
    const captiveLine = applyCaptiveLastTouch(captive);
    KM.playSfx?.("lastTouch", { volume: 0.58, rate: 1.05 });
    const profile = currentProfile();
    if (profile.riskLabel === "frágil") {
      state.risk = Math.max(0, state.risk - ((state.stock.Maggic || 0) >= 5 ? 9 : 5));
      if ((state.stock.Maggic || 0) >= 5) state.stock.Maggic -= 5;
      toast(captiveLine || "Último toque: sello estabilizador.");
      renderMix();
      return;
    }
    if ((state.stock.Maggic || 0) >= 5) {
      state.stock.Maggic -= 5;
      state.risk += 2;
      toast(captiveLine || "Maggic pone una chispa secreta.");
      popParticles(els.lastTouchBtn, KM.noteById.Maggic.color, "magic");
      renderMix();
      return;
    }
    state.risk += profile.riskLabel === "estable" ? 4 : 2;
    toast(captiveLine || "Último toque brillante.");
    renderMix();
  }

  function clearBottle() {
    if (isTutorialRound()) {
      toast("En el tutorial seguimos el paso iluminado.");
      return;
    }
    allBubbles().forEach((bubble) => {
      bubble.chunks.forEach((chunk) => {
        if (chunk.id !== "Solvente") state.stock[chunk.id] += chunk.amount;
      });
      bubble.chunks = [];
      bubble.rewarded = false;
      bubble.overdosed = false;
      bubble.absorbed = false;
      bubble.synergyId = null;
      bubble.diluted = false;
    });
    state.risk = 0;
    state.overdoseCount = 0;
    state.refined = false;
    state.refinedPhase = null;
    state.lastTouch = false;
    state.lastTouchBoost = null;
    state.eventsSeen = new Set();
    state.phaseIndex = 0;
    state.phaseAdvancePending = false;
    state.phaseCores = [];
    state.bubbles = state.phaseBubbles[state.phaseIndex];
    state.selectedBubbleId = null;
    showPhaseBanner("Reinicio", currentPhase().label);
    KM.playSfx?.("phase", { volume: 0.42, rate: 0.78 });
    renderMix();
    toast("Frasco vaciado.");
  }

  function useMaggic() {
    if ((state.stock.Maggic || 0) < 5) {
      const best = KM.bestNoteForTarget(state.level, state.stock);
      els.maggicHint.textContent = `Maggic susurra: cuida ${best}.`;
      toast("Necesitas una ficha de Maggic.");
      return;
    }
    const profile = currentProfile();
    if (state.risk > 23) {
      state.stock.Maggic -= 5;
      state.risk = Math.max(0, state.risk - 11);
      els.maggicHint.textContent = "Maggic estabiliza lo que estaba temblando.";
      KM.playSfx?.("magic", { volume: 0.5, rate: 0.92 });
      toast("Maggic estabiliza el frasco.");
      popParticles(els.bubbleChart, KM.noteById.Maggic.color, "magic");
      renderMix();
      return;
    }
    if (profile.secret && unlockPedia({ id: `maggic-${profile.secret.id}`, type: "secret", label: `${profile.secret.label} catalizado`, families: profile.aura.map((item) => item.label) })) {
      state.stock.Maggic -= 5;
      state.lastTouch = true;
      els.maggicHint.textContent = `Maggic revela ${profile.secret.label}.`;
      KM.playSfx?.("magic", { volume: 0.55, rate: 1.2 });
      toast(`Secreto catalizado: ${profile.secret.label}.`);
      renderMix();
      return;
    }
    const plan = KM.planMaggic(maggicState());
    state.stock.Maggic -= 5;
    if (plan.type === "solvent") {
      assignToBubble(plan.bubbleId, "Solvente", plan.amount, { completedByMaggic: true, ignoreDosingRules: true });
    } else if (plan.type === "complete") {
      assignToBubble(plan.bubbleId, "Maggic", plan.amount, { completedByMaggic: true, freeStock: true, ignoreDosingRules: true });
    } else if (plan.type === "grant") {
      state.stock[plan.noteId] += plan.amount;
      popParticles(els.bubbleChart, KM.noteById[plan.noteId].color, "magic");
    } else {
      state.selectedNote = plan.noteId;
    }
    els.maggicHint.textContent = plan.message;
    KM.playSfx?.("magic", { volume: 0.42, rate: plan.type === "grant" ? 1.16 : 1 });
    toast(plan.message);
    renderMix();
  }

  function maggicState() {
    return {
      level: state.level,
      stock: state.stock,
      solventBubbleIds: state.solventBubbleIds,
      bubbles: state.bubbles.map((bubble) => ({
        id: bubble.id,
        filled: bubbleFilled(bubble),
        remaining: bubble.cap - bubbleFilled(bubble),
        solventRequired: bubble.solventRequired
      }))
    };
  }

  function currentTraits() {
    const usage = resolvedUsage();
    const total = Math.max(1, Object.values(usage).reduce((sum, amount) => sum + amount, 0));
    const traits = Object.fromEntries(Object.keys(KM.traitLabels).map((key) => [key, 0]));
    Object.entries(usage).forEach(([id, amount]) => {
      const note = KM.noteById[id];
      if (!note || amount <= 0) return;
      const ratio = amount / total;
      Object.entries(note.traits).forEach(([trait, value]) => {
        traits[trait] += value * ratio;
      });
    });
    if (state.lastTouchBoost) KM.applyCaptiveBoost(traits, { effect: state.lastTouchBoost });
    return traits;
  }

  function resolvedUsage() {
    const usage = Object.fromEntries(KM.noteIds.map((id) => [id, 0]));
    const best = KM.bestNoteForTarget(state.level, state.stock);
    allBubbles().forEach((bubble) => {
      const dilutesNote = bubble.chunks.some((chunk) => chunk.id === "Solvente") && bubble.chunks.some((chunk) => chunk.id !== "Solvente");
      const phaseFactor = state.refinedPhase && bubble.phaseId === state.refinedPhase ? 1.12 : 1;
      const dilutionFactor = dilutesNote ? 0.74 : 1;
      bubble.chunks.forEach((chunk) => {
        if (chunk.id === "Solvente") return;
        usage[chunk.id === "Maggic" ? best : chunk.id] += chunk.amount * phaseFactor * dilutionFactor;
      });
    });
    return usage;
  }

  function finalColor() {
    const usage = resolvedUsage();
    const solvent = allBubbles().flatMap((bubble) => bubble.chunks).filter((chunk) => chunk.id === "Solvente").reduce((sum, chunk) => sum + chunk.amount, 0);
    const items = Object.entries(usage)
      .filter(([, amount]) => amount > 0)
      .map(([id, amount]) => ({ color: KM.noteById[id].color, amount }));
    return KM.mixWeightedColors(items, solvent / 90);
  }

  function evaluate() {
    if (blockTutorialAction("present")) return;
    if (!isFinalPhase()) {
      toast("Completa Fondo y Corazón antes de presentar.");
      return;
    }
    const incomplete = allBubbles().find((bubble) => bubbleFilled(bubble) < bubble.cap);
    if (incomplete) {
      toast("Llena todas las burbujas antes de presentar.");
      return;
    }
    state.phaseCores[state.phaseIndex] ||= phaseCoreData(state.phaseIndex);
    const traits = currentTraits();
    const usage = resolvedUsage();
    const profile = currentProfile(traits);
    let score = 32;
    const chips = [];
    Object.entries(state.level.target).forEach(([trait, target]) => {
      const diff = Math.abs((traits[trait] || 0) - target);
      score += Math.max(0, 12 - diff * 1.65);
      if (diff <= 1.25) chips.push(`${KM.traitLabels[trait]} clavado`);
    });
    Object.entries(state.level.avoid).forEach(([trait, limit]) => {
      const overflow = Math.max(0, (traits[trait] || 0) - limit);
      if (overflow > 0) chips.push(`vigila ${KM.traitLabels[trait]}`);
      score -= overflow * 4.2;
    });
    const unique = new Set(Object.entries(usage).filter(([, amount]) => amount > 0).map(([id]) => id)).size;
    const solvent = totalSolvent();
    score += unique >= 4 ? 6 : -4;
    score += profile.emotionFit;
    if (profile.trendHit) { score += 5; chips.push("tendencia del día"); }
    if (state.refined) { score += 4; chips.push(`refinado ${phaseLabelById(state.refinedPhase).toLowerCase()}`); }
    if (state.lastTouch) { score += profile.riskLabel === "frágil" ? -3 : 5; chips.push("último toque"); }
    if (state.lastTouchBoost) { score += 3; chips.push("cautivo"); }
    if (profile.secret) { score += 8; chips.push(profile.secret.label); }
    if (state.overdoseCount > 0) { score -= state.overdoseCount * 9; chips.push("sobredosis suave"); }
    score -= profile.riskLabel === "frágil" ? 14 : profile.riskLabel === "atrevido" ? 5 : 0;
    score -= solvent * 0.18;
    score = Math.max(0, Math.min(100, Math.round(score)));
    const rarity = profile.secret && score >= 86 ? "secreto raro" : score >= 92 ? "magnífico" : score >= 82 ? "precioso" : score >= 68 ? "muy mono" : score >= 52 ? "apañado" : "caótico";
    const name = perfumeName(unique, solvent);
    const color = finalColor();
    const reaction = KM.reactionFor(state.level, profile, score);
    const reward = KM.rewardForRound({ levelIndex: state.levelIndex, score, profile });
    KM.addRawMaterials(state.save, reward.items);
    if (reward.items.length) markUnread("captive", reward.items.length);
    chips.push("materias nuevas");
    unlockPedia({ id: `aura-${profile.aura[0].id}`, type: "aura", label: `Aura ${profile.aura[0].label}`, families: profile.descriptors });
    if (profile.secret) unlockPedia({ id: profile.secret.id, type: "secret", label: profile.secret.label, families: profile.aura.map((item) => item.label) });
    if (score >= 90 && profile.emotionFit > 0) unlockPedia({ id: `cliente-${state.level.id}`, type: "client", label: `${state.level.client} fiel`, families: state.level.personality });
    state.lastPerfume = { name, score, rarity, color, level: state.level.title, levelId: state.level.id, aura: profile.auraText, reaction, secret: profile.secret?.label || null, rewards: reward.items };
    KM.addPerfume(state.save, state.lastPerfume);
    KM.recordLevelPlay(state.save, state.level.id, {
      name,
      score,
      rarity,
      aura: profile.auraText,
      reaction,
      secret: profile.secret?.label || null
    });
    markUnread("pedia");
    KM.saveProgress(state.save, Math.min(state.levelIndex + 1, state.levels.length - 1));
    renderResult({ score, rarity, name, color, chips, unique, solvent, profile, reaction, reward });
    KM.playSfx?.("result", { volume: 0.58, rate: score >= 82 ? 1.08 : 0.92 });
    state.tutorialStep = null;
    document.body.classList.remove("tutorial-active");
    showScreen("result");
    guideOnce(
      "tutorial-result",
      "Resultado",
      "Colección viva",
      "El perfume se guarda en Perfupedia y las materias nuevas esperan en el Mixer de Cautivos.",
      { force: state.roundStartedAsTutorial }
    );
    if (state.roundStartedAsTutorial) KM.advanceTutorial(state.save, tutorialLevelIndices().length || 3);
  }

  function renderResult(result) {
    els.scoreOrb.textContent = result.score;
    els.rarityLabel.textContent = result.rarity;
    els.resultTitle.textContent = result.name;
    els.resultAura.textContent = `Aura ${result.profile.auraText}`;
    els.resultFeedback.textContent = result.score >= 82
      ? "El cliente reconoce el pedido al primer gesto."
      : result.score >= 62
        ? "La mezcla tiene intención y alguna sorpresa bonita."
        : "El frasco llegó vivo, pero la armonía pide otra ronda.";
    els.resultReaction.textContent = result.reaction;
    const cores = MIX_PHASES.map((phase, index) => state.phaseCores[index] || { id: phase.id, label: phase.label, color: result.color });
    const heartColor = cores[1]?.color || result.color;
    const bottle = selectBottleForHeart(heartColor);
    const bottleStage = els.finalBottleImg.closest(".final-bottle");
    els.finalBottleImg.src = KM.asset(bottle.file);
    els.finalBottleImg.alt = `Frasco ${bottle.label}`;
    bottleStage?.style.setProperty("--heart-color", heartColor);
    bottleStage?.style.setProperty("--final-color", result.color);
    bottleStage?.setAttribute("data-bottle-tone", bottle.label);
    els.finalLiquid.style.background = "";
    els.finalLiquid.innerHTML = cores.slice().reverse().map((core) => `
      <span class="final-layer ${core.id}" style="--layer-color:${core.color}">
        <b>${core.label}</b>
      </span>
    `).join("");
    els.finalOrbiters.innerHTML = "";
    els.finalPyramid.innerHTML = renderOlfactoryPyramid(cores);
    const rewards = result.reward?.items || [];
    els.resultTags.innerHTML = [...result.chips, `frasco ${bottle.label}`, result.profile.riskLabel, `${result.unique} notas madre`, result.solvent ? "con solvente" : "sin solvente"]
      .slice(0, 10)
      .map((tag) => `<span class="tag">${tag}</span>`)
      .join("");
    els.resultRewards.innerHTML = rewards.length ? `
      <span class="reward-title">Recompensas</span>
      ${rewards.map((item) => {
        const raw = KM.rawById[item.id];
        return `<span class="reward-chip" style="--raw-color:${raw?.color || "#f4ad41"}"><b>${raw?.icon || "✦"}</b><em>${raw?.label || item.id}</em><strong>x${item.amount}</strong></span>`;
      }).join("")}
    ` : "";
  }

  // Frasco final: el color emocional de Corazón decide qué botella PNG se revela.
  function selectBottleForHeart(color) {
    const rgb = parseColor(color);
    if (!rgb) return FRASCO_BOTTLES[0];
    const hsl = rgbToHsl(rgb);
    if (hsl.s < 0.08) return FRASCO_BOTTLES.find((item) => item.file === "Frasco3_transparent.png") || FRASCO_BOTTLES[0];
    if (hsl.l < 0.48 && hsl.h >= 6 && hsl.h <= 54) return FRASCO_BOTTLES.find((item) => item.special === "warm-dark") || FRASCO_BOTTLES[0];
    const hue = hsl.h >= 330 ? hsl.h : hsl.h % 360;
    return FRASCO_BOTTLES.find((item) => !item.special && item.from <= hue && hue < item.to) || FRASCO_BOTTLES[0];
  }

  function parseColor(color) {
    if (!color) return null;
    const hex = String(color).trim().match(/^#?([a-f\d]{6})$/i);
    if (hex) {
      const value = hex[1];
      return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16)
      };
    }
    const rgb = String(color).match(/rgba?\(([^)]+)\)/i);
    if (!rgb) return null;
    const [r, g, b] = rgb[1].split(",").slice(0, 3).map((part) => clamp(parseFloat(part), 0, 255));
    return Number.isFinite(r + g + b) ? { r, g, b } : null;
  }

  function rgbToHsl({ r, g, b }) {
    const rn = r / 255;
    const gn = g / 255;
    const bn = b / 255;
    const max = Math.max(rn, gn, bn);
    const min = Math.min(rn, gn, bn);
    const l = (max + min) / 2;
    if (max === min) return { h: 0, s: 0, l };
    const d = max - min;
    const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    let h = max === rn
      ? (gn - bn) / d + (gn < bn ? 6 : 0)
      : max === gn
        ? (bn - rn) / d + 2
        : (rn - gn) / d + 4;
    h *= 60;
    return { h, s, l };
  }

  function renderOlfactoryPyramid(cores) {
    return [
      { phase: MIX_PHASES[2], core: cores[2], notes: phaseTopNotes(2) },
      { phase: MIX_PHASES[1], core: cores[1], notes: phaseTopNotes(1) },
      { phase: MIX_PHASES[0], core: cores[0], notes: phaseTopNotes(0) }
    ].map((row, index) => `
      <article class="pyramid-row row-${index}" style="--pyramid-color:${row.core?.color || "#d7f3ee"}">
        <strong>${row.phase.label}</strong>
        <span>${row.notes.join(" · ") || "bruma suave"}</span>
      </article>
    `).join("");
  }

  function phaseTopNotes(phaseIndex) {
    const best = KM.bestNoteForTarget(state.level, state.stock);
    const usage = {};
    (state.phaseBubbles[phaseIndex] || []).forEach((bubble) => {
      const dilutesNote = bubble.chunks.some((chunk) => chunk.id === "Solvente") && bubble.chunks.some((chunk) => chunk.id !== "Solvente");
      const factor = dilutesNote ? 0.74 : 1;
      bubble.chunks.forEach((chunk) => {
        if (chunk.id === "Solvente") return;
        const id = chunk.id === "Maggic" ? best : chunk.id;
        usage[id] = (usage[id] || 0) + chunk.amount * factor;
      });
    });
    return Object.entries(usage)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([id]) => id);
  }

  function openPedia() {
    clearUnread("pedia");
    renderPedia();
    els.pediaPanel.classList.add("open");
    els.pediaPanel.setAttribute("aria-hidden", "false");
    guideOnce(
      "panel-pedia-first",
      "Perfupedia",
      "Tu enciclopedia",
      "Aquí se guardan perfumes, auras, sinergias, eventos, clientes y secretos descubiertos. Cuando haya algo nuevo, el botón brillará.",
      { force: true, large: true }
    );
  }

  function closePedia() {
    els.pediaPanel.classList.remove("open");
    els.pediaPanel.setAttribute("aria-hidden", "true");
  }

  function openCaptiveMixer() {
    clearUnread("captive");
    renderCaptiveMixer();
    els.captivePanel.classList.add("open");
    els.captivePanel.setAttribute("aria-hidden", "false");
    guideOnce(
      "panel-captive-first",
      "Mixer de Cautivos",
      "Alquimia secreta",
      "Combina materias primas para descubrir ingredientes Cautivos. Las recetas son misterio puro, y luego esos Cautivos pueden mejorar el toque final.",
      { force: true, large: true }
    );
  }

  function closeCaptiveMixer() {
    els.captivePanel.classList.remove("open");
    els.captivePanel.setAttribute("aria-hidden", "true");
  }

  function openElaborations() {
    renderElaborations();
    els.elaborationsPanel.classList.add("open");
    els.elaborationsPanel.setAttribute("aria-hidden", "false");
    guideOnce(
      "panel-elaborations-first",
      "Elaboraciones",
      "Archivo jugable",
      "Aquí solo aparecen elaboraciones que ya has completado. Las fragancias nuevas se descubren jugando, sin spoilers.",
      { force: true, large: true }
    );
  }

  function closeElaborations() {
    els.elaborationsPanel.classList.remove("open");
    els.elaborationsPanel.setAttribute("aria-hidden", "true");
  }

  function renderElaborations() {
    const completed = state.levels
      .map((level, index) => ({ level, index, history: levelHistory(level) }))
      .filter((item) => item.history.length > 0);

    if (!completed.length) {
      els.elaborationsList.innerHTML = `
        <article class="elaboration-empty">
          <strong>Aún no hay elaboraciones guardadas</strong>
          <span>Completa tu primera receta desde Jugar y aparecerá aquí.</span>
        </article>
      `;
      return;
    }

    els.elaborationsList.innerHTML = completed.map(({ level, index, history }) => {
      const best = history.reduce((top, item) => Math.max(top, item.score || 0), 0);
      const last = history[0];
      const brief = level.emotion?.wish || level.desc || "Pedido secreto";
      const lastLine = `${last.name || "Perfume"} · ${last.rarity || "sin rareza"} · ${formatShortDate(last.playedAt || last.createdAt)}`;
      const runs = history.slice(0, 3).map((item) => `<i>${item.name || "Perfume"} · ${item.score || 0}</i>`).join("");
      return `
        <button class="elaboration-item played" type="button" data-elaboration="${index}">
          <span class="elaboration-mark">${level.mark || "✦"}</span>
          <span class="elaboration-copy">
            <strong>${level.title}</strong>
            <em>${brief}</em>
            <small>${lastLine}</small>
            <span class="elaboration-runs">${runs}</span>
          </span>
          <span class="elaboration-history">
            <b>${history.length}</b>
            <small>mejor ${best}</small>
          </span>
        </button>
      `;
    }).join("");
  }

  function onElaborationClick(event) {
    const button = event.target.closest("[data-elaboration]");
    if (!button) return;
    const index = Number(button.dataset.elaboration);
    const level = state.levels[index];
    if (!levelHistory(level).length) {
      toast("Ese pedido aún sale solo en Jugar aleatorio.");
      return;
    }
    closeElaborations();
    initRound(index);
  }

  function openFamilyLore() {
    renderFamilyLore();
    els.familyPanel.classList.add("open");
    els.familyPanel.setAttribute("aria-hidden", "false");
    guideOnce(
      "panel-family-first",
      "La Familia",
      "Lore de Massnotas",
      "Aquí viven las historias de COSMO, la Burbuja Primigenia y cada Massnota. Es lectura bonita para conocer mejor a la familia del frasco.",
      { force: true, large: true }
    );
  }

  function closeFamilyLore() {
    els.familyPanel.classList.remove("open");
    els.familyPanel.setAttribute("aria-hidden", "true");
  }

  function renderFamilyLore() {
    const lore = KM.familyLore;
    if (!lore) {
      els.familyContent.innerHTML = `<article class="family-empty">El lore está dormido por ahora.</article>`;
      return;
    }

    const origin = lore.origin.map((item) => `
      <article class="family-origin-card">
        <img src="${KM.asset(item.image)}" alt="${item.title}">
        <div>
          <span>${item.tag}</span>
          <strong>${item.title}</strong>
          <p>${item.text}</p>
        </div>
      </article>
    `).join("");

    const notes = lore.notes.map((item) => {
      const note = KM.noteById[item.id] || {};
      const family = KM.familyLabel?.[note.family] || item.lineage;
      const displayName = item.name || item.id;
      return `
        <article class="family-note" style="--note-color:${note.color || "#f4ad41"}">
          <img src="${KM.asset(item.image)}" alt="${displayName}">
          <div class="family-note-copy">
            <span>${family}</span>
            <strong>${displayName}</strong>
            <div class="family-pills">
              <i>${item.lineage}</i>
              <i>${item.role}</i>
              <i>${item.vibe}</i>
            </div>
            <p>${item.text}</p>
            <small>${item.bond}</small>
            <em>${note.passive || ""}</em>
          </div>
        </article>
      `;
    }).join("");

    const stories = lore.stories.map((story) => `
      <article class="family-story">
        <strong>${story.title}</strong>
        <p>${story.text}</p>
      </article>
    `).join("");

    els.familyContent.innerHTML = `
      <section class="family-hero">
        <img class="family-crest" src="${KM.asset(lore.hero)}" alt="${lore.title}">
        <div class="family-intro">
          <span>${lore.subtitle}</span>
          <h3>${lore.title}</h3>
          ${lore.intro.map((line) => `<p>${line}</p>`).join("")}
        </div>
      </section>
      <section class="family-origin">${origin}</section>
      <section>
        <div class="family-section-title">
          <span>Massnotas</span>
          <strong>Linajes vivos</strong>
        </div>
        <div class="family-notes">${notes}</div>
      </section>
      <section>
        <div class="family-section-title">
          <span>Taller de COSMO</span>
          <strong>Historias pequeñas</strong>
        </div>
        <div class="family-stories">${stories}</div>
      </section>
    `;
  }

  function levelHistory(level) {
    const recorded = state.save.levelHistory?.[level.id] || [];
    const legacy = (state.save.perfumes || [])
      .filter((item) => item.levelId === level.id || item.level === level.title)
      .map((item) => ({
        name: item.name,
        score: item.score,
        rarity: item.rarity,
        aura: item.aura,
        reaction: item.reaction,
        playedAt: item.createdAt
      }));
    const merged = [...recorded, ...legacy];
    const seen = new Set();
    return merged.filter((item) => {
      const key = `${item.name || ""}-${item.playedAt || ""}-${item.score || ""}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }

  function formatShortDate(value) {
    if (!value) return "hoy";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "hoy";
    return date.toLocaleDateString("es-ES", { day: "2-digit", month: "2-digit" });
  }

  // Mixer de Cautivos: una alquimia simple de inventario, con recetas ocultas que el jugador prueba.
  function renderCaptiveMixer() {
    const slots = [0, 1, 2];
    els.captiveSlots.innerHTML = slots.map((index) => {
      const id = state.captiveSlots[index];
      const raw = KM.rawById[id];
      return `
        <button class="captive-slot ${id ? "filled" : ""}" data-slot="${index}" type="button" style="--raw-color:${raw?.color || "#d7f3ee"}">
          ${raw ? `<strong>${raw.icon}</strong><span>${raw.label}</span>` : `<strong>+</strong><span>Materia</span>`}
        </button>
      `;
    }).join("");

    const selected = state.captiveSlots.reduce((map, id) => {
      if (id) map[id] = (map[id] || 0) + 1;
      return map;
    }, {});
    const rawWithStock = KM.rawMaterials.filter((item) => (state.save.rawMaterials?.[item.id] || 0) > 0);
    els.rawGrid.innerHTML = rawWithStock.length ? rawWithStock.map((item) => {
      const count = state.save.rawMaterials?.[item.id] || 0;
      const available = count - (selected[item.id] || 0);
      return `
        <button class="raw-item" data-raw="${item.id}" type="button" ${available <= 0 ? "disabled" : ""} style="--raw-color:${item.color}">
          <strong>${item.icon}</strong>
          <span>${item.label}</span>
          <em>x${count}</em>
        </button>
      `;
    }).join("") : `<article class="inventory-empty">Aún no tienes materia prima. Completa una ronda para conseguirla.</article>`;

    const ownedCaptives = KM.captiveRecipes.filter((recipe) => (state.save.captives?.[recipe.id] || 0) > 0);
    els.captiveGrid.innerHTML = ownedCaptives.length ? ownedCaptives.map((recipe) => {
      const count = state.save.captives?.[recipe.id] || 0;
      const equipped = false;
      return `
        <button class="captive-item known ${equipped ? "equipped" : ""}" data-captive="${recipe.id}" type="button">
          <strong>${recipe.label}</strong>
          <span>${captiveEffectText(recipe)}</span>
          <em>${count > 0 ? `x${count}` : equipped ? "en uso" : "??"}</em>
        </button>
      `;
    }).join("") : `<article class="inventory-empty">Aún no has creado Cautivos. Prueba combinaciones cuando tengas materia.</article>`;
    if (!els.captiveResult.textContent.trim()) els.captiveResult.textContent = "Toca materias para probar.";
  }

  function onRawClick(event) {
    const button = event.target.closest("[data-raw]");
    if (!button) return;
    const id = button.dataset.raw;
    if (state.captiveSlots.length >= 3) {
      toast("Tres materias como máximo.");
      return;
    }
    const used = state.captiveSlots.filter((item) => item === id).length;
    if ((state.save.rawMaterials?.[id] || 0) <= used) {
      toast("No queda esa materia.");
      return;
    }
    KM.playSfx?.("card", { volume: 0.28, rate: 1.05 });
    state.captiveSlots.push(id);
    els.captiveResult.textContent = "La mezcla espera otra pista.";
    renderCaptiveMixer();
  }

  function onCaptiveSlotClick(event) {
    const button = event.target.closest("[data-slot]");
    if (!button) return;
    const index = Number(button.dataset.slot);
    if (!state.captiveSlots[index]) return;
    KM.playSfx?.("miss", { volume: 0.25, rate: 0.9 });
    state.captiveSlots.splice(index, 1);
    els.captiveResult.textContent = "Materia retirada.";
    renderCaptiveMixer();
  }

  function onCaptiveClick(event) {
    const button = event.target.closest("[data-captive]");
    if (!button) return;
    const id = button.dataset.captive;
    if ((state.save.captives?.[id] || 0) <= 0) return;
    const captive = KM.captiveById[id];
    toast(`${captive.label}: elígelo desde Último toque.`);
    renderCaptiveMixer();
  }

  function mixCaptive() {
    const result = KM.tryCaptiveRecipe(state.save, state.captiveSlots);
    els.captiveResult.textContent = result.message;
    if (result.ok) {
      unlockPedia({
        id: `cautivo-${result.recipe.id}`,
        type: "captive",
        label: result.recipe.label,
        families: result.recipe.inputs.map((id) => KM.rawById[id]?.label || id)
      });
      markUnread("captive");
      state.captiveSlots = [];
      KM.playSfx?.("captive", { volume: 0.52, rate: 1.18 });
      toast(result.message);
      guideOnce(
        `captive-guide-${result.recipe.id}`,
        "Cautivo",
        result.recipe.label,
        "Este ingrediente puede usarse en Último toque para cambiar el aura final.",
        { force: true }
      );
      popParticles(els.mixCaptiveBtn, "#f4ad41", "magic");
    } else {
      KM.playSfx?.("miss", { volume: 0.34, rate: 0.82 });
    }
    renderCaptiveMixer();
  }

  function clearCaptiveSlots() {
    state.captiveSlots = [];
    els.captiveResult.textContent = "Toca materias para probar.";
    renderCaptiveMixer();
  }

  function captiveEffectText(recipe) {
    const traits = Object.keys(recipe.effect?.traits || {}).slice(0, 2).map((key) => KM.traitLabels[key] || key);
    return traits.join(" + ") || "acabado secreto";
  }

  function applyCaptiveLastTouch(captive) {
    KM.spendInventory(state.save, "captives", captive.id, 1);
    state.lastTouchBoost = captive.effect;
    state.risk = Math.max(0, state.risk + (captive.effect?.risk || 0));
    KM.writeSave(state.save);
    renderCaptiveMixer();
    closeLastTouchMenu();
    return `Último toque: ${captive.label}.`;
  }

  function renderPedia() {
    const tabs = [
      ["perfumes", "Perfumes"],
      ["synergy", "Sinergias"],
      ["aura", "Auras"],
      ["event", "Eventos"],
      ["secret", "Secretos"],
      ["client", "Clientes"],
      ["captive", "Cautivos"]
    ];
    els.pediaTabs.innerHTML = tabs.map(([id, label]) => `
      <button class="pedia-tab ${state.pediaTab === id ? "active" : ""}" data-pedia-tab="${id}" type="button">${label}</button>
    `).join("");

    const cards = state.pediaTab === "perfumes"
      ? state.save.perfumes.map((item) => `
        <article class="pedia-item"><strong>${item.name}</strong><p class="fineprint">${item.level} · ${item.aura || "aura suave"} · ${item.rarity}</p><p class="fineprint">${item.reaction || ""}</p></article>
      `)
      : state.save.discoveries
        .filter((item) => pediaType(item) === state.pediaTab)
        .map((item) => `
          <article class="pedia-item"><strong>${item.label}</strong><p class="fineprint">${(item.families || []).join(" + ") || "hallazgo kawaii"}</p></article>
        `);

    els.pediaGrid.innerHTML = cards.join("") || `<article class="pedia-item">Nada por aquí todavía.</article>`;
  }

  function pediaType(item) {
    if (item.type) return item.type;
    if (item.id?.startsWith("aura-")) return "aura";
    if (item.id?.startsWith("event-")) return "event";
    if (item.id?.startsWith("cliente-")) return "client";
    if (item.id?.startsWith("cautivo-")) return "captive";
    if (item.id?.startsWith("maggic-")) return "secret";
    if (["cupido-pop", "medianoche-rubi", "nube-de-spa", "maggic-couture", "caramelo-travieso"].includes(item.id)) return "secret";
    return "synergy";
  }

  function currentPhase() {
    return MIX_PHASES[state.phaseIndex] || MIX_PHASES[0];
  }

  function phaseLabelById(id) {
    return MIX_PHASES.find((phase) => phase.id === id)?.label || "fase";
  }

  function isFinalPhase() {
    return state.phaseIndex === MIX_PHASES.length - 1;
  }

  function phaseComplete() {
    return state.bubbles.length > 0 && state.bubbles.every((bubble) => bubbleFilled(bubble) >= bubble.cap);
  }

  function allBubbles() {
    return state.phaseBubbles.length ? state.phaseBubbles.flat() : state.bubbles;
  }

  function updatePhaseActions() {
    const finalReady = isFinalPhase() && phaseComplete();
    const canRefine = !state.phaseAdvancePending && !state.refined && state.overdoseCount > 0;
    const tutorial = isTutorialRound();
    els.refineBtn.disabled = tutorial || !canRefine;
    els.lastTouchBtn.disabled = tutorial || !finalReady || state.lastTouch;
    els.evaluateBtn.disabled = !finalReady;
    els.clearBtn.disabled = tutorial;
    els.evaluateBtn.classList.toggle("tutorial-focus", tutorial && state.tutorialStep === "present");
    els.clearBtn.classList.toggle("tutorial-muted", tutorial);
    els.refineBtn.classList.toggle("tutorial-muted", tutorial);
    els.lastTouchBtn.classList.toggle("tutorial-muted", tutorial);
    els.refineBtn.title = state.refined
      ? `Ya refinaste ${phaseLabelById(state.refinedPhase)}`
      : state.overdoseCount > 0
        ? "Quita sobredosificaciones una sola vez"
        : "Disponible si una burbuja se pasa";
    els.lastTouchBtn.title = tutorial ? "Se explica después del tutorial" : finalReady ? "" : "Disponible en Salida";
  }

  function selectedAliquot() {
    const min = currentAliquotMin();
    const amount = clamp(Math.round(state.aliquotAmount || 5), min, ALIQUOT_MAX);
    return {
      amount,
      min,
      scale: 0.72 + ((amount - ALIQUOT_MIN) / (ALIQUOT_MAX - ALIQUOT_MIN)) * 0.44
    };
  }

  function currentAliquotMin() {
    return minimumAliquotForBubble(selectedBubble());
  }

  // Dosificación: evita el abuso de 1 gota hasta que la burbuja está en zona de remate.
  // El umbral sube con burbujas grandes, porque admiten más tanteo sin volverse injustas.
  function minimumAliquotForBubble(bubble) {
    if (!bubble) return ALIQUOT_MIN;
    const filled = bubbleFilled(bubble);
    const remaining = Math.max(0, bubble.cap - filled);
    if (remaining <= 1) return 1;
    const progress = filled / Math.max(1, bubble.cap);
    const fineAt = bubble.cap <= 5 ? 0.62 : bubble.cap <= 9 ? 0.72 : bubble.cap <= 13 ? 0.78 : 0.82;
    if (progress >= fineAt) return 1;
    if (progress >= fineAt - 0.16 || remaining <= 2) return 2;
    if (progress >= fineAt - 0.32) return clamp(Math.ceil(bubble.cap * 0.17), 2, 4);
    return clamp(Math.ceil(bubble.cap * 0.24), 3, 6);
  }

  function aliquotModeLabel(minimum) {
    if (minimum <= 1) return "gota fina";
    if (minimum <= 2) return "trazo suave";
    if (minimum <= 4) return "trazo firme";
    return "trazo generoso";
  }

  function largestRemainingBubble() {
    return Math.max(0, ...state.bubbles.map((bubble) => bubble.cap - bubbleFilled(bubble)));
  }

  function bubbleFilled(bubble) {
    return bubble.chunks.reduce((sum, chunk) => sum + chunk.amount, 0);
  }

  function totalSolvent() {
    return allBubbles()
      .flatMap((bubble) => bubble.chunks)
      .filter((chunk) => chunk.id === "Solvente")
      .reduce((sum, chunk) => sum + chunk.amount, 0);
  }

  function perfumeName(unique, solvent) {
    const usage = Object.entries(resolvedUsage()).sort((a, b) => b[1] - a[1]).filter(([, amount]) => amount > 0);
    const lead = usage[0]?.[0] || "Nube";
    const accent = usage[1]?.[0] || "clara";
    const left = ["Seda", "Nube", "Brillo", "Ritual", "Jardín", "Luna", "Chispa", "Aura"];
    const right = solvent > 16 ? "de cristal" : unique >= 5 ? "alquímica" : "bonita";
    return `${left[state.levelIndex % left.length]} ${lead} & ${accent} ${right}`;
  }

  function popParticles(el, color, family) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    state.particles.spawn(rect.left + rect.width / 2, rect.top + rect.height / 2, color, family);
  }

  function pulseElement(el, className, duration) {
    if (!el) return;
    el.classList.remove(className);
    void el.offsetWidth;
    el.classList.add(className);
    scheduleTask(() => el.classList.remove(className), duration);
  }

  function showFloatingBadge(el, text) {
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const badge = document.createElement("div");
    badge.className = "floating-badge";
    badge.textContent = text;
    badge.style.left = `${rect.left + rect.width / 2}px`;
    badge.style.top = `${rect.top + rect.height * 0.22}px`;
    document.body.appendChild(badge);
    scheduleTask(() => badge.remove(), 1200);
  }

  function toast(message) {
    els.toast.textContent = message;
    els.toast.classList.add("show");
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => els.toast.classList.remove("show"), 2100);
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function randomInt(min, max) {
    return Math.floor(randomBetween(min, max + 1));
  }

  function shuffle(list) {
    return [...list].sort(() => Math.random() - 0.5);
  }

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
