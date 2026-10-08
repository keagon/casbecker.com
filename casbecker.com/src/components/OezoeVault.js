'use client';

import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

const WARDS = [
  {
    id: 'cinderfowl',
    name: 'The Cinderfowl',
    trueName: 'BRAND',
    where: 'beside the hearth',
    blurb: 'A plucky red bird that nests in warm ashes.',
  },
  {
    id: 'mossskitter',
    name: 'The Moss-Skitter',
    trueName: 'FEN',
    where: 'in the bedchamber',
    blurb: 'A quick green thing that hides where you least look.',
  },
  {
    id: 'thimblekin',
    name: 'The Thimblekin',
    trueName: 'HEM',
    where: 'in the smallest room',
    blurb: 'A tiny guardian that sleeps inside a house of cloth.',
  },
  {
    id: 'glimmerkin',
    name: 'The Glimmerkin',
    trueName: 'MORROW',
    where: 'behind the looking-glass',
    blurb: 'A pale creature whose reflection is always a half-second late.',
  },
];

const FINAL_RIDDLE =
  'All four true names spoken, the vault remembers. The key waits where the house breathes — behind the gasmeter, in the little cupboard by the first stairwell, a step below the first floor.';

const KEYS = [
  'A', 'B', 'C', 'D', 'E', 'F',
  'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z', 'CLR', 'BACK', 'OK', 'HINT',
];

function makeTextTexture(text, opts = {}) {
  const {
    w = 128,
    h = 128,
    bg = '#17110a',
    border = '#c9a227',
    color = '#e9c96b',
    font = 'bold 62px Georgia, serif',
    pad = 8,
    round = 16,
    glow = false,
  } = opts;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);
  if (border) {
    ctx.strokeStyle = border;
    ctx.lineWidth = Math.max(2, Math.round(w * 0.03));
    ctx.beginPath();
    ctx.roundRect(pad, pad, w - pad * 2, h - pad * 2, round);
    ctx.stroke();
  }
  ctx.fillStyle = color;
  ctx.font = font;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (glow) {
    ctx.shadowColor = color;
    ctx.shadowBlur = 18;
  }
  ctx.fillText(text, w / 2, h / 2 + 2);
  const tex = new THREE.CanvasTexture(canvas);
  tex.anisotropy = 4;
  return tex;
}

function makeFireTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,240,200,1)');
  g.addColorStop(0.3, 'rgba(255,170,60,0.9)');
  g.addColorStop(0.7, 'rgba(220,80,20,0.35)');
  g.addColorStop(1, 'rgba(120,30,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  return new THREE.CanvasTexture(canvas);
}

