(function () {
  const root = window.KM || {};

  class ParticleSystem {
    constructor(canvas) {
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.items = [];
      this.motionOK = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      this.resize = this.resize.bind(this);
      this.tick = this.tick.bind(this);
      window.addEventListener("resize", this.resize, { passive: true });
      this.resize();
      requestAnimationFrame(this.tick);
    }

    resize() {
      const ratio = Math.min(2, window.devicePixelRatio || 1);
      this.canvas.width = Math.floor(window.innerWidth * ratio);
      this.canvas.height = Math.floor(window.innerHeight * ratio);
      this.canvas.style.width = `${window.innerWidth}px`;
      this.canvas.style.height = `${window.innerHeight}px`;
      this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    spawn(x, y, color, family = "spark") {
      if (!this.motionOK) return;
      const count = family === "magic" ? 22 : 14;
      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + Math.random() * 0.55;
        const speed = 1.1 + Math.random() * 2.4;
        this.items.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5,
          life: 34 + Math.random() * 22,
          age: 0,
          size: 3 + Math.random() * 5,
          color
        });
      }
      this.items = this.items.slice(-120);
    }

    tick() {
      const { ctx } = this;
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      this.items = this.items.filter((item) => item.age < item.life);
      this.items.forEach((item) => {
        item.age += 1;
        item.x += item.vx;
        item.y += item.vy;
        item.vy += 0.035;
        const alpha = 1 - item.age / item.life;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = item.color;
        ctx.beginPath();
        ctx.arc(item.x, item.y, item.size * alpha, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
      requestAnimationFrame(this.tick);
    }
  }

  root.ParticleSystem = ParticleSystem;
  window.KM = root;
})();
