import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  DiceFiveIcon,
  ScrollIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';

// --- Utility: Noise Functions ---
const random = (s) => {
    let t = s + 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const noise2D = (x, y, seed) => {
    const fract = (n) => n - Math.floor(n);
    const hash = (n) => {
        n = Math.sin(n) * 43758.5453123;
        return n - Math.floor(n);
    }
    const lerp = (a, b, t) => a + t * (b - a);

    const ix = Math.floor(x);
    const iy = Math.floor(y);
    const fx = fract(x);
    const fy = fract(y);

    const a = hash(ix + iy * 57 + seed);
    const b = hash(ix + 1 + iy * 57 + seed);
    const c = hash(ix + (iy + 1) * 57 + seed);
    const d = hash(ix + 1 + (iy + 1) * 57 + seed);

    const ux = fx * fx * (3.0 - 2.0 * fx);
    const uy = fy * fy * (3.0 - 2.0 * fy);

    return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
};

const fbm = (x, y, seed, octaves) => {
    let val = 0;
    let amp = 0.5;
    let freq = 1;
    for(let i=0; i<octaves; i++) {
        val += noise2D(x * freq, y * freq, seed) * amp;
        freq *= 2;
        amp *= 0.5;
    }
    return val;
};

const ridgedFbm = (x, y, seed, octaves) => {
    let val = 0;
    let amp = 0.5;
    let freq = 1;
    for(let i=0; i<octaves; i++) {
        let n = noise2D(x * freq, y * freq, seed);
        n = 1.0 - Math.abs(n * 2.0 - 1.0);
        n = n * n;
        val += n * amp;
        freq *= 2;
        amp *= 0.5;
    }
    return val;
};

// --- Custom Components ---

const MedievalSlider = ({ label, value, min, max, step, onChange }) => {
    const percentage = ((value - min) / (max - min)) * 100;

    return (
        <div className="flex flex-col gap-1 w-full font-serif">
             <div className="flex justify-between items-end mb-1">
                <label className="text-xs font-bold tracking-widest text-[#3E2F26] uppercase">{label}</label>
                <span className="text-xs font-bold text-[#8C7B6C]">{value}</span>
            </div>
            <div className="relative h-4 w-full flex items-center group cursor-pointer">
                <div className="absolute w-full h-1 bg-[#8C7B6C] rounded-full border border-[#3E2F26] shadow-[inset_0_1px_2px_rgba(0,0,0,0.3)]"></div>
                <div className="absolute h-1 bg-[#4A3C31] rounded-l-full" style={{ width: `${percentage}%` }}></div>
                <div className="absolute w-3 h-3 bg-[#D6C4A6] border-2 border-[#3E2F26] rounded-full shadow-md transform -translate-x-1/2 transition-transform group-hover:scale-110" style={{ left: `${percentage}%` }}></div>
                <input
                    type="range"
                    min={min} max={max} step={step} value={value}
                    onChange={(e) => onChange(Number(e.target.value))}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
            </div>
        </div>
    );
};

const FantasyMapGeneratorPage = () => {
  const { addToast } = useToast();
  const canvasRef = useRef(null);

  const [seed, setSeed] = useState(Date.now());
  const [roughness, setRoughness] = useState(0.6);
  const [vegetation, setVegetation] = useState(0.5);
  const [hillDensity, setHillDensity] = useState(0.3);
  const [waterLevel, setWaterLevel] = useState(0.35);
  const [cityCount, setCityCount] = useState(8);
  const [castleCount, setCastleCount] = useState(4);
  const [shipCount, setShipCount] = useState(3);
  const [lakeCount, setLakeCount] = useState(4);

  const [colors] = useState({
    paper: '#F0E6D2',
    water: '#C5D6D8',
    waterOutline: '#8DA3A6',
    ink: '#3E2F26',
    mountainLight: '#F0E6D2',
    mountainShadow: '#A69580',
    tree: '#6B7A59',
    road: '#A69580',
    text: '#2C1B11',
  });

  const generateMap = useCallback((ctx, width, height) => {
    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = colors.paper;
    ctx.fillRect(0, 0, width, height);

    for(let i=0; i<width*height*0.02; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)';
        ctx.fillRect(x, y, 2, 2);
    }

    const w = 200;
    const h = 150;
    const cellW = width / w;
    const cellH = height / h;
    const heightMap = new Float32Array(w * h);
    const moistureMap = new Float32Array(w * h);

    const scale = 3;
    for(let y=0; y<h; y++) {
        for(let x=0; x<w; x++) {
            const nx = x/w * scale;
            const ny = y/h * scale;
            const dx = x/w - 0.5;
            const dy = y/h - 0.5;
            const dist = Math.sqrt(dx*dx + dy*dy) * 2.0;
            const mask = Math.max(0, 1.0 - Math.pow(dist, 2));
            let elev = fbm(nx, ny, seed, 5);
            elev = (elev + mask) * 0.5;
            let mountains = ridgedFbm(nx, ny, seed + 100, 4);
            heightMap[y*w+x] = elev * 0.7 + mountains * 0.3 * roughness;
            moistureMap[y*w+x] = fbm(nx + 10, ny + 10, seed + 200, 3);
        }
    }

    const getElev = (x, y) => {
        if (x < 0 || x >= w || y < 0 || y >= h) return 0;
        return heightMap[y*w+x];
    }

    ctx.fillStyle = colors.water;
    ctx.beginPath();
    for(let y=0; y<h; y++) {
        for(let x=0; x<w; x++) {
            if (heightMap[y*w+x] < waterLevel) {
                ctx.rect(x*cellW, y*cellH, cellW+1, cellH+1);
            }
        }
    }
    ctx.fill();

    ctx.strokeStyle = colors.waterOutline;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for(let y=0; y<h-1; y++) {
        for(let x=0; x<w-1; x++) {
            const isLand = heightMap[y*w+x] >= waterLevel;
            const isLandR = heightMap[y*w+(x+1)] >= waterLevel;
            const isLandB = heightMap[(y+1)*w+x] >= waterLevel;
            if (isLand !== isLandR) {
                 ctx.moveTo((x+1)*cellW, y*cellH);
                 ctx.lineTo((x+1)*cellW, (y+1)*cellH);
            }
            if (isLand !== isLandB) {
                 ctx.moveTo(x*cellW, (y+1)*cellH);
                 ctx.lineTo((x+1)*cellW, (y+1)*cellH);
            }
        }
    }
    ctx.stroke();

    const drawLake = (cx, cy, size) => {
        ctx.fillStyle = colors.water;
        ctx.strokeStyle = colors.waterOutline;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        const segments = 10;
        for(let i=0; i<=segments; i++) {
            const angle = (i / segments) * Math.PI * 2;
            const r = size * (0.8 + 0.4 * noise2D(Math.cos(angle)*2, Math.sin(angle)*2, seed + cx));
            const lx = cx*cellW + Math.cos(angle) * r * cellW;
            const ly = cy*cellH + Math.sin(angle) * r * cellH;
            if (i === 0) ctx.moveTo(lx, ly); else ctx.lineTo(lx, ly);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    };

    let pl = 0;
    for(let i=0; i<100 && pl < lakeCount; i++) {
        const lx = Math.floor(random(seed + i * 3) * w);
        const ly = Math.floor(random(seed + i * 4) * h);
        if (getElev(lx, ly) > waterLevel + 0.05 && getElev(lx, ly) < 0.5) {
            drawLake(lx, ly, 2 + random(lx+ly)*2);
            pl++;
        }
    }

    const numRivers = 15;
    ctx.strokeStyle = colors.waterOutline;
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    for(let i=0; i<numRivers; i++) {
        let rx = Math.floor(random(seed + i) * w);
        let ry = Math.floor(random(seed + i*2) * h);
        if(getElev(rx, ry) > waterLevel + 0.2) {
             const path = [];
             let cx = rx, cy = ry, flow = true;
             while(flow && path.length < 200) {
                 path.push({x: cx, y: cy});
                 if(getElev(cx, cy) < waterLevel) break;
                 let minE = getElev(cx, cy), nx = cx, ny = cy;
                 for(let dy=-1; dy<=1; dy++) {
                     for(let dx=-1; dx<=1; dx++) {
                         const e = getElev(cx+dx, cy+dy);
                         if(e < minE) { minE = e; nx = cx+dx; ny = cy+dy; }
                     }
                 }
                 if(nx === cx && ny === cy) { flow = false; drawLake(cx, cy, 1); }
                 else { cx = nx; cy = ny; }
             }
             if(path.length > 5) {
                 ctx.beginPath(); ctx.moveTo(path[0].x * cellW, path[0].y * cellH);
                 for(let p=1; p<path.length; p++) {
                     const jx = (random(seed+p) - 0.5) * 3;
                     const jy = (random(seed+p*2) - 0.5) * 3;
                     ctx.lineTo(path[p].x * cellW + jx, path[p].y * cellH + jy);
                 }
                 ctx.stroke();
             }
        }
    }

    const cities = [];
    const usedNames = new Set();
    const prefixes = ["West", "North", "Iron", "Deep", "Grey", "Misty", "High", "Red", "Blue", "Black", "White", "Silver", "Gold", "Green", "Old", "New", "Lost", "Dark", "Light", "Stone", "Raven", "Wolf", "Bear"];
    const suffixes = ["wood", "mount", "peak", "river", "fall", "bridge", "field", "haven", "watch", "guard", "dale", "vale", "gate", "port", "bay", "isle", "keep", "hold", "bury", "ton", "grad", "heim"];
    const castPrefixes = ["Dread", "Storm", "Iron", "Shadow", "Doom", "Blood", "Cloud", "Void", "Kings", "Oath"];
    const castSuffixes = ["fort", "tower", "citadel", "bastion", "spire", "stronghold", "reach", "crag", "wall"];

    const getUniqueName = (s, pArr, sArr) => {
        let attempts = 0, name = "";
        do {
            name = pArr[Math.floor(random(s + attempts) * pArr.length)] + sArr[Math.floor(random(s + attempts + 0.5) * sArr.length)];
            attempts++;
        } while (usedNames.has(name) && attempts < 50);
        usedNames.add(name); return name;
    }

    let att = 0;
    while(cities.length < cityCount && att < 200) {
        const rx = Math.floor(random(seed + att * 1.1) * w), ry = Math.floor(random(seed + att * 1.2) * h);
        if (getElev(rx, ry) > waterLevel && getElev(rx, ry) < 0.5 && !cities.some(c => Math.hypot(c.x - rx, c.y - ry) < 15)) {
            cities.push({ x: rx, y: ry, name: getUniqueName(seed + att, prefixes, suffixes) });
        }
        att++;
    }

    const castles = [];
    att = 0;
    while(castles.length < castleCount && att < 300) {
        const rx = Math.floor(random(seed + 500 + att) * w), ry = Math.floor(random(seed + 600 + att) * h);
        const e = getElev(rx, ry);
        if (e > 0.55 && e < 0.75 && !cities.some(c => Math.hypot(c.x - rx, c.y - ry) < 20) && !castles.some(c => Math.hypot(c.x - rx, c.y - ry) < 20)) {
            castles.push({ x: rx, y: ry, name: getUniqueName(seed + 700 + att, castPrefixes, castSuffixes) });
        }
        att++;
    }

    ctx.strokeStyle = colors.road; ctx.lineWidth = 1.5; ctx.setLineDash([5, 5]); ctx.beginPath();
    cities.forEach((city, i) => {
        let nearest = null, minD = Infinity;
        cities.forEach((other, j) => {
            if(i===j) return;
            const d = Math.hypot(city.x - other.x, city.y - other.y);
            if(d < minD) { minD = d; nearest = other; }
        });
        if(nearest) {
             const sx = city.x * cellW, sy = city.y * cellH, ex = nearest.x * cellW, ey = nearest.y * cellH;
             const mx = (sx + ex) / 2, my = (sy + ey) / 2, offset = (random(seed + i) - 0.5) * 30;
             ctx.moveTo(sx, sy); ctx.quadraticCurveTo(mx + offset, my + offset, ex, ey);
        }
    });
    ctx.stroke(); ctx.setLineDash([]);

    const features = [];
    for(let y=0; y<h; y++) {
        for(let x=0; x<w; x++) {
             const e = heightMap[y*w+x], m = moistureMap[y*w+x], px = x * cellW, py = y * cellH;
             if (e < waterLevel) continue;
             if (e > 0.65) { if (random(x*y + seed) < 0.3 * roughness) features.push({type: 'mountain', x: px, y: py, h: e}); }
             else if (e > waterLevel && e < 0.6 && m > (1 - vegetation)) { if (random(x*y + seed) < 0.4) features.push({type: 'tree', x: px, y: py}); }
             else if (e > 0.5 && e < 0.65) { if (random(x*y + seed) < 0.2 * hillDensity) features.push({type: 'hill', x: px, y: py}); }
        }
    }
    features.sort((a,b) => a.y - b.y);
    features.forEach(f => {
        const jitter = (random(f.x + f.y) - 0.5) * 8, fx = f.x + jitter, fy = f.y + jitter;
        ctx.strokeStyle = colors.ink;
        if (f.type === 'mountain') {
            const size = 25 + (f.h - 0.6) * 60;
            ctx.fillStyle = colors.mountainLight; ctx.lineWidth = 1.5; ctx.beginPath();
            ctx.moveTo(fx - size/2, fy); ctx.lineTo(fx, fy - size); ctx.lineTo(fx + size/2, fy); ctx.fill();
            ctx.fillStyle = colors.mountainShadow; ctx.beginPath();
            ctx.moveTo(fx, fy - size); ctx.lineTo(fx + size/2, fy); ctx.lineTo(fx, fy); ctx.fill();
            ctx.beginPath(); ctx.moveTo(fx - size/2, fy); ctx.lineTo(fx, fy - size); ctx.lineTo(fx + size/2, fy); ctx.stroke();
        } else if (f.type === 'tree') {
            const size = 10 + random(fx)*6;
            ctx.fillStyle = colors.tree; ctx.lineWidth = 1.5; ctx.beginPath();
            ctx.arc(fx, fy - size/2, size/2, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(fx, fy - size/2, size/2, 0, Math.PI, false); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx, fy + 3); ctx.stroke();
        } else if (f.type === 'hill') {
            const size = 12 + random(fx) * 6;
            ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(fx, fy, size, Math.PI, 0); ctx.stroke();
        }
    });

    castles.forEach(c => {
        const cx = c.x * cellW, cy = c.y * cellH;
        const s = 28;
        ctx.strokeStyle = colors.ink;
        ctx.lineWidth = 2;

        ctx.fillStyle = '#A6A6A6';
        ctx.fillRect(cx - s/2, cy - s*0.8, s*0.25, s*0.8);
        ctx.strokeRect(cx - s/2, cy - s*0.8, s*0.25, s*0.8);
        ctx.fillRect(cx + s/4, cy - s*0.8, s*0.25, s*0.8);
        ctx.strokeRect(cx + s/4, cy - s*0.8, s*0.25, s*0.8);

        ctx.fillRect(cx - s/4, cy - s*0.6, s/2, s*0.6);
        ctx.strokeRect(cx - s/4, cy - s*0.6, s/2, s*0.6);

        ctx.fillStyle = '#7A2F2F';
        ctx.beginPath();
        ctx.moveTo(cx - s/2 - 2, cy - s*0.8);
        ctx.lineTo(cx - s/2 + s*0.125, cy - s*1.2);
        ctx.lineTo(cx - s/2 + s*0.25 + 2, cy - s*0.8);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(cx + s/4 - 2, cy - s*0.8);
        ctx.lineTo(cx + s/4 + s*0.125, cy - s*1.2);
        ctx.lineTo(cx + s/4 + s*0.25 + 2, cy - s*0.8);
        ctx.closePath();
        ctx.fill(); ctx.stroke();

        ctx.fillStyle = colors.ink;
        ctx.beginPath();
        ctx.arc(cx, cy, 4, Math.PI, 0);
        ctx.lineTo(cx + 4, cy);
        ctx.lineTo(cx - 4, cy);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = colors.text;
        ctx.font = 'bold 20px serif';
        ctx.fillText(c.name, cx, cy + 24);
    });

    let sc = 0;
    for(let i=0; i<100 && sc < shipCount; i++) {
        const sx = Math.floor(random(seed + i * 20) * w), sy = Math.floor(random(seed + i * 21) * h);
        if(getElev(sx, sy) < waterLevel - 0.05) {
            const px = sx * cellW, py = sy * cellH;
            ctx.fillStyle = colors.paper; ctx.strokeStyle = colors.ink; ctx.lineWidth = 1.5;
            ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + 15, py); ctx.lineTo(px + 7, py + 5); ctx.closePath(); ctx.fill(); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(px + 7, py); ctx.lineTo(px + 7, py - 15); ctx.lineTo(px + 18, py - 8); ctx.closePath(); ctx.stroke();
            sc++;
        }
    }

    ctx.fillStyle = colors.text; ctx.font = 'bold 18px "Cinzel", serif'; ctx.textAlign = 'center';
    cities.forEach(city => {
        const cx = city.x * cellW, cy = city.y * cellH;
        ctx.fillStyle = colors.paper; ctx.strokeStyle = colors.ink; ctx.lineWidth = 2;
        ctx.beginPath(); ctx.arc(cx, cy, 5, 0, Math.PI*2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = colors.text; ctx.beginPath(); ctx.arc(cx, cy, 2, 0, Math.PI*2); ctx.fill();
        ctx.fillText(city.name, cx, cy - 12);
    });

    const lx = 60, ly = height - 160;
    ctx.fillStyle = 'rgba(240, 230, 210, 0.8)'; ctx.strokeStyle = colors.ink; ctx.lineWidth = 3;
    ctx.fillRect(lx, ly, 180, 120); ctx.strokeRect(lx, ly, 180, 120);
    ctx.fillStyle = colors.text; ctx.font = 'bold 14px serif'; ctx.textAlign = 'left';
    ctx.fillText("MAP LEGEND", lx + 15, ly + 25);
    ctx.font = '12px serif';
    ctx.fillText("●  Settlement", lx + 15, ly + 50);

    const lcx = lx + 20, lcy = ly + 75;
    ctx.fillStyle = '#A6A6A6'; ctx.strokeStyle = colors.ink; ctx.lineWidth = 1;
    ctx.fillRect(lcx - 5, lcy - 8, 3, 8); ctx.strokeRect(lcx - 5, lcy - 8, 3, 8);
    ctx.fillRect(lcx + 2, lcy - 8, 3, 8); ctx.strokeRect(lcx + 2, lcy - 8, 3, 8);
    ctx.fillRect(lcx - 2, lcy - 5, 4, 5); ctx.strokeRect(lcx - 2, lcy - 5, 4, 5);
    ctx.fillStyle = colors.text;
    ctx.fillText("Castle", lx + 35, ly + 75);

    ctx.fillText("▲  Mountain", lx + 15, ly + 95);
    ctx.fillText("☁  Forest", lx + 15, ly + 115);

    const compX = width - 80, compY = height - 80;
    ctx.strokeStyle = colors.ink; ctx.lineWidth = 3; ctx.beginPath();
    ctx.moveTo(compX, compY - 40); ctx.lineTo(compX + 8, compY - 8); ctx.lineTo(compX + 40, compY); ctx.lineTo(compX + 8, compY + 8); ctx.lineTo(compX, compY + 40); ctx.lineTo(compX - 8, compY + 8); ctx.lineTo(compX - 40, compY); ctx.lineTo(compX - 8, compY - 8); ctx.closePath(); ctx.stroke();
    ctx.fillStyle = colors.text; ctx.font = 'bold 24px serif'; ctx.textAlign = 'center'; ctx.fillText("N", compX, compY - 50);
  }, [seed, roughness, vegetation, hillDensity, waterLevel, cityCount, castleCount, shipCount, lakeCount, colors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        canvas.width = 2048; canvas.height = 1536;
        const ctx = canvas.getContext('2d');
        generateMap(ctx, canvas.width, canvas.height);
    }
  }, [generateMap]);

  const handleDownload = () => {
    const canvas = canvasRef.current; const link = document.createElement('a');
    link.download = `fantasy_map_${seed}.png`; link.href = canvas.toDataURL(); link.click();
    addToast({ title: 'Decree Issued', message: 'The map has been inscribed into your archives.', duration: 3000 });
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-serif selection:bg-[#8C7B6C] selection:text-[#F0E6D2]">
      <Seo
        title="Fantasy Map Generator | Fezcodex"
        description="Generate Middle-earth style fantasy maps with mountains, rivers, and castles."
        keywords={['fantasy', 'map', 'generator', 'middle-earth', 'castle', 'rpg', 'dnd']}
      />
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col max-w-7xl relative z-10">
        <Link to="/apps" className="group text-stone-600 hover:text-stone-900 hover:underline flex items-center justify-center gap-2 text-lg mb-4">
          <ArrowLeftIcon className="text-xl transition-transform group-hover:-translate-x-1" /> Back to Apps
        </Link>
        <div className="flex flex-col items-center mb-8">
            <h1 className="text-5xl md:text-6xl font-black text-[#2C1B11] tracking-tighter mb-2">Cartographer</h1>
            <div className="w-24 h-1 bg-[#8C7B6C] mb-2"></div>
            <p className="text-[#5C4936] italic text-lg">"The world is not in your books and maps, it's out there."</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-grow">
          <div className="lg:col-span-1 space-y-6 bg-[#EADBC4] p-6 rounded-sm shadow-xl border-4 border-[#3E2F26] h-fit relative">
            <div className="border-b-2 border-[#8C7B6C] pb-4 mb-4">
                <h2 className="text-xl font-bold uppercase tracking-widest text-[#3E2F26] flex items-center gap-2"><ScrollIcon size={24}/> Parameters</h2>
            </div>
            <div className="flex flex-col gap-2 mb-6">
              <button onClick={() => setSeed(Date.now())} className="w-full py-3 px-4 bg-[#3E2F26] text-[#F0E6D2] rounded-sm hover:bg-[#2C1B11] flex items-center justify-center gap-2 transition-all font-serif uppercase tracking-widest font-bold shadow-md">
                <DiceFiveIcon size={20} /> Discover
              </button>
               <button onClick={handleDownload} className="w-full py-3 bg-[#8C7B6C] text-[#F0E6D2] rounded-sm hover:bg-[#7A6A5C] shadow-md transition-all flex items-center justify-center gap-2 font-serif uppercase tracking-widest font-bold">
                <DownloadSimpleIcon size={20} /> Download
              </button>
            </div>
            <div className="space-y-6">
               <MedievalSlider label="Mountains" value={roughness} onChange={setRoughness} min={0} max={1.5} step={0.1} />
               <MedievalSlider label="Forests" value={vegetation} onChange={setVegetation} min={0} max={1} step={0.1} />
               <MedievalSlider label="Hills" value={hillDensity} onChange={setHillDensity} min={0} max={1} step={0.1} />
               <MedievalSlider label="Sea Level" value={waterLevel} onChange={setWaterLevel} min={0.1} max={0.8} step={0.05} />
               <MedievalSlider label="Cities" value={cityCount} onChange={setCityCount} min={1} max={30} step={1} />
               <MedievalSlider label="Castles" value={castleCount} onChange={setCastleCount} min={0} max={10} step={1} />
               <MedievalSlider label="Lakes" value={lakeCount} onChange={setLakeCount} min={0} max={15} step={1} />
               <MedievalSlider label="Ships" value={shipCount} onChange={setShipCount} min={0} max={10} step={1} />
            </div>
          </div>

          <div className="lg:col-span-3 relative">
             <div className="absolute -inset-2 bg-[#3E2F26] rounded-sm shadow-2xl"></div>
             <div className="absolute -inset-1 bg-[#8C7B6C] rounded-sm"></div>
             <div className="relative bg-[#F0E6D2] rounded-sm overflow-hidden h-full flex items-center justify-center">
                 <canvas ref={canvasRef} className="max-w-full h-auto" style={{ maxHeight: '750px', aspectRatio: '4/3', filter: 'sepia(0.15) contrast(1.05)' }} />
                 <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(44,27,17,0.3)]"></div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FantasyMapGeneratorPage;
