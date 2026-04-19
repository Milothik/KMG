(function () {
  const root = window.KM || {};
  const KEY = "kawaii-mixer-save-v4";

  const emptySave = () => ({
    version: 4,
    levelIndex: 0,
    discoveries: [],
    perfumes: [],
    rawMaterials: {},
    captives: {},
    captiveDiscoveries: [],
    levelHistory: {},
    equippedCaptive: null,
    unread: { pedia: 0, captive: 0 },
    seenHints: [],
    tutorial: { version: 2, started: false, completed: false, levelIndex: 0 }
  });

  const freshTutorial = () => ({ version: 2, started: false, completed: false, levelIndex: 0 });

  function loadSave() {
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!parsed || parsed.version !== 4) return emptySave();
      parsed.discoveries ||= [];
      parsed.perfumes ||= [];
      parsed.rawMaterials ||= {};
      parsed.captives ||= {};
      parsed.captiveDiscoveries ||= [];
      parsed.levelHistory ||= {};
      parsed.equippedCaptive ||= null;
      parsed.levelIndex ||= 0;
      parsed.unread ||= {};
      parsed.unread.pedia ||= 0;
      parsed.unread.captive ||= 0;
      parsed.seenHints ||= [];
      if (!parsed.tutorial || parsed.tutorial.version !== 2) {
        parsed.tutorial = freshTutorial();
      }
      parsed.tutorial.started ||= false;
      parsed.tutorial.completed ||= false;
      parsed.tutorial.levelIndex ||= 0;
      return parsed;
    } catch {
      return emptySave();
    }
  }

  function writeSave(save) {
    localStorage.setItem(KEY, JSON.stringify(save));
  }

  function unlockDiscovery(save, discovery) {
    if (!save.discoveries.some((item) => item.id === discovery.id)) {
      save.discoveries.push({ ...discovery, unlockedAt: new Date().toISOString() });
      writeSave(save);
      return true;
    }
    return false;
  }

  function addPerfume(save, perfume) {
    save.perfumes.unshift({ ...perfume, createdAt: new Date().toISOString() });
    save.perfumes = save.perfumes.slice(0, 30);
    writeSave(save);
  }

  function recordLevelPlay(save, levelId, entry) {
    save.levelHistory ||= {};
    save.levelHistory[levelId] ||= [];
    save.levelHistory[levelId].unshift({ ...entry, playedAt: new Date().toISOString() });
    save.levelHistory[levelId] = save.levelHistory[levelId].slice(0, 12);
    writeSave(save);
  }

  function saveProgress(save, levelIndex) {
    save.levelIndex = Math.max(save.levelIndex || 0, levelIndex);
    writeSave(save);
  }

  function addRawMaterials(save, items) {
    save.rawMaterials ||= {};
    items.forEach((item) => {
      save.rawMaterials[item.id] = (save.rawMaterials[item.id] || 0) + (item.amount || 1);
    });
    writeSave(save);
  }

  function addCaptive(save, id, amount = 1) {
    save.captives ||= {};
    save.captives[id] = (save.captives[id] || 0) + amount;
    writeSave(save);
  }

  function spendInventory(save, inventoryKey, id, amount = 1) {
    save[inventoryKey] ||= {};
    if ((save[inventoryKey][id] || 0) < amount) return false;
    save[inventoryKey][id] -= amount;
    if (save[inventoryKey][id] <= 0) delete save[inventoryKey][id];
    writeSave(save);
    return true;
  }

  function markUnread(save, kind, amount = 1) {
    save.unread ||= { pedia: 0, captive: 0 };
    save.unread[kind] = Math.max(0, (save.unread[kind] || 0) + amount);
    writeSave(save);
  }

  function clearUnread(save, kind) {
    save.unread ||= { pedia: 0, captive: 0 };
    save.unread[kind] = 0;
    writeSave(save);
  }

  function hasHintSeen(save, id) {
    save.seenHints ||= [];
    return save.seenHints.includes(id);
  }

  function markHintSeen(save, id) {
    save.seenHints ||= [];
    if (!save.seenHints.includes(id)) {
      save.seenHints.push(id);
      writeSave(save);
    }
  }

  function completeTutorial(save) {
    save.tutorial ||= freshTutorial();
    save.tutorial.version = 2;
    save.tutorial.started = true;
    save.tutorial.completed = true;
    save.tutorial.levelIndex = Math.max(save.tutorial.levelIndex || 0, 3);
    writeSave(save);
  }

  function startTutorial(save) {
    save.tutorial ||= freshTutorial();
    save.tutorial.version = 2;
    save.tutorial.started = true;
    writeSave(save);
  }

  function advanceTutorial(save, totalLevels = 3) {
    save.tutorial ||= freshTutorial();
    save.tutorial.version = 2;
    save.tutorial.started = true;
    save.tutorial.levelIndex = Math.min(totalLevels, (save.tutorial.levelIndex || 0) + 1);
    save.tutorial.completed = save.tutorial.levelIndex >= totalLevels;
    writeSave(save);
  }

  root.loadSave = loadSave;
  root.writeSave = writeSave;
  root.unlockDiscovery = unlockDiscovery;
  root.addPerfume = addPerfume;
  root.recordLevelPlay = recordLevelPlay;
  root.saveProgress = saveProgress;
  root.addRawMaterials = addRawMaterials;
  root.addCaptive = addCaptive;
  root.spendInventory = spendInventory;
  root.markUnread = markUnread;
  root.clearUnread = clearUnread;
  root.hasHintSeen = hasHintSeen;
  root.markHintSeen = markHintSeen;
  root.completeTutorial = completeTutorial;
  root.startTutorial = startTutorial;
  root.advanceTutorial = advanceTutorial;
  window.KM = root;
})();
