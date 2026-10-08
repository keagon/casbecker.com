'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
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
  'All four true names are spoken, and the vault remembers. The key waits where the house breathes — behind the gasmeter, in the little cupboard by the first stairwell, a step below the first floor.';

const KEYS = [
  'A', 'B', 'C', 'D', 'E', 'F',
  'G', 'H', 'I', 'J', 'K', 'L',
  'M', 'N', 'O', 'P', 'Q', 'R',
  'S', 'T', 'U', 'V', 'W', 'X',
  'Y', 'Z', 'CLR', 'BACK', 'HINT',
];

function makeFireTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(32, 34, 0, 32, 34, 32);
  g.addColorStop(0, 'rgba(255,244,214,1)');
  g.addColorStop(0.25, 'rgba(255,186,84,0.95)');
  g.addColorStop(0.6, 'rgba(226,92,26,0.4)');
  g.addColorStop(1, 'rgba(120,30,0,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

const SEAL_ICONS = {
  cinderfowl: (
    <path d="M12 3c1.6 3 4.6 4.2 4.6 8.2A4.6 4.6 0 0 1 12 16a4.6 4.6 0 0 1-4.6-4.8C7.4 7.2 10.4 6 12 3Z" />
  ),
  mossskitter: (
    <path d="M4 20c0-8 6-13 16-13 0 10-6 14-16 13Zm3-1c3-4 6-6 9-7" />
  ),
  thimblekin: (
    <path d="M8 4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2l1.4 12.5c.1 1.2-.8 2.2-2 2.2H8.6c-1.2 0-2.1-1-2-2.2L8 4Zm1 8h6" />
  ),
  glimmerkin: (
    <path d="M2 12s3.8-6 10-6 10 6 10 6-3.8 6-10 6-10-6-10-6Zm10 2.6A2.6 2.6 0 1 0 12 9.4a2.6 2.6 0 0 0 0 5.2Z" />
  ),
};

export default function OezoeVault() {
  const mountRef = useRef(null);
  const inputRef = useRef(null);
  const audioRef = useRef(null);
  const doorRef = useRef(null);
  const fireRef = useRef(null);
  const openRef = useRef(false);
  const foundRef = useRef([]);

  const [entered, setEntered] = useState('');
  const [found, setFound] = useState([]);
  const [open, setOpen] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);
  const [audioState, setAudioState] = useState('idle');
  const [hint, setHint] = useState('');
  const [toast, setToast] = useState(null);
  const [booted, setBooted] = useState(false);

  useEffect(() => { foundRef.current = found; }, [found]);
  useEffect(() => { openRef.current = open; }, [open]);

  const press = useCallback((key) => {
    if (openRef.current) return;
    if (key === 'CLR') { setEntered(''); setHint(''); return; }
    if (key === 'BACK') { setEntered((e) => e.slice(0, -1)); return; }
    if (key === 'HINT') {
      const remaining = WARDS.filter((w) => !foundRef.current.includes(w.id));
      if (!remaining.length) { setHint('Every true name has been spoken.'); return; }
      const w = remaining[0];
      setHint(`${w.name} waits ${w.where}. Its true name begins with “${w.trueName[0]}”.`);
      return;
    }
    if (/^[A-Z]$/.test(key)) {
      setHint('');
      setEntered((e) => (e.length >= 6 ? e : e + key));
    }
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key === 'Backspace') { e.preventDefault(); press('BACK'); }
      else if (e.key === 'Escape' || e.key === 'Delete') press('CLR');
      else if (/^[a-zA-Z]$/.test(e.key)) press(e.key.toUpperCase());
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [press]);

  useEffect(() => {
    const code = entered.toUpperCase();
    if (!code) return;
    const match = WARDS.find((w) => w.trueName === code && !foundRef.current.includes(w.id));
    if (match) {
      setFound((f) => (f.includes(match.id) ? f : [...f, match.id]));
      setEntered('');
      setHint('');
      setToast({ name: match.name, trueName: match.trueName });
    }
  }, [entered]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 3200);
    return () => clearTimeout(t);
  }, [toast]);

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

  const playAudio = useCallback(() => {
    const a = audioRef.current;
    if (!a) return;
    try { a.currentTime = 0; } catch (e) { /* ignore */ }
    const p = a.play();
    if (p && typeof p.then === 'function') {
      p.then(() => setAudioState('playing')).catch(() => setAudioState('missing'));
    }
  }, []);

  // Three.js cinematic backdrop
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    } catch (e) {
      setWebglFailed(true);
      setBooted(true);
      return;
    }
    const small = window.innerWidth < 760;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, small ? 1.5 : 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070509);
    scene.fog = new THREE.FogExp2(0x0a0608, small ? 0.085 : 0.07);

    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(small ? 0 : 0.1, 1.7, small ? 5 : 4.4);

    scene.add(new THREE.AmbientLight(0x40314f, 0.55));
    const moon = new THREE.DirectionalLight(0x6274e0, 0.3);
    moon.position.set(-5, 7, 4);
    scene.add(moon);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(40, 40),
      new THREE.MeshStandardMaterial({ color: 0x1a0e09, roughness: 0.95, metalness: 0.05 })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    const wallMat = new THREE.MeshStandardMaterial({ color: 0x120c13, roughness: 1 });
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), wallMat);
    backWall.position.set(0, 7, -2.3);
    scene.add(backWall);
    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), wallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-7.5, 7, 0);
    scene.add(leftWall);
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(30, 14), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(7.5, 7, 0);
    scene.add(rightWall);

    const rug = new THREE.Mesh(
      new THREE.CircleGeometry(2.8, 48),
      new THREE.MeshStandardMaterial({ color: 0x2c0f14, roughness: 1 })
    );
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.01, 0.8);
    scene.add(rug);

    // Fireplace
    const stone = new THREE.MeshStandardMaterial({ color: 0x2c2622, roughness: 0.95 });
    const fp = new THREE.Group();
    fp.position.set(-3.1, 0, -2.0);
    fp.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.36, 1.3), stone), { position: new THREE.Vector3(0, 0.18, 0.4) }));
    fp.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.9, 1.1), stone), { position: new THREE.Vector3(-1.15, 1.45, 0) }));
    fp.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(0.5, 2.9, 1.1), stone), { position: new THREE.Vector3(1.15, 1.45, 0) }));
    fp.add(Object.assign(new THREE.Mesh(new THREE.BoxGeometry(2.9, 0.5, 1.1), stone), { position: new THREE.Vector3(0, 3.0, 0) }));
    const mantel = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.18, 1.35), new THREE.MeshStandardMaterial({ color: 0x3d2b1b, roughness: 0.65 }));
    mantel.position.set(0, 3.32, 0.18);
    fp.add(mantel);
    const firebox = new THREE.Mesh(
      new THREE.BoxGeometry(1.9, 2.1, 0.2),
      new THREE.MeshStandardMaterial({ color: 0x0a0505, emissive: 0x4a1400, emissiveIntensity: 0.9, roughness: 1 })
    );
    firebox.position.set(0, 1.5, -0.4);
    fp.add(firebox);
    scene.add(fp);

    const COUNT = small ? 200 : 420;
    const fgeo = new THREE.BufferGeometry();
    const fpos = new Float32Array(COUNT * 3);
    const fcol = new Float32Array(COUNT * 3);
    const fspd = new Float32Array(COUNT);
    const bx = new Float32Array(COUNT);
    const bz = new Float32Array(COUNT);
    for (let i = 0; i < COUNT; i++) {
      bx[i] = (Math.random() - 0.5) * 0.8;
      bz[i] = (Math.random() - 0.5) * 0.8;
      fpos[i * 3] = fp.position.x + bx[i];
      fpos[i * 3 + 1] = 0.4 + Math.random() * 2.1;
      fpos[i * 3 + 2] = fp.position.z + 0.2 + bz[i] * 0.7;
      fspd[i] = 0.4 + Math.random() * 0.9;
      const t = Math.random();
      fcol[i * 3] = 1.0;
      fcol[i * 3 + 1] = 0.34 + t * 0.5;
      fcol[i * 3 + 2] = 0.05 + t * 0.14;
    }
    fgeo.setAttribute('position', new THREE.BufferAttribute(fpos, 3));
    fgeo.setAttribute('color', new THREE.BufferAttribute(fcol, 3));
    const fmat = new THREE.PointsMaterial({
      size: small ? 0.42 : 0.36,
      map: makeFireTexture(),
      vertexColors: true,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const fire = new THREE.Points(fgeo, fmat);
    scene.add(fire);
    fireRef.current = { fire, fpos, fspd, bx, bz, fp };

    const fireLight = new THREE.PointLight(0xff8422, 3.4, 14, 2);
    fireLight.position.set(-3.1, 1.2, -1.5);
    scene.add(fireLight);
    scene.userData.fireLight = fireLight;

    // Candles on the mantel
    const candleLights = [];
    [-1.1, 1.1].forEach((off) => {
      const cl = new THREE.PointLight(0xffb45c, 0.6, 4, 2);
      cl.position.set(-3.1 + off, 3.6, -1.9);
      scene.add(cl);
      candleLights.push(cl);
      const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.34, 10), new THREE.MeshStandardMaterial({ color: 0xe8d8b0, roughness: 0.8 }));
      stick.position.set(-3.1 + off, 3.55, -1.9);
      scene.add(stick);
    });
    scene.userData.candleLights = candleLights;

    // Dust
    const DUST = small ? 120 : 260;
    const dgeo = new THREE.BufferGeometry();
    const dpos = new Float32Array(DUST * 3);
    for (let i = 0; i < DUST; i++) {
      dpos[i * 3] = (Math.random() - 0.5) * 12;
      dpos[i * 3 + 1] = Math.random() * 6;
      dpos[i * 3 + 2] = (Math.random() - 0.5) * 8;
    }
    dgeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3));
    const dust = new THREE.Points(dgeo, new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.028, transparent: true, opacity: 0.5, depthWrite: false, blending: THREE.AdditiveBlending }));
    scene.add(dust);

    // Vault
    const vX = small ? 1.9 : 2.7;
    const vY = 1.8;
    const vZ = -2.1;
    const frame = new THREE.Mesh(
      new THREE.CylinderGeometry(1.05, 1.05, 0.24, 48),
      new THREE.MeshStandardMaterial({ color: 0x2a2a31, metalness: 0.9, roughness: 0.35 })
    );
    frame.rotation.x = Math.PI / 2;
    frame.position.set(vX, vY, vZ);
    scene.add(frame);
    const cavity = new THREE.Mesh(
      new THREE.CircleGeometry(0.92, 48),
      new THREE.MeshStandardMaterial({ color: 0x180d05, emissive: 0xffb24d, emissiveIntensity: 0, roughness: 1 })
    );
    cavity.position.set(vX, vY, vZ + 0.03);
    scene.add(cavity);

    const doorGroup = new THREE.Group();
    doorGroup.position.set(vX + 1.02, vY, vZ + 0.13);
    const door = new THREE.Mesh(
      new THREE.CylinderGeometry(1.0, 1.0, 0.18, 48),
      new THREE.MeshStandardMaterial({ color: 0x3c3c45, metalness: 0.95, roughness: 0.28 })
    );
    door.rotation.x = Math.PI / 2;
    door.position.set(-1.02, 0, 0);
    doorGroup.add(door);
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.36, 0.05, 12, 32), new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 1, roughness: 0.3 }));
    wheel.rotation.x = Math.PI / 2;
    wheel.position.set(-1.02, 0, 0.17);
    doorGroup.add(wheel);
    for (let i = 0; i < 4; i++) {
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.05, 0.05), new THREE.MeshStandardMaterial({ color: 0xc9a227, metalness: 1, roughness: 0.3 }));
      spoke.position.set(-1.02, 0, 0.17);
      spoke.rotation.z = (i * Math.PI) / 4;
      doorGroup.add(spoke);
    }
    scene.add(doorGroup);
    doorRef.current = doorGroup;
    scene.userData.cavity = cavity;

    const clock = new THREE.Clock();
    let raf = 0;
    const base = camera.position.clone();
    const target = new THREE.Vector3(small ? 0.4 : 0.7, 1.55, -1.2);

    const animate = () => {
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      const f = fireRef.current;
      if (f) {
        for (let i = 0; i < COUNT; i++) {
          f.fpos[i * 3 + 1] += f.fspd[i] * dt * 1.7;
          f.fpos[i * 3] += Math.sin(t * 3 + i) * dt * 0.12;
          if (f.fpos[i * 3 + 1] > 2.8) {
            f.fpos[i * 3 + 1] = 0.35;
            f.fpos[i * 3] = f.fp.position.x + f.bx[i];
            f.fpos[i * 3 + 2] = f.fp.position.z + 0.2 + f.bz[i] * 0.6;
          }
        }
        fgeo.attributes.position.needsUpdate = true;
        fmat.opacity = 0.8 + Math.sin(t * 12) * 0.08 + Math.random() * 0.05;
      }
      const fl = scene.userData.fireLight;
      if (fl) fl.intensity = 3.1 + Math.sin(t * 9.3) * 0.5 + Math.random() * 0.5;
      scene.userData.candleLights.forEach((c, i) => {
        c.intensity = 0.55 + Math.sin(t * 11 + i * 2) * 0.15 + Math.random() * 0.08;
      });
      dust.rotation.y = t * 0.02;

      if (doorRef.current) {
        const tr = openRef.current ? -1.28 : 0;
        doorRef.current.rotation.y += (tr - doorRef.current.rotation.y) * Math.min(1, dt * 2.2);
      }
      if (scene.userData.cavity) {
        const te = openRef.current ? 1.7 : 0;
        scene.userData.cavity.material.emissiveIntensity += (te - scene.userData.cavity.material.emissiveIntensity) * Math.min(1, dt * 2.5);
      }

      camera.position.x = base.x + Math.sin(t * 0.26) * 0.06;
      camera.position.y = base.y + Math.sin(t * 0.38) * 0.025;
      camera.lookAt(target.x + Math.sin(t * 0.2) * 0.05, target.y, target.z);

      renderer.render(scene, camera);
    };
    animate();
    setBooted(true);

    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => { if (m.map) m.map.dispose(); m.dispose(); });
        }
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement);
    };
  }, []);

  const foundCount = found.length;
  const slots = 6;

  const onChange = (e) => {
    const v = e.target.value.toUpperCase().replace(/[^A-Z]/g, '').slice(0, slots);
    setEntered(v);
    setHint('');
  };

  return (
    <main className="vr">
      <div ref={mountRef} className={`vr-scene ${webglFailed ? 'is-failed' : ''}`} />
      <div className="vr-glow" />
      <div className="vr-vignette" />
      <div className="vr-grain" />

      <header className="vr-brand">
        <span className="vr-brand-mark">✦</span>
        <span>The Manor of the Passion Vulture</span>
      </header>

      <section className={`vr-console ${booted ? 'is-in' : ''}`}>
        {!open ? (
          <>
            <p className="vr-kicker">The Vigil</p>
            <h1 className="vr-title">The Oezoe Vault</h1>
            <p className="vr-sub">Speak the four true names to wake the Wards and open the vault.</p>

            <div className="vr-seals" role="list">
              {WARDS.map((w) => {
                const on = found.includes(w.id);
                return (
                  <div key={w.id} className={`vr-seal ${on ? 'is-found' : ''}`} role="listitem" title={on ? w.name : 'A sleeping Ward'}>
                    <svg viewBox="0 0 24 24" aria-hidden="true">
                      <g fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                        {SEAL_ICONS[w.id]}
                      </g>
                    </svg>
                    <span>{on ? w.trueName : '·'}</span>
                  </div>
                );
              })}
            </div>

            <label className="vr-field">
              <input
                ref={inputRef}
                value={entered}
                onChange={onChange}
                inputMode="text"
                autoCapitalize="characters"
                autoCorrect="off"
                autoComplete="off"
                spellCheck={false}
                enterKeyHint="done"
                aria-label="Type a true name"
                placeholder="type a true name"
              />
              <span className="vr-caret" aria-hidden="true" />
            </label>

            <div className="vr-meta">
              <span>{foundCount} of 4 true names found</span>
              <button type="button" className="vr-hintbtn" onClick={() => press('HINT')}>Need a hint?</button>
            </div>

            {hint && <p className="vr-hint" role="status">{hint}</p>}

            <div className="vr-keypad" aria-hidden={false}>
              {KEYS.map((k) => (
                <button
                  key={k}
                  type="button"
                  className={`vr-key ${k.length > 1 ? 'is-action' : ''}`}
                  onClick={() => press(k)}
                >
                  {k}
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="vr-open">
            <p className="vr-kicker">The vault is open</p>
            <h1 className="vr-title">The last riddle</h1>
            <p className="vr-riddle">{FINAL_RIDDLE}</p>
            <div className="vr-wardlist">
              {WARDS.map((w) => (
                <div key={w.id} className="vr-wardrow">
                  <span className="vr-wardrow-name">{w.name}</span>
                  <span className="vr-wardrow-true">{w.trueName}</span>
                </div>
              ))}
            </div>
            <button type="button" className="vr-play" onClick={playAudio}>
              {audioState === 'playing' ? 'Play Oezoe’s voice again' : 'Play Oezoe’s voice'}
            </button>
            {audioState === 'missing' && (
              <p className="vr-warn">Audio not found at <code>/audio/oezoe.mp3</code> — add it to hear Oezoe speak.</p>
            )}
          </div>
        )}
      </section>

      {toast && (
        <div className="vr-toast" role="status">
          <span className="vr-toast-tag">True name found</span>
          <span className="vr-toast-name">{toast.trueName}</span>
          <span className="vr-toast-sub">{toast.name}</span>
        </div>
      )}

      <audio ref={audioRef} src="/audio/oezoe.mp3" preload="auto" />

      <style jsx>{`
        .vr {
          position: fixed;
          inset: 0;
          background: #070509;
          color: #ecdcae;
          font-family: Georgia, 'Times New Roman', serif;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
        }
        .vr-scene { position: absolute; inset: 0; }
        .vr-scene :global(canvas) { display: block; width: 100%; height: 100%; }
        .vr-scene.is-failed {
          background:
            radial-gradient(120% 90% at 20% 10%, #1a1020 0%, #0a070c 55%, #060409 100%),
            radial-gradient(60% 50% at 80% 80%, rgba(255,132,34,0.12), transparent 70%);
        }
        .vr-glow {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(60% 45% at 22% 62%, rgba(255,138,40,0.18), transparent 70%);
          mix-blend-mode: screen;
        }
        .vr-vignette {
          position: absolute; inset: 0; pointer-events: none;
          background: radial-gradient(120% 100% at 50% 45%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.55) 72%, rgba(0,0,0,0.88) 100%);
        }
        .vr-grain {
          position: absolute; inset: 0; pointer-events: none; opacity: 0.05;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='120'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .vr-brand {
          position: absolute; top: max(18px, env(safe-area-inset-top)); left: 0; right: 0;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #b7955a;
          pointer-events: none;
        }
        .vr-brand-mark { color: #e9c96b; }
        .vr-console {
          position: absolute; left: 50%; top: 50%;
          transform: translate(-50%, -46%);
          width: min(92vw, 520px);
          max-height: calc(100dvh - 96px);
          overflow-y: auto;
          padding: 26px 26px 22px;
          border-radius: 20px;
          background: linear-gradient(180deg, rgba(26,19,13,0.86), rgba(10,8,13,0.92));
          border: 1px solid rgba(233,201,107,0.18);
          box-shadow: 0 30px 90px rgba(0,0,0,0.66), inset 0 1px 0 rgba(255,255,255,0.05);
          backdrop-filter: blur(12px) saturate(120%);
          -webkit-backdrop-filter: blur(12px) saturate(120%);
          text-align: center;
          opacity: 0;
          transition: opacity .9s ease;
        }
        .vr-console.is-in { opacity: 1; }
        .vr-kicker {
          margin: 0 0 6px; font-size: 10.5px; letter-spacing: 4px; text-transform: uppercase; color: #b7955a;
        }
        .vr-title { margin: 0; font-size: clamp(24px, 6vw, 32px); color: #f2d98f; letter-spacing: 1px; font-weight: 500; }
        .vr-sub { margin: 8px 0 18px; font-size: 13.5px; line-height: 1.5; color: #b6a67e; }
        .vr-seals { display: flex; justify-content: center; gap: 10px; margin: 0 0 18px; }
        .vr-seal {
          width: 56px; height: 56px; border-radius: 50%;
          display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1px;
          border: 1px solid rgba(233,201,107,0.22);
          background: rgba(10,8,13,0.5);
          color: #6f6046;
          transition: all .5s ease;
        }
        .vr-seal svg { width: 20px; height: 20px; }
        .vr-seal span { font-size: 9px; letter-spacing: 1px; text-transform: uppercase; }
        .vr-seal.is-found {
          color: #ffe19a; border-color: rgba(255,210,110,0.9);
          background: radial-gradient(circle at 50% 30%, rgba(255,180,77,0.32), rgba(20,12,6,0.65));
          box-shadow: 0 0 20px rgba(255,176,70,0.32);
          transform: translateY(-2px);
        }
        .vr-seal.is-found span { color: #ffd77a; letter-spacing: 1.5px; }
        .vr-field { position: relative; display: block; margin: 0 auto 12px; max-width: 320px; }
        .vr-field input {
          width: 100%; box-sizing: border-box;
          padding: 12px 14px 14px;
          text-align: center;
          font-family: Georgia, serif;
          font-size: clamp(22px, 7vw, 30px);
          letter-spacing: 8px; text-indent: 8px;
          color: #ffe6a6; caret-color: #ffb84d;
          background: rgba(6,5,9,0.6);
          border: 1px solid rgba(233,201,107,0.28);
          border-radius: 12px;
          outline: none; text-transform: uppercase;
          transition: border-color .3s, box-shadow .3s;
        }
        .vr-field input::placeholder { color: #5d5241; letter-spacing: 3px; font-size: 14px; text-indent: 0; }
        .vr-field input:focus {
          border-color: rgba(255,210,110,0.7);
          box-shadow: 0 0 0 3px rgba(255,176,70,0.14), 0 0 26px rgba(255,176,70,0.16);
        }
        .vr-meta {
          display: flex; align-items: center; justify-content: space-between;
          gap: 10px; margin: 0 auto 8px; max-width: 320px;
          font-size: 11px; letter-spacing: 1px; color: #9b8b62;
        }
        .vr-hintbtn {
          background: none; border: none; color: #d9bf78; cursor: pointer;
          font-family: inherit; font-size: 11px; letter-spacing: 1px; text-decoration: underline; text-underline-offset: 3px; padding: 6px 0;
        }
        .vr-hint { margin: 6px auto 4px; max-width: 340px; font-size: 12.5px; color: #d9bf78; line-height: 1.5; }
        .vr-keypad {
          display: grid; grid-template-columns: repeat(6, 1fr); gap: 7px;
          margin: 12px auto 4px; max-width: 360px;
        }
        .vr-key {
          aspect-ratio: 1 / 1;
          min-height: 42px;
          display: flex; align-items: center; justify-content: center;
          font-family: Georgia, serif; font-size: 15px; color: #e5cf8f;
          background: linear-gradient(180deg, rgba(30,22,14,0.9), rgba(16,12,17,0.9));
          border: 1px solid rgba(233,201,107,0.16);
          border-radius: 10px; cursor: pointer;
          transition: transform .12s, border-color .2s, box-shadow .2s, background .2s;
          touch-action: manipulation;
        }
        .vr-key:hover { border-color: rgba(255,210,110,0.5); }
        .vr-key:active { transform: scale(0.94); background: rgba(60,42,18,0.9); }
        .vr-key.is-action { font-size: 11px; letter-spacing: 1px; color: #b7955a; }
        .vr-open { display: flex; flex-direction: column; align-items: center; }
        .vr-riddle { margin: 10px 0 16px; font-size: 15px; line-height: 1.65; color: #e7d7ac; }
        .vr-wardlist { width: 100%; margin: 0 0 18px; border-top: 1px solid rgba(233,201,107,0.14); }
        .vr-wardrow {
          display: flex; justify-content: space-between; align-items: center;
          padding: 9px 2px; border-bottom: 1px solid rgba(233,201,107,0.14); font-size: 13.5px;
        }
        .vr-wardrow-name { color: #cbb98a; }
        .vr-wardrow-true { color: #ffe19a; letter-spacing: 2px; }
        .vr-play {
          margin-top: 2px; padding: 13px 26px; border: none; border-radius: 999px; cursor: pointer;
          font-family: inherit; font-size: 14px; letter-spacing: 1px; color: #201404; font-weight: 600;
          background: linear-gradient(180deg, #ffe19a, #e8bb52);
          box-shadow: 0 10px 30px rgba(232,187,82,0.28);
          transition: transform .12s, box-shadow .2s;
        }
        .vr-play:active { transform: scale(0.97); }
        .vr-warn { margin: 12px 0 0; font-size: 12px; color: #c98a5a; line-height: 1.5; }
        .vr-warn code { color: #e0a97a; }
        .vr-toast {
          position: absolute; top: max(56px, calc(env(safe-area-inset-top) + 40px)); left: 50%; transform: translateX(-50%);
          display: flex; flex-direction: column; align-items: center; gap: 2px;
          padding: 12px 22px; border-radius: 999px;
          background: linear-gradient(180deg, rgba(40,28,14,0.95), rgba(16,11,8,0.95));
          border: 1px solid rgba(255,210,110,0.55);
          box-shadow: 0 0 30px rgba(255,176,70,0.3);
          animation: vrpop .5s ease both;
          pointer-events: none;
        }
        .vr-toast-tag { font-size: 9.5px; letter-spacing: 3px; text-transform: uppercase; color: #c9a227; }
        .vr-toast-name { font-size: 19px; letter-spacing: 3px; color: #ffe6a6; }
        .vr-toast-sub { font-size: 11px; color: #b7955a; }
        @keyframes vrpop { from { opacity: 0; transform: translate(-50%, -8px); } to { opacity: 1; transform: translate(-50%, 0); } }

        /* Mobile-first: hide the on-screen keypad under 760px (use the OS keyboard). */
        @media (max-width: 759px) {
          .vr-keypad { display: none; }
          .vr-console {
            width: 100%;
            max-width: 100%;
            left: 0; right: 0; top: auto; bottom: 0;
            transform: none;
            border-radius: 22px 22px 0 0;
            padding: 22px 20px calc(22px + env(safe-area-inset-bottom));
            max-height: 82dvh;
          }
        }
        @media (min-width: 760px) {
          .vr-console { transform: translate(-50%, -50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .vr-console { transition: none; }
        }
      `}</style>
    </main>
  );
}
