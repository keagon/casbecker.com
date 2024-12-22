"use client";

import { useEffect, useRef, useCallback, useMemo } from 'react';

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  getDistance({ x: x2, y: y2 }) {
    const a = this.x - x2;
    const b = this.y - y2;
    return Math.sqrt(a * a + b * b);
  }
}

class Star {
  constructor(x, y, radius, speed) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.baseSpeed = speed;
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * this.baseSpeed;
    this.vy = Math.sin(angle) * this.baseSpeed;
    this.opacity = Math.random() * 0.3 + 0.7;
    this.isWrapping = false;
    this.wrappingProgress = 0;
  }

  update(width, height, speedMultiplier) {
    const currentSpeed = this.baseSpeed * speedMultiplier;
    const velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    this.vx = (this.vx / velocity) * currentSpeed;
    this.vy = (this.vy / velocity) * currentSpeed;

    this.x += this.vx * 20;
    this.y += this.vy * 20;

    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      if (!this.isWrapping) {
        this.isWrapping = true;
        this.wrappingProgress = 1;
      }
    }

    if (this.isWrapping) {
      this.wrappingProgress -= 0.05;
      if (this.wrappingProgress <= 0) {
        this.isWrapping = false;
        this.wrappingProgress = 0;
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
        if (this.y < 0) this.y = height;
        if (this.y > height) this.y = 0;
      }
    }
  }
}

export default function StarNetwork() {
  const canvasRef = useRef(null);
  const starsRef = useRef([]);
  const animationFrameRef = useRef();
  const scrollProgressRef = useRef(0);
  const contextRef = useRef(null);

  const interpolateColor = useCallback((progress) => {
    const r1 = 199, g1 = 118, b1 = 56;  // accent color
    const r2 = 77, g2 = 156, b2 = 179;  // primary color
    
    const r = Math.round(r1 + (r2 - r1) * progress);
    const g = Math.round(g1 + (g2 - g1) * progress);
    const b = Math.round(b1 + (b2 - b1) * progress);
    
    return `rgb(${r}, ${g}, ${b})`;
  }, []);

  const handleScroll = useCallback(() => {
    if (!scrollProgressRef.current.ticking) {
      window.requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        scrollProgressRef.current.value = scrollHeight > 0 ? Math.min(Math.max(currentScroll / scrollHeight, 0), 1) : 0;
        scrollProgressRef.current.ticking = false;
      });
      scrollProgressRef.current.ticking = true;
    }
  }, []);

  const initStars = useCallback((width, height) => {
    const isMobile = width <= 768;
    const baseStarDensity = 9000;
    const starDensity = isMobile ? baseStarDensity / 2 : baseStarDensity;
    const numStars = Math.floor((width * height) / starDensity);
    
    return Array.from({ length: numStars }, () => {
      const baseSpeed = Math.random() * 0.03;
      const speed = isMobile ? baseSpeed * 1.5 : baseSpeed;
      return new Star(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 2 + 1.5,
        speed
      );
    });
  }, []);

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { width: 0, height: 0 };

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);
    contextRef.current = ctx;
    
    return { width: rect.width, height: rect.height };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) return;

    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    
    const speedMultiplier = Math.max(0.05, 1 - scrollProgressRef.current.value);
    const currentColor = interpolateColor(scrollProgressRef.current.value);
    
    starsRef.current.forEach(star => {
      star.update(width, height, speedMultiplier);
      
      const finalOpacity = star.isWrapping ? 
        star.opacity * star.wrappingProgress : 
        star.opacity;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${currentColor.slice(0, -1)}, ${finalOpacity})`;
      ctx.fill();
    });

    ctx.lineWidth = 0.8;
    const maxDistance = 150;
    const maxDistanceSquared = maxDistance * maxDistance;

    for (let i = 0; i < starsRef.current.length; i++) {
      const star1 = starsRef.current[i];
      for (let j = i + 1; j < starsRef.current.length; j++) {
        const star2 = starsRef.current[j];
        const dx = star1.x - star2.x;
        const dy = star1.y - star2.y;
        const distanceSquared = dx * dx + dy * dy;
        
        if (distanceSquared < maxDistanceSquared) {
          const distance = Math.sqrt(distanceSquared);
          let opacity = (1 - distance / maxDistance) * 0.5;
          if (star1.isWrapping || star2.isWrapping) {
            opacity *= Math.min(star1.wrappingProgress || 1, star2.wrappingProgress || 1);
          }
          
          if (opacity > 0.05) {
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.strokeStyle = `${currentColor.slice(0, -1)}, ${opacity})`;
            ctx.stroke();
          }
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [interpolateColor]);

  useEffect(() => {
    scrollProgressRef.current = { value: 0, ticking: false };
    const { width, height } = updateCanvasSize();
    starsRef.current = initStars(width, height);

    const handleResize = () => {
      const dims = updateCanvasSize();
      starsRef.current = initStars(dims.width, dims.height);
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    draw();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateCanvasSize, initStars, handleScroll, draw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ 
        backgroundColor: '#091011',
        opacity: 1
      }}
    />
  );
} 