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
    this.originalX = x;
    this.originalY = y;
  }

  update(width, height, speedMultiplier, deltaTime) {
    // Use deltaTime to ensure consistent movement regardless of frame rate
    const timeScale = deltaTime / 16.667; // Normalize to 60fps
    
    const currentSpeed = this.baseSpeed * speedMultiplier;
    const velocity = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
    
    // Avoid division by zero
    if (velocity > 0.0001) {
      this.vx = (this.vx / velocity) * currentSpeed;
      this.vy = (this.vy / velocity) * currentSpeed;
    }

    this.x += this.vx * 20 * timeScale;
    this.y += this.vy * 20 * timeScale;

    if (this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      if (!this.isWrapping) {
        this.isWrapping = true;
        this.wrappingProgress = 1;
      }
    }

    if (this.isWrapping) {
      this.wrappingProgress -= 0.05 * timeScale;
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
  const scrollProgressRef = useRef({ value: 0, ticking: false });
  const contextRef = useRef(null);
  const lastFrameTimeRef = useRef(0);
  const isVisibleRef = useRef(true);
  const gridRef = useRef(null); // For spatial partitioning to optimize connections

  // Memoize the color interpolation function to prevent unnecessary recreation
  const interpolateColor = useMemo(() => {
    return (progress) => {
      const r1 = 199, g1 = 118, b1 = 56;  // accent color
      const r2 = 77, g2 = 156, b2 = 179;  // primary color
      
      const r = Math.round(r1 + (r2 - r1) * progress);
      const g = Math.round(g1 + (g2 - g1) * progress);
      const b = Math.round(b1 + (b2 - b1) * progress);
      
      return `rgb(${r}, ${g}, ${b})`;
    };
  }, []);

  // Throttled scroll handler to avoid performance issues
  const handleScroll = useCallback(() => {
    if (!scrollProgressRef.current.ticking) {
      scrollProgressRef.current.ticking = true;
      window.requestAnimationFrame(() => {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const currentScroll = window.scrollY;
        const newValue = scrollHeight > 0 ? Math.min(Math.max(currentScroll / scrollHeight, 0), 0.99) : 0;
        scrollProgressRef.current.value = newValue;
        scrollProgressRef.current.ticking = false;
      });
    }
  }, []);

  const initStars = useCallback((width, height) => {
    const isMobile = width <= 768;
    // Adjusted star density to be more efficient on all devices
    const baseStarDensity = isMobile ? 12000 : 9000;
    const numStars = Math.max(10, Math.floor((width * height) / baseStarDensity));
    
    return Array.from({ length: numStars }, () => {
      const baseSpeed = Math.random() * 0.03;
      const speed = isMobile ? baseSpeed * 1.2 : baseSpeed;
      return new Star(
        Math.random() * width,
        Math.random() * height,
        Math.random() * 1.5 + (isMobile ? 1.5 : 1.8),
        speed
      );
    });
  }, []);

  // Spatial partitioning to optimize connection calculations
  const updateSpatialGrid = useCallback((stars, width, height, cellSize = 150) => {
    const grid = {};
    const numCols = Math.ceil(width / cellSize);
    const numRows = Math.ceil(height / cellSize);
    
    stars.forEach((star, index) => {
      const cellX = Math.floor(star.x / cellSize);
      const cellY = Math.floor(star.y / cellSize);
      
      // Handle out-of-bounds stars
      if (cellX < 0 || cellX >= numCols || cellY < 0 || cellY >= numRows) return;
      
      const cellKey = `${cellX},${cellY}`;
      if (!grid[cellKey]) grid[cellKey] = [];
      grid[cellKey].push(index);
    });
    
    return { grid, numCols, numRows, cellSize };
  }, []);

  const updateCanvasSize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { width: 0, height: 0 };

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    // Only resize if there's a substantial change in dimensions
    if (canvas.width !== rect.width * dpr || canvas.height !== rect.height * dpr) {
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d', { alpha: true });
      ctx.scale(dpr, dpr);
      contextRef.current = ctx;
    }
    
    return { width: rect.width, height: rect.height };
  }, []);

  const draw = useCallback((timestamp) => {
    if (!isVisibleRef.current) {
      animationFrameRef.current = requestAnimationFrame(draw);
      return;
    }
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!canvas || !ctx) {
      animationFrameRef.current = requestAnimationFrame(draw);
      return;
    }

    // Calculate delta time for smooth animation regardless of frame rate
    const deltaTime = lastFrameTimeRef.current ? timestamp - lastFrameTimeRef.current : 16.667;
    lastFrameTimeRef.current = timestamp;
    
    // Ensure delta time is reasonable (e.g., when tab was in background)
    const cappedDeltaTime = Math.min(deltaTime, 100);

    const { width, height } = canvas.getBoundingClientRect();
    ctx.clearRect(0, 0, width, height);
    
    const speedMultiplier = Math.max(0.05, 1 - scrollProgressRef.current.value);
    const currentColor = interpolateColor(scrollProgressRef.current.value);
    
    // Update stars
    starsRef.current.forEach(star => {
      star.update(width, height, speedMultiplier, cappedDeltaTime);
    });
    
    // Update spatial grid for efficient connection calculations
    const spatialData = updateSpatialGrid(starsRef.current, width, height);
    gridRef.current = spatialData;
    
    // Draw stars
    starsRef.current.forEach(star => {
      const finalOpacity = star.isWrapping ? 
        star.opacity * star.wrappingProgress : 
        star.opacity;

      ctx.beginPath();
      ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
      ctx.fillStyle = `${currentColor.slice(0, -1)}, ${finalOpacity})`;
      ctx.fill();
    });

    // Draw connections more efficiently using spatial partitioning
    ctx.lineWidth = 0.8;
    const maxDistance = 150;
    const maxDistanceSquared = maxDistance * maxDistance;
    const { grid, numCols, numRows, cellSize } = spatialData;

    // Check connections only within and between neighboring cells
    const checkedPairs = new Set();
    
    for (let cellY = 0; cellY < numRows; cellY++) {
      for (let cellX = 0; cellX < numCols; cellX++) {
        const cellKey = `${cellX},${cellY}`;
        const cellIndices = grid[cellKey] || [];
        
        // Check connections within the same cell
        for (let i = 0; i < cellIndices.length; i++) {
          const idx1 = cellIndices[i];
          const star1 = starsRef.current[idx1];
          
          for (let j = i + 1; j < cellIndices.length; j++) {
            const idx2 = cellIndices[j];
            const pairKey = idx1 < idx2 ? `${idx1},${idx2}` : `${idx2},${idx1}`;
            
            if (checkedPairs.has(pairKey)) continue;
            checkedPairs.add(pairKey);
            
            const star2 = starsRef.current[idx2];
            drawConnectionIfClose(star1, star2, maxDistanceSquared, maxDistance, ctx, currentColor);
          }
        }
        
        // Check connections with neighboring cells
        for (let ny = Math.max(0, cellY - 1); ny <= Math.min(numRows - 1, cellY + 1); ny++) {
          for (let nx = Math.max(0, cellX - 1); nx <= Math.min(numCols - 1, cellX + 1); nx++) {
            // Skip the current cell as we've already processed it
            if (nx === cellX && ny === cellY) continue;
            
            const neighborKey = `${nx},${ny}`;
            const neighborIndices = grid[neighborKey] || [];
            
            for (let i = 0; i < cellIndices.length; i++) {
              const idx1 = cellIndices[i];
              const star1 = starsRef.current[idx1];
              
              for (let j = 0; j < neighborIndices.length; j++) {
                const idx2 = neighborIndices[j];
                const pairKey = idx1 < idx2 ? `${idx1},${idx2}` : `${idx2},${idx1}`;
                
                if (checkedPairs.has(pairKey)) continue;
                checkedPairs.add(pairKey);
                
                const star2 = starsRef.current[idx2];
                drawConnectionIfClose(star1, star2, maxDistanceSquared, maxDistance, ctx, currentColor);
              }
            }
          }
        }
      }
    }

    function drawConnectionIfClose(star1, star2, maxDistanceSquared, maxDistance, ctx, color) {
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
          ctx.strokeStyle = `${color.slice(0, -1)}, ${opacity})`;
          ctx.stroke();
        }
      }
    }

    animationFrameRef.current = requestAnimationFrame(draw);
  }, [interpolateColor, updateSpatialGrid]);

  // Throttled resize handler
  const handleResize = useCallback(() => {
    if (!canvasRef.current) return;
    
    const dims = updateCanvasSize();
    if (dims.width === 0 || dims.height === 0) return;
    
    const currentStars = starsRef.current.length;
    const idealStars = Math.floor((dims.width * dims.height) / (dims.width <= 768 ? 12000 : 9000));
    
    // Only recreate stars if there's a significant change in the ideal number
    if (Math.abs(currentStars - idealStars) > idealStars * 0.2 || currentStars === 0) {
      starsRef.current = initStars(dims.width, dims.height);
    }
  }, [updateCanvasSize, initStars]);

  // Handle visibility changes to pause animation when tab is not visible
  const handleVisibilityChange = useCallback(() => {
    isVisibleRef.current = document.visibilityState === 'visible';
    
    // Reset last frame time when becoming visible again to prevent large delta time
    if (isVisibleRef.current) {
      lastFrameTimeRef.current = 0;
    }
  }, []);

  // Throttle the resize function
  const throttledResize = useCallback(() => {
    let resizeTimer;
    return () => {
      if (resizeTimer) return;
      resizeTimer = setTimeout(() => {
        handleResize();
        resizeTimer = null;
      }, 200);
    };
  }, [handleResize]);

  useEffect(() => {
    // Initialize values
    scrollProgressRef.current = { value: 0, ticking: false };
    isVisibleRef.current = document.visibilityState === 'visible';
    lastFrameTimeRef.current = 0;
    
    // Setup event listeners with proper cleanup
    const throttledResizeHandler = throttledResize();
    window.addEventListener('resize', throttledResizeHandler);
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Initial setup
    const { width, height } = updateCanvasSize();
    starsRef.current = initStars(width, height);
    
    // Start animation
    animationFrameRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', throttledResizeHandler);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [updateCanvasSize, initStars, handleScroll, draw, handleVisibilityChange, throttledResize]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ 
        backgroundColor: '#091011',
        opacity: 1,
        transform: 'translateZ(0)',
        willChange: 'transform',
        WebkitFontSmoothing: 'antialiased',
        imageRendering: 'pixelated'
      }}
    />
  );
} 