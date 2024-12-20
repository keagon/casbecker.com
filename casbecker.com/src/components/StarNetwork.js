"use client";

import { useEffect, useRef } from 'react';

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
    // Initialize velocity with random direction
    const angle = Math.random() * Math.PI * 2;
    this.vx = Math.cos(angle) * this.baseSpeed;
    this.vy = Math.sin(angle) * this.baseSpeed;
    this.opacity = Math.random() * 0.3 + 0.7;
    this.isWrapping = false;
    this.wrappingProgress = 0;
  }

  update(width, height, speedMultiplier) {
    // Update velocity based on speed multiplier
    const currentSpeed = this.baseSpeed * speedMultiplier;
    this.vx = (this.vx / Math.sqrt(this.vx * this.vx + this.vy * this.vy)) * currentSpeed;
    this.vy = (this.vy / Math.sqrt(this.vx * this.vx + this.vy * this.vy)) * currentSpeed;

    // Update position based on velocity
    this.x += this.vx * 20;
    this.y += this.vy * 20;

    // Handle wrapping with fade effect
    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      if (!this.isWrapping) {
        this.isWrapping = true;
        this.wrappingProgress = 1; // Start fade out
      }
    }

    if (this.isWrapping) {
      this.wrappingProgress -= 0.05; // Adjust this value to control fade speed
      if (this.wrappingProgress <= 0) {
        this.isWrapping = false;
        this.wrappingProgress = 0;
        // Reset position
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Add color interpolation helper
    const interpolateColor = (progress) => {
      // accent-500: rgb(199, 118, 56)
      // primary-500: rgb(77, 156, 179)
      const r1 = 199, g1 = 118, b1 = 56;  // accent color
      const r2 = 77, g2 = 156, b2 = 179;  // primary color
      
      const r = Math.round(r1 + (r2 - r1) * progress);
      const g = Math.round(g1 + (g2 - g1) * progress);
      const b = Math.round(b1 + (b2 - b1) * progress);
      
      return `rgb(${r}, ${g}, ${b})`;
    };

    // Handle scroll position
    const handleScroll = () => {
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.scrollY;
      const progress = scrollHeight > 0 ? Math.min(Math.max(currentScroll / scrollHeight, 0), 1) : 0;
      scrollProgressRef.current = progress;
      
 
    };

    // Setup canvas
    const updateCanvasSize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
      return { width: rect.width, height: rect.height };
    };

    let { width, height } = updateCanvasSize();

    // Initialize stars
    const initStars = () => {
      const stars = [];
      const numStars = Math.floor((width * height) / 18000);
      


      for (let i = 0; i < numStars; i++) {
        stars.push(new Star(
          Math.random() * width,
          Math.random() * height,
          Math.random() * 2 + 1.5,
          Math.random() * 0.02
        ));
      }
      return stars;
    };

    const handleResize = () => {
      const dims = updateCanvasSize();
      width = dims.width;
      height = dims.height;
      starsRef.current = initStars();
      
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      const speedMultiplier = Math.max(0.3, 1 - scrollProgressRef.current);
      const currentColor = interpolateColor(scrollProgressRef.current);
      
      // Update stars drawing
      starsRef.current.forEach((star, index) => {
        star.update(width, height, speedMultiplier);
        
        const finalOpacity = star.isWrapping ? 
          star.opacity * star.wrappingProgress : 
          star.opacity;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${currentColor.slice(0, -1)}, ${finalOpacity})`;
        ctx.fill();
      });

      // Update connections drawing
      ctx.lineWidth = 0.8;
      starsRef.current.forEach((star1, i) => {
        for (let j = i + 1; j < starsRef.current.length; j++) {
          const star2 = starsRef.current[j];
          const dx = star1.x - star2.x;
          const dy = star1.y - star2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 150) {
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            let opacity = (1 - distance / 150) * 0.5;
            if (star1.isWrapping || star2.isWrapping) {
              opacity *= Math.min(star1.wrappingProgress || 1, star2.wrappingProgress || 1);
            }
            ctx.strokeStyle = `${currentColor.slice(0, -1)}, ${opacity})`;
            ctx.stroke();
          }
        }
      });

      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Initialize
    starsRef.current = initStars();
    window.addEventListener('resize', handleResize);
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize scroll position
    draw();


    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      
  
    };
  }, []); // Empty dependency array since we're using refs

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