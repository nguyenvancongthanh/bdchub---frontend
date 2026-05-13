'use client';

import React, { useRef, useEffect } from 'react';
import { useTheme } from 'next-themes';

/* ─── Star ──────────────────────────────────────────────────────────── */
class Star {
  x: number;
  y: number;
  z: number;
  size: number;
  baseAlpha: number;
  twinkleSpeed: number;
  twinklePhase: number;

  constructor(w: number, h: number) {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.z = Math.random();
    // Smaller, subtler stars — feel like real night sky
    this.size = 0.3 + this.z * 1.4;
    this.baseAlpha = 0.15 + this.z * 0.5;
    this.twinkleSpeed = 0.2 + Math.random() * 0.8;
    this.twinklePhase = Math.random() * Math.PI * 2;
  }

  draw(ctx: CanvasRenderingContext2D, time: number, isDark: boolean) {
    const twinkle = Math.sin(time * this.twinkleSpeed + this.twinklePhase);
    const alpha = this.baseAlpha * (0.6 + 0.4 * twinkle) * (isDark ? 1 : 0.18);
    if (alpha < 0.02) return;

    // Bright stars get a soft glow halo
    if (isDark && this.z > 0.7) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(210, 60%, 80%, ${alpha * 0.08})`;
      ctx.fill();
    }

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    if (isDark) {
      // Warmer color mix: white → blue → cyan by depth
      const hue = 200 + this.z * 20;
      const lightness = 85 + this.z * 10;
      ctx.fillStyle = `hsla(${hue}, 40%, ${lightness}%, ${alpha})`;
    } else {
      ctx.fillStyle = `hsla(215, 30%, 65%, ${alpha * 0.5})`;
    }
    ctx.fill();
  }
}

/* ─── Nebula Blob — softer, more organic ─────────────────────────────── */
class Nebula {
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  hue: number;
  phase: number;
  speed: number;

  constructor(w: number, h: number) {
    this.cx = Math.random() * w;
    this.cy = Math.random() * h;
    this.rx = 200 + Math.random() * 300;
    this.ry = 150 + Math.random() * 250;
    this.hue = [210, 235, 260][Math.floor(Math.random() * 3)];
    this.phase = Math.random() * Math.PI * 2;
    this.speed = 0.05 + Math.random() * 0.1;
  }

  draw(ctx: CanvasRenderingContext2D, time: number, w: number, h: number, isDark: boolean) {
    const x = this.cx + Math.sin(time * this.speed + this.phase) * 30;
    const y = this.cy + Math.cos(time * this.speed * 0.6 + this.phase) * 20;

    const wx = ((x % w) + w) % w;
    const wy = ((y % h) + h) % h;

    const alpha = isDark ? 0.04 : 0.012;
    const r = Math.max(this.rx, this.ry);
    const grad = ctx.createRadialGradient(wx, wy, 0, wx, wy, r);
    grad.addColorStop(0, `hsla(${this.hue}, 50%, 45%, ${alpha})`);
    grad.addColorStop(0.4, `hsla(${this.hue}, 40%, 35%, ${alpha * 0.3})`);
    grad.addColorStop(1, `hsla(${this.hue}, 30%, 25%, 0)`);

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.ellipse(wx, wy, this.rx, this.ry, 0, 0, Math.PI * 2);
    ctx.fill();
  }
}

/* ─── Shooting Star — cleaner trail ─────────────────────────────────── */
class ShootingStar {
  x = 0; y = 0; vx = 0; vy = 0;
  life = 0; maxLife = 0; length = 0;
  active = false;

  spawn(w: number, h: number) {
    this.x = Math.random() * w * 0.7;
    this.y = Math.random() * h * 0.3;
    const angle = Math.PI / 7 + Math.random() * Math.PI / 5;
    const speed = 5 + Math.random() * 5;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.maxLife = 30 + Math.random() * 30;
    this.life = this.maxLife;
    this.length = 40 + Math.random() * 60;
    this.active = true;
  }

  update() {
    if (!this.active) return;
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
    if (this.life <= 0) this.active = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (!this.active) return;
    const progress = this.life / this.maxLife;
    const alpha = progress * 0.5;
    const mag = Math.sqrt(this.vx ** 2 + this.vy ** 2);
    const tailX = this.x - (this.vx / mag) * this.length * progress;
    const tailY = this.y - (this.vy / mag) * this.length * progress;

    const grad = ctx.createLinearGradient(tailX, tailY, this.x, this.y);
    grad.addColorStop(0, `hsla(200, 80%, 90%, 0)`);
    grad.addColorStop(0.7, `hsla(200, 70%, 85%, ${alpha * 0.3})`);
    grad.addColorStop(1, `hsla(200, 80%, 95%, ${alpha})`);

    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.2;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(tailX, tailY);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();

    // Bright head dot
    ctx.beginPath();
    ctx.arc(this.x, this.y, 1, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(200, 80%, 95%, ${alpha})`;
    ctx.fill();
  }
}