export default function OezoeVault() {
  const mountRef = useRef(null);
  const audioRef = useRef(null);
  const screenRef = useRef(null);
  const doorRef = useRef(null);
  const fireRef = useRef(null);
  const buttonsRef = useRef([]);
  const keyHandlerRef = useRef(() => {});
  const openRef = useRef(false);
  const foundRef = useRef([]);

  const [entered, setEntered] = useState('');
  const [found, setFound] = useState([]);
  const [open, setOpen] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [audioState, setAudioState] = useState('idle');
  const [hint, setHint] = useState('');
  const [ready, setReady] = useState(false);

  useEffect(() => { foundRef.current = found; }, [found]);
  useEffect(() => { openRef.current = open; }, [open]);

  keyHandlerRef.current = (key) => {
    if (openRef.current) return;
    if (key === 'CLR') { setEntered(''); setHint(''); return; }
    if (key === 'BACK') { setEntered((e) => e.slice(0, -1)); return; }
    if (key === 'OK') {
      if (!entered) setHint('The vault waits for a true name.');
      return;
    }
    if (key === 'HINT') {
      const remaining = WARDS.filter((w) => !foundRef.current.includes(w.id));
      if (!remaining.length) { setHint('All four true names have been found.'); return; }
      const w = remaining[0];
      setHint(`${w.name} is ${w.where}. Its true name begins with ${w.trueName[0]}.`);
      return;
    }
    if (/^[A-Z]$/.test(key)) {
      setHint('');
      setEntered((e) => (e.length >= 12 ? e : e + key));
    }
  };

  useEffect(() => {
    const code = entered.toUpperCase();
    if (!code) return;
    const match = WARDS.find(
      (w) => w.trueName === code && !foundRef.current.includes(w.id)
    );
    if (match) {
      setFound((f) => (f.includes(match.id) ? f : [...f, match.id]));
      setEntered('');
      setHint(`${match.name} answers: ${match.trueName}.`);
    }
  }, [entered]);

  useEffect(() => {
    if (found.length === WARDS.length && !openRef.current) setOpen(true);
  }, [found]);

  useEffect(() => {
    if (open && audioRef.current) {
      const p = audioRef.current.play();
      if (p && typeof p.then === 'function') {
        p.then(() => setAudioState('playing')).catch(() => setAudioState('missing'));
      }
    }
  }, [open]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      setWebglFailed(true);
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x08060a);
    scene.fog = new THREE.FogExp2(0x0a0708, 0.075);

    const camera = new THREE.PerspectiveCamera(52, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1.75, 4.4);

    const ambient = new THREE.AmbientLight(0x3a2b4a, 0.5);
    scene.add(ambient);
    const moon = new THREE.DirectionalLight(0x5b6bd6, 0.35);
    moon.position.set(-4, 6, 3);
    scene.add(moon);

    // Room
    const floorMat = new THREE.MeshStandardMaterial({ color: 0x1a0f0a, roughness: 0.95, metalness: 0.05 });
    const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 30), floorMat);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x140d14, roughness: 1 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 12), wallMat);
    backWall.position.set(0, 6, -2.2);
    scene.add(backWall);
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 12), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-6.5, 6, 0);
    scene.add(leftWall);
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(24, 12), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(6.5, 6, 0);
    scene.add(rightWall);

    // Rug
    const rug = new THREE.Mesh(
      new THREE.CircleGeometry(2.6, 48),
      new THREE.MeshStandardMaterial({ color: 0x2a0f14, roughness: 1 })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.01, 0.6);
    scene.add(rug);

    // Fireplace (left)
    const stoneMat = new THREE.MeshStandardMaterial({ color: 0x2b2522, roughness: 0.95 });
    const fireplace = new THREE.Group();
    fireplace.position.set(-3.2, 0, -1.9);
    const hearthBase = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.35, 1.2), stoneMat);
    hearthBase.position.set(0, 0.18, 0.35);
    fireplace.add(hearthBase);
    const pillarL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.6, 1.0), stoneMat);
    pillarL.position.set(-1.05, 1.3, 0);
    fireplace.add(pillarL);
    const pillarR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 2.6, 1.0), stoneMat);
    pillarR.position.set(1.05, 1.3, 0);
    fireplace.add(pillarR);
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.45, 1.0), stoneMat);
    lintel.position.set(0, 2.7, 0);
    fireplace.add(lintel);
    const mantel = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.16, 1.25), new THREE.MeshStandardMaterial({ color: 0x3a2a1c, roughness: 0.7 }));
    mantel.position.set(0, 3.0, 0.15);
    fireplace.add(mantel);
    const firebox = new THREE.Mesh(
      new THREE.BoxGeometry(1.8, 1.9, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x0a0505, emissive: 0x3a1000, emissiveIntensity: 0.7, roughness: 1 })
    );
    firebox.position.set(0, 1.35, -0.35);
    fireplace.add(firebox);
    scene.add(fireplace);

    // Fire particles
    const FIRE_COUNT = 320;
    const fireGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(FIRE_COUNT * 3);
    const colors = new Float32Array(FIRE_COUNT * 3);
    const speeds = new Float32Array(FIRE_COUNT);
    const baseX = new Float32Array(FIRE_COUNT);
    const baseZ = new Float32Array(FIRE_COUNT);
    for (let i = 0; i < FIRE_COUNT; i++) {
      const spread = 0.75;
      baseX[i] = (Math.random() - 0.5) * spread;
      baseZ[i] = (Math.random() - 0.5) * spread;
      positions[i * 3] = baseX[i] + fireplace.position.x;
      positions[i * 3 + 1] = 0.35 + Math.random() * 2.0;
      positions[i * 3 + 2] = baseZ[i] + fireplace.position.z + 0.2;
      speeds[i] = 0.35 + Math.random() * 0.75;
      const t = Math.random();
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.35 + t * 0.5;
      colors[i * 3 + 2] = 0.05 + t * 0.15;
    }
    fireGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    fireGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const fireMat = new THREE.PointsMaterial({
      size: 0.34,
      map: makeFireTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.92,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const fire = new THREE.Points(fireGeo, fireMat);
    scene.add(fire);
    fireRef.current = { fire, positions, speeds, baseX, baseZ, fireplace };

    const fireLight = new THREE.PointLight(0xff7a26, 3.2, 12, 2);
    fireLight.position.set(-3.2, 1.1, -1.4);
    scene.add(fireLight);
    scene.userData.fireLight = fireLight;

    // Dust
    const DUST = 260;
    const dustGeo = new THREE.BufferGeometry();
    const dustPos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 12;
      dustPos[i * 3 + 1] = Math.random() * 6;
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
    const dust = new THREE.Points(
      dustGeo,
      new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.03, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending })
    );
    scene.add(dust);

    // Vault (right of back wall)
    const vault = new THREE.Group();
    const vaultX = 2.6;
    const vaultY = 1.7;
    const vaultZ = -2.05;
    const frame = new THREE.Mesh(
      new THREE.CylinderGeometry(1.02, 1.02, 0.22, 48),
      new THREE.MeshStandardMaterial({ color: 0x2a2a30, metalness: 0.9, roughness: 0.35 })
    );
    frame.rotation.x = Math.PI / 2;
    frame.position.set(vaultX, vaultY, vaultZ);
    vault.add(frame);

    const cavity = new THREE.Mesh(
      new THREE.CircleGeometry(0.9, 48),
      new THREE.MeshStandardMaterial({ color: 0x1a0e05, emissive: 0xffb24d, emissiveIntensity: 0.0, roughness: 1 })
    );
    cavity.position.set(vaultX, vaultY, vaultZ + 0.02);
    vault.add(cavity);
    vault.userData.cavity = cavity;

    const doorGroup = new THREE.Group();
    doorGroup.position.set(vaultX + 1.0, vaultY, vaultZ + 0.12);
    const door = new THREE.Mesh(
      new THREE.CylinderGeometry(0.98, 0.98, 0.18, 48),
      new THREE.MeshStandardMaterial({ color: 0x3b3b44, metalness: 0.95, roughness: 0.28 })
    );
    door.rotation.x = Math.PI / 2;
    door.position.set(-1.0, 0, 0);
    doorGroup.add(door);
    const wheel = new THREE.Mesh(
      new THREE.TorusGeometry(0.34, 0.05, 12, 32),
      new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 1, roughness: 0.3 })
    );
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(-1.0, 0, 0.16);
    doorGroup.add(wheel);
    for (let i = 0; i < 4; i++) {
      const spoke = new THREE.Mesh(
        new THREE.BoxGeometry(0.62, 0.05, 0.05),
        new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 1, roughness: 0.3 })
      );
      spoke.position.set(-1.0, 0, 0.16);
      spoke.rotation.z = (i * Math.PI) / 4;
      doorGroup.add(spoke);
    }
    vault.add(doorGroup);
    doorRef.current = doorGroup;
    scene.add(vault);

    // Keypad console
    const console3d = new THREE.Group();
    console3d.position.set(2.4, 0.95, 0.15);
    console3d.rotation.x = -0.55;
    const panelMat = new THREE.MeshStandardMaterial({ color: 0x161018, metalness: 0.6, roughness: 0.5 });
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.42, 1.5, 0.08), panelMat);
    panel.position.set(0, 0.12, 0);
    console3d.add(panel);

    // Screen
    const screenCanvas = document.createElement('canvas');
    screenCanvas.width = 512;
    screenCanvas.height = 180;
    const screenCtx = screenCanvas.getContext('2d');
    const screenTex = new THREE.CanvasTexture(screenCanvas);
    const screen = new THREE.Mesh(
      new THREE.PlaneGeometry(1.24, 0.42),
      new THREE.MeshBasicMaterial({ map: screenTex })
    );
    screen.position.set(0, 0.66, 0.055);
    console3d.add(screen);
    screenRef.current = { ctx: screenCtx, tex: screenTex, canvas: screenCanvas };

    // Buttons
    buttonsRef.current = [];
    const cols = 6;
    const rows = 5;
    const bw = 0.2;
    const gap = 0.028;
    const pad = 0.09;
    const startX = (-(cols - 1) * (bw + gap)) / 2;
    const startY = 0.4;
    KEYS.forEach((key, idx) => {
      const c = idx % cols;
      const r = Math.floor(idx / cols);
      const isAction = key.length > 1;
      const tex = makeTextTexture(key, {
        w: 128,
        h: 128,
        font: isAction ? 'bold 34px Georgia, serif' : 'bold 70px Georgia, serif',
        border: isAction ? '#7a5a00' : '#c9a227',
        color: isAction ? '#b8933a' : '#e9c96b',
        bg: '#140f18',
      });
      const frontMat = new THREE.MeshStandardMaterial({
        map: tex,
        emissive: 0xc9a227,
        emissiveIntensity: 0.12,
        roughness: 0.5,
        metalness: 0.3,
      });
      const sideMat = new THREE.MeshStandardMaterial({ color: 0x0c0810, roughness: 0.7 });
      const mats = [sideMat, sideMat, sideMat, sideMat, frontMat, sideMat];
      const btn = new THREE.Mesh(new THREE.BoxGeometry(bw, bw, 0.07), mats);
      btn.position.set(startX + c * (bw + gap), startY - r * (bw + gap), 0.07);
      btn.userData = { key, press: 0 };
      console3d.add(btn);
      buttonsRef.current.push(btn);
    });
    scene.add(console3d);

    // Interaction
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const onPointerDown = (ev) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointer.x = ((ev.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((ev.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(buttonsRef.current, false);
      if (hits.length) {
        const btn = hits[0].object;
        btn.userData.press = 1;
        keyHandlerRef.current(btn.userData.key);
      }
    };
    const onKeyDown = (ev) => {
      if (ev.key === 'Backspace') { ev.preventDefault(); keyHandlerRef.current('BACK'); return; }
      if (ev.key === 'Delete') { keyHandlerRef.current('CLR'); return; }
      if (ev.key === 'Enter') { keyHandlerRef.current('OK'); return; }
      if (/^[a-zA-Z]$/.test(ev.key)) keyHandlerRef.current(ev.key.toUpperCase());
    };
    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('keydown', onKeyDown);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    // Screen drawing
    const drawScreen = () => {
      const { ctx, canvas, tex } = screenRef.current;
      const w = canvas.width;
      const h = canvas.height;
      ctx.fillStyle = '#0b0710';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#7a5a00';
      ctx.lineWidth = 6;
      ctx.strokeRect(6, 6, w - 12, h - 12);
      ctx.textAlign = 'center';
      if (openRef.current) {
        ctx.fillStyle = '#ffd77a';
        ctx.font = 'bold 64px Georgia, serif';
        ctx.shadowColor = '#ffb24d';
        ctx.shadowBlur = 22;
        ctx.fillText('VAULT OPEN', w / 2, h / 2 - 6);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#c9a227';
        ctx.font = '28px Georgia, serif';
        ctx.fillText('the true names are spoken', w / 2, h / 2 + 46);
      } else {
        const shown = entered || '_ _ _ _';
        ctx.fillStyle = '#e9c96b';
        ctx.font = 'bold 74px "Courier New", monospace';
        ctx.shadowColor = '#c9a227';
        ctx.shadowBlur = 14;
        ctx.fillText(shown, w / 2, h / 2 + 4);
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#9a8a5a';
        ctx.font = '26px Georgia, serif';
        ctx.fillText(`${foundRef.current.length} of 4 true names found`, w / 2, h / 2 + 62);
      }
      tex.needsUpdate = true;
    };

    const clock = new THREE.Clock();
    let raf = 0;
    const baseCam = camera.position.clone();
    const target = new THREE.Vector3(0.6, 1.5, -1);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // Fire
      const f = fireRef.current;
      if (f) {
        const pos = f.positions;
        for (let i = 0; i < FIRE_COUNT; i++) {
          pos[i * 3 + 1] += f.speeds[i] * dt * 1.6;
          pos[i * 3] += Math.sin(t * 3 + i) * dt * 0.12;
          if (pos[i * 3 + 1] > 2.6) {
            pos[i * 3 + 1] = 0.3;
            pos[i * 3] = f.fireplace.position.x + f.baseX[i];
            pos[i * 3 + 2] = f.fireplace.position.z + 0.2 + f.baseZ[i] * 0.6;
          }
        }
        fireGeo.attributes.position.needsUpdate = true;
        fireMat.opacity = 0.78 + Math.sin(t * 12) * 0.08 + Math.random() * 0.06;
        fire.rotation.y = Math.sin(t * 0.6) * 0.06;
      }
      const fl = scene.userData.fireLight;
      if (fl) fl.intensity = 3.0 + Math.sin(t * 9.3) * 0.5 + Math.random() * 0.5;

      // Ember/ambient flicker
      ambient.intensity = 0.45 + Math.sin(t * 7) * 0.05 + Math.random() * 0.03;

      // Dust drift
      dust.rotation.y = t * 0.02;

      // Door animation
      if (doorRef.current) {
        const targetRot = openRef.current ? -1.25 : 0;
        doorRef.current.rotation.y += (targetRot - doorRef.current.rotation.y) * Math.min(1, dt * 2.2);
      }
      if (vault.userData.cavity) {
        const targetEm = openRef.current ? 1.6 : 0.0;
        vault.userData.cavity.material.emissiveIntensity +=
          (targetEm - vault.userData.cavity.material.emissiveIntensity) * Math.min(1, dt * 2.5);
      }

      // Button press pop
      for (const b of buttonsRef.current) {
        if (b.userData.press > 0) {
          b.userData.press = Math.max(0, b.userData.press - dt * 4);
          const s = 1 - b.userData.press * 0.18;
          b.scale.setScalar(s);
        } else if (b.scale.x !== 1) {
          b.scale.setScalar(1);
        }
      }

      // Camera sway
      camera.position.x = baseCam.x + Math.sin(t * 0.28) * 0.07;
      camera.position.y = baseCam.y + Math.sin(t * 0.4) * 0.03;
      camera.lookAt(target.x + Math.sin(t * 0.2) * 0.05, target.y, target.z);

      drawScreen();
      renderer.render(scene, camera);
    };
    animate();
    setReady(true);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('keydown', onKeyDown);
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            if (m.map) m.map.dispose();
            m.dispose();
          });
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  const foundCount = found.length;

  return (
    <main className="oezoe-root">
      <div ref={mountRef} className="oezoe-canvas" />
      {webglFailed && <FallbackKeypad onKey={(k) => keyHandlerRef.current(k)} />}

      <div className="oezoe-vignette" />

      <header className="oezoe-head">
        <h1>The Oezoe Vault</h1>
        <p>Speak the four true names to open the vault.</p>
      </header>

      <aside className="oezoe-cards">
        {WARDS.map((w) => {
          const isFound = found.includes(w.id);
          return (
            <div key={w.id} className={`oezoe-card ${isFound ? 'is-found' : ''}`}>
              <div className="oezoe-card-seal">{isFound ? '✦' : '✧'}</div>
              <div className="oezoe-card-body">
                <div className="oezoe-card-name">{isFound ? w.name : 'A sleeping Ward'}</div>
                <div className="oezoe-card-true">{isFound ? `True name: ${w.trueName}` : 'True name: ?'}</div>
                <div className="oezoe-card-blurb">{isFound ? w.blurb : 'Solve its seal to wake it.'}</div>
              </div>
            </div>
          );
        })}
      </aside>

      <div className="oezoe-input">
        <span className="oezoe-input-label">Entering</span>
        <span className="oezoe-input-value">{entered || '—'}</span>
        <span className="oezoe-input-count">{foundCount}/4</span>
      </div>

      {hint && !open && <div className="oezoe-hint">{hint}</div>}

      {open && (
        <div className="oezoe-open">
          <div className="oezoe-open-inner">
            <div className="oezoe-open-tag">The vault is open</div>
            <h2>The last riddle</h2>
            <p>{FINAL_RIDDLE}</p>
            {audioState === 'missing' && (
              <p className="oezoe-audio-warn">
                (Audio file not found at /audio/oezoe.mp3 — add it to play Oezoe&apos;s voice.)
              </p>
            )}
            {audioState === 'playing' && <p className="oezoe-audio-ok">Oezoe speaks…</p>}
          </div>
        </div>
      )}

      <audio ref={audioRef} src="/audio/oezoe.mp3" preload="auto" />

      <footer className="oezoe-foot">
        Click the keypad or type the true name. Backspace to erase.
      </footer>

      <style jsx>{`
        .oezoe-root {
          position: fixed;
          inset: 0;
          background: #06040a;
          overflow: hidden;
          color: #e9c96b;
          font-family: Georgia, 'Times New Roman', serif;
        }
        .oezoe-canvas { position: absolute; inset: 0; }
        .oezoe-canvas :global(canvas) { display: block; width: 100%; height: 100%; }
        .oezoe-vignette {
          position: absolute;
          inset: 0;
          pointer-events: none;
          background: radial-gradient(ellipse at 40% 55%, rgba(0,0,0,0) 35%, rgba(0,0,0,0.82) 100%);
          mix-blend-mode: multiply;
        }
        .oezoe-head {
          position: absolute;
          top: 22px;
          left: 28px;
          pointer-events: none;
          text-shadow: 0 2px 18px rgba(0,0,0,0.9);
        }
        .oezoe-head h1 {
          font-size: 30px;
          letter-spacing: 3px;
          margin: 0;
          color: #f0d488;
        }
        .oezoe-head p {
          margin: 4px 0 0;
          font-size: 14px;
          color: #b79a52;
          letter-spacing: 1px;
        }
        .oezoe-cards {
          position: absolute;
          top: 96px;
          right: 24px;
          width: 250px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .oezoe-card {
          display: flex;
          gap: 10px;
          padding: 10px 12px;
          border: 1px solid rgba(201,162,39,0.28);
          border-radius: 10px;
          background: linear-gradient(180deg, rgba(24,16,10,0.72), rgba(12,8,14,0.72));
          backdrop-filter: blur(4px);
          transition: border-color .4s, box-shadow .4s, transform .4s;
          opacity: 0.82;
        }
        .oezoe-card.is-found {
          border-color: rgba(255,210,110,0.85);
          box-shadow: 0 0 22px rgba(255,176,70,0.28);
          transform: translateX(-4px);
          opacity: 1;
        }
        .oezoe-card-seal { color: #ffd77a; font-size: 18px; line-height: 1.4; }
        .oezoe-card-name { font-size: 15px; color: #f0d488; letter-spacing: .5px; }
        .oezoe-card-true { font-size: 12.5px; color: #c9a227; margin-top: 2px; }
        .oezoe-card-blurb { font-size: 12px; color: #a99a72; margin-top: 4px; line-height: 1.35; }
        .oezoe-input {
          position: absolute;
          left: 50%;
          bottom: 92px;
          transform: translateX(-50%);
          display: flex;
          align-items: baseline;
          gap: 10px;
          padding: 8px 18px;
          border: 1px solid rgba(201,162,39,0.35);
          border-radius: 999px;
          background: rgba(8,6,12,0.7);
          backdrop-filter: blur(4px);
          letter-spacing: 2px;
        }
        .oezoe-input-label { font-size: 11px; color: #9a8a5a; text-transform: uppercase; }
        .oezoe-input-value { font-size: 22px; color: #ffe6a6; font-family: 'Courier New', monospace; }
        .oezoe-input-count { font-size: 12px; color: #b79a52; }
        .oezoe-hint {
          position: absolute;
          left: 50%;
          bottom: 60px;
          transform: translateX(-50%);
          font-size: 13.5px;
          color: #d9bf78;
          background: rgba(8,6,12,0.7);
          border: 1px solid rgba(201,162,39,0.2);
          padding: 6px 14px;
          border-radius: 8px;
          max-width: 70vw;
          text-align: center;
        }
        .oezoe-open {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: radial-gradient(ellipse at 50% 40%, rgba(255,170,60,0.10), rgba(0,0,0,0.78) 70%);
          animation: fadein 1.2s ease both;
        }
        .oezoe-open-inner {
          max-width: 620px;
          padding: 34px 40px;
          border: 1px solid rgba(255,210,110,0.5);
          border-radius: 16px;
          background: linear-gradient(180deg, rgba(28,18,10,0.94), rgba(12,8,14,0.94));
          box-shadow: 0 0 60px rgba(255,176,70,0.22);
          text-align: center;
        }
        .oezoe-open-tag {
          font-size: 12px;
          letter-spacing: 4px;
          text-transform: uppercase;
          color: #ffd77a;
          margin-bottom: 10px;
        }
        .oezoe-open-inner h2 { margin: 0 0 14px; font-size: 26px; color: #f0d488; letter-spacing: 1px; }
        .oezoe-open-inner p { margin: 0; font-size: 17px; line-height: 1.65; color: #e6d6ac; }
        .oezoe-audio-warn { margin-top: 16px !important; font-size: 13px !important; color: #c98a5a !important; }
        .oezoe-audio-ok { margin-top: 16px !important; font-size: 14px !important; color: #ffd77a !important; letter-spacing: 2px; }
        .oezoe-foot {
          position: absolute;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          font-size: 12px;
          color: #7d6f4c;
          letter-spacing: 1px;
          pointer-events: none;
        }
        .oezoe-fallback {
          position: absolute;
          left: 50%;
          top: 60%;
          transform: translate(-50%, -50%);
          display: grid;
          grid-template-columns: repeat(6, 46px);
          gap: 6px;
          z-index: 5;
        }
        .oezoe-fallback button {
          width: 46px;
          height: 46px;
          border-radius: 8px;
          border: 1px solid #c9a227;
          background: #140f18;
          color: #e9c96b;
          font-family: Georgia, serif;
          font-size: 15px;
          cursor: pointer;
        }
        @keyframes fadein { from { opacity: 0; } to { opacity: 1; } }
        @media (max-width: 820px) {
          .oezoe-cards { display: none; }
          .oezoe-head h1 { font-size: 22px; }
        }
      `}</style>
    </main>
  );
}

function FallbackKeypad({ onKey }) {
  return (
    <div className="oezoe-fallback">
      {KEYS.map((k) => (
        <button key={k} onClick={() => onKey(k)}>{k}</button>
      ))}
    </div>
  );
}
