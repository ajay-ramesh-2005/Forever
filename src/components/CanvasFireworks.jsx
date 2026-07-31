import React, { useEffect, useRef } from 'react';

export default function CanvasFireworks() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle classes
    class FireworkParticle {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6 + 1.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.alpha = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 3 + 1.5;
      }
      update() {
        this.vx *= 0.96;
        this.vy *= 0.96;
        this.vy += 0.05; // gravity
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }
      draw(context) {
        context.save();
        context.globalAlpha = Math.max(this.alpha, 0);
        context.fillStyle = this.color;
        context.shadowBlur = 12;
        context.shadowColor = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    class Rocket {
      constructor() {
        this.x = Math.random() * width;
        this.y = height;
        this.targetY = Math.random() * (height * 0.4) + height * 0.1;
        this.speed = Math.random() * 5 + 7;
        this.color = ['#f43f5e', '#ec4899', '#a855f7', '#fbbf24', '#38bdf8', '#34d399'][
          Math.floor(Math.random() * 6)
        ];
        this.exploded = false;
      }
      update() {
        this.y -= this.speed;
        if (this.y <= this.targetY) {
          this.exploded = true;
        }
      }
      draw(context) {
        context.save();
        context.fillStyle = this.color;
        context.shadowBlur = 10;
        context.shadowColor = this.color;
        context.beginPath();
        context.arc(this.x, this.y, 3, 0, Math.PI * 2);
        context.fill();
        context.restore();
      }
    }

    class UpwardHeart {
      constructor() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.speed = Math.random() * 1.5 + 0.8;
        this.size = Math.random() * 14 + 10;
        this.alpha = Math.random() * 0.7 + 0.3;
        this.symbol = ['💖', '💕', '✨', '🌸', '💗'][Math.floor(Math.random() * 5)];
      }
      update() {
        this.y -= this.speed;
        this.x += Math.sin(this.y * 0.02) * 0.8;
        if (this.y < -50) {
          this.y = height + 20;
          this.x = Math.random() * width;
        }
      }
      draw(context) {
        context.save();
        context.globalAlpha = this.alpha;
        context.font = `${this.size}px sans-serif`;
        context.fillText(this.symbol, this.x, this.y);
        context.restore();
      }
    }

    const rockets = [];
    const particles = [];
    const upwardHearts = Array.from({ length: 30 }, () => new UpwardHeart());

    const loop = () => {
      ctx.fillStyle = 'rgba(11, 6, 18, 0.2)';
      ctx.fillRect(0, 0, width, height);

      // Launch rockets periodically
      if (Math.random() < 0.08) {
        rockets.push(new Rocket());
      }

      // Update rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        r.draw(ctx);
        if (r.exploded) {
          // Explode
          for (let p = 0; p < 45; p++) {
            particles.push(new FireworkParticle(r.x, r.y, r.color));
          }
          rockets.splice(i, 1);
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.update();
        p.draw(ctx);
        if (p.alpha <= 0) {
          particles.splice(i, 1);
        }
      }

      // Draw upward hearts
      upwardHearts.forEach((h) => {
        h.update();
        h.draw(ctx);
      });

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-10 w-full h-full"
    />
  );
}
