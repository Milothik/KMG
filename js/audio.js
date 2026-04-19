(function () {
  const KM = window.KM || {};
  const SOUND_PREFIX = window.KM_SOUND_PREFIX || "assets/sounds/";
  const SOUND_PREF_KEY = "kawaii-mixer-sound-enabled-v1";
  const SFX_PREF_KEY = "kawaii-mixer-sfx-enabled-v1";
  const MUSIC_PREF_KEY = "kawaii-mixer-music-enabled-v1";
  const MUSIC_FILE = "Forest Bubbles.mp3";
  const sounds = {
    tap: "the-sound-of-a-bubble-bursting-once-similar-to-chewing-gum.mp3",
    card: "bubble-sound-sound-quotchokquot-or-quotpokquot.mp3",
    drop: "bubble-sound-sound-quotchokquot-or-quotpokquot.mp3",
    mix: "bubble-sound-sound-quotchokquot-or-quotpokquot.mp3",
    match: "version-number-2-for-electronic-sound.mp3",
    miss: "the-sound-of-a-bubble-bursting-once-similar-to-chewing-gum.mp3",
    complete: "perfume-lid-closing-sound.mp3",
    synergy: "version-number-2-for-electronic-sound.mp3",
    phase: "perfume-lid-closing-sound.mp3",
    refine: "the-sound-of-a-bubble-bursting-once-similar-to-chewing-gum.mp3",
    lastTouch: "perfume-lid-closing-sound.mp3",
    result: "sound-spraying-perfume-on-hands-and-neck.mp3",
    magic: "version-number-2-for-electronic-sound.mp3",
    captive: "version-number-2-for-electronic-sound.mp3"
  };

  function soundAsset(file) {
    if (window.KM_ASSETS?.[file]) return window.KM_ASSETS[file];
    return `${SOUND_PREFIX}${file}`;
  }

  function readAudioPref(key) {
    const stored = localStorage.getItem(key);
    if (stored !== null) return stored !== "false";
    return localStorage.getItem(SOUND_PREF_KEY) !== "false";
  }

  class SfxPlayer {
    constructor() {
      this.sfxEnabled = readAudioPref(SFX_PREF_KEY);
      this.musicEnabled = readAudioPref(MUSIC_PREF_KEY);
      this.enabled = this.sfxEnabled && this.musicEnabled;
      this.unlocked = false;
      this.masterVolume = 0.72;
      this.musicVolume = 0.22;
      this.music = null;
      this.cache = new Map();
      this.lastPlayed = new Map();
    }

    init() {
      const unlock = () => this.unlock();
      document.addEventListener("pointerdown", unlock, { once: true, passive: true });
      document.addEventListener("keydown", unlock, { once: true });
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.pauseMusic();
        else this.startMusic();
      });
    }

    unlock() {
      this.unlocked = true;
      Object.keys(sounds).forEach((key) => this.prepare(key));
      this.startMusic();
    }

    prepare(key) {
      if (this.cache.has(key) || !sounds[key]) return this.cache.get(key);
      const audio = new Audio(soundAsset(sounds[key]));
      audio.preload = "auto";
      audio.volume = this.masterVolume;
      this.cache.set(key, audio);
      return audio;
    }

    prepareMusic() {
      if (this.music) return this.music;
      this.music = new Audio(soundAsset(MUSIC_FILE));
      this.music.preload = "auto";
      this.music.loop = true;
      this.music.volume = this.musicVolume;
      return this.music;
    }

    startMusic() {
      if (!this.musicEnabled || !this.unlocked || document.hidden) return;
      const music = this.prepareMusic();
      music.volume = this.musicVolume;
      music.play().catch(() => {});
    }

    pauseMusic() {
      if (this.music) this.music.pause();
    }

    setEnabled(enabled) {
      const next = Boolean(enabled);
      this.sfxEnabled = next;
      this.musicEnabled = next;
      this.enabled = next;
      localStorage.setItem(SOUND_PREF_KEY, next ? "true" : "false");
      localStorage.setItem(SFX_PREF_KEY, next ? "true" : "false");
      localStorage.setItem(MUSIC_PREF_KEY, next ? "true" : "false");
      if (this.musicEnabled) this.startMusic();
      else this.pauseMusic();
      this.emitChange();
      return this.enabled;
    }

    toggle() {
      return this.setEnabled(!this.enabled);
    }

    setSfxEnabled(enabled) {
      this.sfxEnabled = Boolean(enabled);
      this.syncEnabled();
      localStorage.setItem(SFX_PREF_KEY, this.sfxEnabled ? "true" : "false");
      this.emitChange();
      return this.sfxEnabled;
    }

    setMusicEnabled(enabled) {
      this.musicEnabled = Boolean(enabled);
      this.syncEnabled();
      localStorage.setItem(MUSIC_PREF_KEY, this.musicEnabled ? "true" : "false");
      if (this.musicEnabled) this.startMusic();
      else this.pauseMusic();
      this.emitChange();
      return this.musicEnabled;
    }

    toggleSfx() {
      return this.setSfxEnabled(!this.sfxEnabled);
    }

    toggleMusic() {
      return this.setMusicEnabled(!this.musicEnabled);
    }

    syncEnabled() {
      this.enabled = this.sfxEnabled && this.musicEnabled;
    }

    emitChange() {
      document.dispatchEvent(new CustomEvent("km:soundchange", {
        detail: {
          enabled: this.enabled,
          sfxEnabled: this.sfxEnabled,
          musicEnabled: this.musicEnabled
        }
      }));
    }

    play(key, options = {}) {
      if (!this.sfxEnabled || !this.unlocked) return;
      const base = this.prepare(key);
      if (!base) return;
      const now = performance.now();
      const cooldown = options.cooldown ?? 45;
      if (now - (this.lastPlayed.get(key) || 0) < cooldown) return;
      this.lastPlayed.set(key, now);
      const audio = base.cloneNode();
      audio.volume = Math.max(0, Math.min(1, (options.volume ?? 1) * this.masterVolume));
      audio.playbackRate = Math.max(0.55, Math.min(1.65, options.rate ?? 1));
      audio.play().catch(() => {});
    }
  }

  KM.sfx = new SfxPlayer();
  KM.playSfx = (key, options) => KM.sfx.play(key, options);
  KM.toggleSound = () => KM.sfx.toggle();
  KM.setSoundEnabled = (enabled) => KM.sfx.setEnabled(enabled);
  KM.soundEnabled = () => KM.sfx.enabled;
  KM.toggleSfx = () => KM.sfx.toggleSfx();
  KM.setSfxEnabled = (enabled) => KM.sfx.setSfxEnabled(enabled);
  KM.sfxEnabled = () => KM.sfx.sfxEnabled;
  KM.toggleMusic = () => KM.sfx.toggleMusic();
  KM.setMusicEnabled = (enabled) => KM.sfx.setMusicEnabled(enabled);
  KM.musicEnabled = () => KM.sfx.musicEnabled;
  KM.startMusic = () => KM.sfx.startMusic();
  KM.sfx.init();
  window.KM = KM;
}());