/* ─── Main Component ────────────────────────────────────────────────── */
const Background: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const starsRef = useRef<Star[]>([]);
  const nebulaeRef = useRef<Nebula[]>([]);
  const shootingRef = useRef<ShootingStar[]>([]);
  const rafRef = useRef<number | null>(null);
  const resizeTimerRef = useRef<number | null>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let dpr = Math.max(1, window.devicePixelRatio || 1);
    let width = 0;
    let height = 0;

    function setSize() {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      const w = Math.max(window.innerWidth, 300);
      const h = Math.max(window.innerHeight, 300);
      width = w;
      height = h;
      canvas!.style.width = `${w}px`;
      canvas!.style.height = `${h}px`;
      canvas!.width = Math.round(w * dpr);
      canvas!.height = Math.round(h * dpr);
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function initEntities() {
      const area = width * height;
      // Moderate density — enough for depth, not cluttered
      const starCount = Math.max(30, Math.round(area / 4000));
      starsRef.current = Array.from({ length: starCount }, () => new Star(width, height));
      nebulaeRef.current = Array.from({ length: 3 }, () => new Nebula(width, height));
      shootingRef.current = Array.from({ length: 2 }, () => new ShootingStar());
    }

    let lastShoot = 0;

    function animate(time: number) {
      if (!ctx) return;
      const t = time * 0.001;
      const isDark = resolvedTheme === 'dark';

      ctx.clearRect(0, 0, width, height);

      // Mouse parallax — very gentle
      const mx = (mouseRef.current.x / width - 0.5) * 4;
      const my = (mouseRef.current.y / height - 0.5) * 3;

      // --- Nebulae (deepest layer) ---
      ctx.save();
      ctx.translate(mx * 0.2, my * 0.2);
      for (const neb of nebulaeRef.current) {
        neb.draw(ctx, t, width, height, isDark);
      }
      ctx.restore();

      // --- Stars with depth parallax ---
      for (const star of starsRef.current) {
        ctx.save();
        ctx.translate(mx * star.z * 0.5, my * star.z * 0.5);
        star.draw(ctx, t, isDark);
        ctx.restore();
      }

      // --- Star-to-star constellations (nearby pairs) ---
      if (isDark) {
        const stars = starsRef.current;
        const constellDist = 100;
        const constellDistSq = constellDist * constellDist;
        ctx.lineWidth = 0.4;
        ctx.lineCap = 'round';
        for (let i = 0; i < stars.length; i++) {
          for (let j = i + 1; j < stars.length; j++) {
            const dx = stars[i].x - stars[j].x;
            const dy = stars[i].y - stars[j].y;
            const distSq = dx * dx + dy * dy;
            if (distSq < constellDistSq && stars[i].z > 0.4 && stars[j].z > 0.4) {
              const alpha = (1 - distSq / constellDistSq) * 0.06;
              ctx.strokeStyle = `hsla(210, 50%, 80%, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(stars[i].x + mx * stars[i].z * 0.5, stars[i].y + my * stars[i].z * 0.5);
              ctx.lineTo(stars[j].x + mx * stars[j].z * 0.5, stars[j].y + my * stars[j].z * 0.5);
              ctx.stroke();
            }
          }
        }
      }

      // --- Shooting stars (dark only, rare) ---
      if (isDark && t - lastShoot > 6 + Math.random() * 8) {
        const idle = shootingRef.current.find(s => !s.active);
        if (idle) {
          idle.spawn(width, height);
          lastShoot = t;
        }
      }
      for (const ss of shootingRef.current) {
        ss.update();
        if (isDark) ss.draw(ctx);
      }

      // --- Mouse constellation — connect nearby stars to cursor ---
      if (mouseRef.current.x > 0 && mouseRef.current.y > 0 && isDark) {
        const grabDist = 140;
        ctx.lineWidth = 0.6;
        ctx.lineCap = 'round';
        for (const star of starsRef.current) {
          const sx = star.x + mx * star.z * 0.5;
          const sy = star.y + my * star.z * 0.5;
          const dx = sx - mouseRef.current.x;
          const dy = sy - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < grabDist) {
            const alpha = (1 - dist / grabDist) * 0.2;
            ctx.strokeStyle = `hsla(200, 60%, 75%, ${alpha})`;
            ctx.beginPath();
            ctx.moveTo(mouseRef.current.x, mouseRef.current.y);
            ctx.lineTo(sx, sy);
            ctx.stroke();
          }
        }
        // Cursor dot
        ctx.beginPath();
        ctx.arc(mouseRef.current.x, mouseRef.current.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = 'hsla(200, 60%, 80%, 0.15)';
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(animate);
    }

    function onPointerMove(e: PointerEvent) {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
    }
    function onPointerLeave() {
      mouseRef.current.x = 0;
      mouseRef.current.y = 0;
    }

    function onResize() {
      if (resizeTimerRef.current) window.clearTimeout(resizeTimerRef.current);
      resizeTimerRef.current = window.setTimeout(() => {
        setSize();
        initEntities();
      }, 120);
    }

    setSize();
    initEntities();
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerleave', onPointerLeave);
    window.addEventListener('resize', onResize);

    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', onResize);
      if (resizeTimerRef.current) window.clearTimeout(resizeTimerRef.current);
    };
  }, [resolvedTheme]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full -z-10 pointer-events-none bg-transparent"
      aria-hidden
    />
  );
};

export default Background;
