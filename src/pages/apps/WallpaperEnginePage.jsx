import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DownloadSimpleIcon,
  ArrowsClockwiseIcon,
  MonitorIcon,
  PaletteIcon,
  ShapesIcon,
  ArrowLeftIcon,
  CheckIcon
} from '@phosphor-icons/react';
import { Link } from 'react-router-dom';
import CustomSlider from '../../components/CustomSlider';
import CustomDropdown from '../../components/CustomDropdown';
import useSeo from '../../hooks/useSeo';
import { useToast } from '../../hooks/useToast';

const COLOR_PRESETS = [
  { label: 'Default', value: 'default', colors: ['#10b981', '#3b82f6', '#050505'] },
  { label: 'Classic Fez', value: 'classic', colors: ['#f87171', '#fb923c', '#34d399'] },
  { label: 'Cyberpunk', value: 'cyberpunk', colors: ['#fcee0a', '#00ff9f', '#050505', '#ffffff'] },
  { label: 'Vaporwave', value: 'vaporwave', colors: ['#ff71ce', '#01cdfe', '#05ffa1', '#b967ff', '#fffb96'] },
  { label: 'Matrix', value: 'matrix', colors: ['#00ff41', '#008f11', '#003b00', '#0d0208'] },
  { label: 'Deep Sea', value: 'ocean', colors: ['#0ea5e9', '#2dd4bf', '#1e1b4b', '#f0f9ff'] },
  { label: 'Monochrome', value: 'mono', colors: ['#ffffff', '#a3a3a3', '#404040', '#000000'] },
  { label: 'Forerunner Blue', value: 'forerunner', colors: ['#00f2ff', '#0066ff', '#001a33', '#050505'] },
  { label: 'UNSC Green', value: 'unsc', colors: ['#94ff44', '#3d5c1a', '#1a240d', '#050505'] },
  { label: 'Pip-Boy Amber', value: 'pipboy_amber', colors: ['#ffb642', '#8a5d00', '#211500', '#050505'] },
  { label: 'Pip-Boy Green', value: 'pipboy_green', colors: ['#18e73c', '#005c00', '#001a00', '#050505'] },
  { label: 'Cyberpunk Red', value: 'cyber_red', colors: ['#ff003c', '#00fff9', '#1a1a1a', '#050505'] },
  { label: 'Custom', value: 'custom', colors: [] },
];

const STYLES = [
  { label: 'Bauhaus Grid', value: 'bauhaus' },
  { label: 'Tech Circuit', value: 'circuit' },
  { label: 'Geometric Flow', value: 'flow' },
  { label: 'Digital Rain', value: 'rain' },
  { label: 'Brutalist Blocks', value: 'brutalist' },
  { label: 'Glitch Stream', value: 'glitch' },
  { label: 'Solar Burst', value: 'solar' },
  { label: 'Data Nodes', value: 'nodes' },
  { label: 'Cyber Mesh', value: 'mesh' },
  { label: 'Terminal Echo', value: 'echo' },
  { label: 'Isometric Grid', value: 'iso' },
  { label: 'Organic Noise', value: 'noise' },
  { label: 'Type Matrix', value: 'typematrix' },
  { label: 'Pip-Boy Interface', value: 'pipboy' },
  { label: 'Stellar Cartography', value: 'stellar' },
  { label: 'Geometric Circles', value: 'circles' },
  { label: 'Pixel Construct', value: 'pixel' },
  { label: 'Bio-Helix Protocol', value: 'biohelix' },
  { label: 'Fluent Mosaic', value: 'fluent' },
  { label: 'Document Protocol', value: 'docs' },
  { label: 'Night City Interface', value: 'nightcity' },
  { label: 'Global Connectivity', value: 'global' },
  { label: 'Schematic Protocol', value: 'schematic' },
];

const RESOLUTIONS = [
  { label: 'Full HD (1080p)', value: '1080', width: 1920, height: 1080 },
  { label: '4K Ultra HD', value: '4k', width: 3840, height: 2160 },
  { label: '8K Master', value: '8k', width: 7680, height: 4320 },
  { label: 'Phone (Vertical)', value: 'phone', width: 1170, height: 2532 },
];

const WallpaperEnginePage = () => {
  useSeo({
    title: 'Procedural Wallpaper Engine | Fezcodex',
    description: 'Construct high-resolution procedural wallpapers using generative algorithms and technical protocols.',
  });

  const { addToast } = useToast();
  const canvasRef = useRef(null);

  const [seed, setSeed] = useState(() => Math.random().toString(36).substring(7));
  const [style, setStyle] = useState('bauhaus');
  const [complexity, setComplexity] = useState(50);
  const [noise, setNoise] = useState(15);
  const [preset, setPreset] = useState('default');
  const [customColors, setCustomColors] = useState(['#10b981', '#3b82f6', '#050505']);
  const [resolution, setResolution] = useState('4k');
  const [isGenerating, setIsGenerating] = useState(false);

  const rng = useCallback((currentSeed) => {
    let h = 0xdeadbeef;
    for (let i = 0; i < currentSeed.length; i++) {
      h = Math.imul(h ^ currentSeed.charCodeAt(i), 2654435761);
    }
    return () => {
      h = Math.imul(h ^ (h >>> 16), 2246822507);
      h = Math.imul(h ^ (h >>> 13), 3266489909);
      return ((h ^= h >>> 16) >>> 0) / 4294967296;
    };
  }, []);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const res = RESOLUTIONS.find(r => r.value === resolution);
    canvas.width = res.width;
    canvas.height = res.height;

    const nextRand = rng(seed);
    const activePreset = COLOR_PRESETS.find(p => p.value === preset);
    const colors = preset === 'custom' ? customColors : activePreset.colors;

    ctx.fillStyle = colors[colors.length - 1];
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.lineWidth = 1;
    const gridSize = 50;
    for(let x = 0; x < canvas.width; x += gridSize) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for(let y = 0; y < canvas.height; y += gridSize) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    if (style === 'bauhaus') {
      const cellCount = Math.floor(5 + (complexity / 10));
      const cellW = canvas.width / cellCount;
      const cellH = canvas.height / (cellCount * (canvas.height / canvas.width));
      for (let x = 0; x < cellCount; x++) {
        for (let y = 0; y < cellCount * (canvas.height / canvas.width); y++) {
          if (nextRand() > 0.4) {
            const posX = x * cellW;
            const posY = y * cellH;
            const color = colors[Math.floor(nextRand() * (colors.length - 1))];
            const shapeType = Math.floor(nextRand() * 4);
            ctx.save();
            ctx.translate(posX + cellW/2, posY + cellH/2);
            ctx.rotate((Math.floor(nextRand() * 4) * 90) * Math.PI / 180);
            ctx.fillStyle = color;
            ctx.globalAlpha = 0.8;
            const size = cellW * 0.8;
            if (shapeType === 0) ctx.fillRect(-size/2, -size/2, size, size);
            else if (shapeType === 1) { ctx.beginPath(); ctx.arc(0, 0, size/2, 0, Math.PI * 2); ctx.fill(); }
            else if (shapeType === 2) { ctx.beginPath(); ctx.moveTo(-size/2, size/2); ctx.lineTo(size/2, size/2); ctx.lineTo(0, -size/2); ctx.closePath(); ctx.fill(); }
            else { ctx.beginPath(); ctx.moveTo(-size/2, -size/2); ctx.arcTo(size/2, -size/2, size/2, size/2, size/2); ctx.lineTo(-size/2, size/2); ctx.closePath(); ctx.fill(); }
            ctx.restore();
          }
        }
      }
    } else if (style === 'circuit') {
      const lines = 20 + complexity;
      for (let i = 0; i < lines; i++) {
        const x = Math.floor(nextRand() * 20) * (canvas.width / 20);
        const y = Math.floor(nextRand() * 20) * (canvas.height / 20);
        const length = (100 + nextRand() * 400) * (canvas.width / 1920);
        const horizontal = nextRand() > 0.5;
        const color = colors[Math.floor(nextRand() * (colors.length - 1))];
        ctx.strokeStyle = color;
        ctx.lineWidth = 2 + nextRand() * 4;
        ctx.beginPath();
        ctx.moveTo(x, y);
        if (horizontal) ctx.lineTo(x + length, y); else ctx.lineTo(x, y + length);
        ctx.stroke();
        if (nextRand() > 0.5) { ctx.fillStyle = color; ctx.beginPath(); ctx.arc(x, y, ctx.lineWidth * 2, 0, Math.PI * 2); ctx.fill(); }
      }
    } else if (style === 'flow') {
      const nodes = 10 + Math.floor(complexity / 2);
      for (let i = 0; i < nodes; i++) {
        const x = nextRand() * canvas.width;
        const y = nextRand() * canvas.height;
        const radius = (50 + nextRand() * 300) * (canvas.width / 1920);
        const color = colors[Math.floor(nextRand() * (colors.length - 1))];
        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, color);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.globalCompositeOperation = 'screen';
        ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    } else if (style === 'rain') {
      ctx.font = `${Math.floor(20 * (canvas.width/1920))}px monospace`;
      const columns = Math.floor(canvas.width / 25);
      for(let i = 0; i < columns; i++) {
        const x = i * 25;
        let y = nextRand() * canvas.height;
        const len = 5 + nextRand() * 20;
        for(let j = 0; j < len; j++) {
          const alpha = 1 - (j / len);
          ctx.fillStyle = colors[Math.floor(nextRand() * (colors.length - 1))];
          ctx.globalAlpha = alpha;
          const char = String.fromCharCode(0x30A0 + Math.random() * 96);
          ctx.fillText(char, x, y + (j * 25));
        }
      }
      ctx.globalAlpha = 1.0;
    } else if (style === 'brutalist') {
      const count = Math.floor(5 + complexity / 5);
      for (let i = 0; i < count; i++) {
        const w = (nextRand() * 400 + 100) * (canvas.width / 1920);
        const h = (nextRand() * 400 + 100) * (canvas.height / 1080);
        const x = nextRand() * (canvas.width - w);
        const y = nextRand() * (canvas.height - h);
        const color = colors[Math.floor(nextRand() * (colors.length - 1))];
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.9;
        ctx.fillRect(x, y, w, h);
        ctx.fillStyle = '#fff';
        ctx.font = `${Math.floor(12 * (canvas.width/1920))}px monospace`;
        ctx.fillText(`BLOCK_ID_${Math.floor(nextRand() * 10000)}`, x + 10, y + 20);
      }
      ctx.globalAlpha = 1.0;
    } else if (style === 'glitch') {
      const count = Math.floor(20 + complexity);
      for (let i = 0; i < count; i++) {
        const x = nextRand() * canvas.width;
        const y = nextRand() * canvas.height;
        const w = (nextRand() * canvas.width * 0.5);
        const h = (nextRand() * 20 + 2) * (canvas.height / 1080);
        const color = colors[Math.floor(nextRand() * (colors.length - 1))];
        ctx.fillStyle = color;
        ctx.globalAlpha = nextRand() * 0.8;
        ctx.fillRect(x - w/2, y, w, h);
        if (nextRand() > 0.8) { ctx.strokeStyle = '#fff'; ctx.strokeRect(x - w/2, y, w, h); }
      }
      ctx.globalAlpha = 1.0;
    } else if (style === 'solar') {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const rays = Math.floor(20 + complexity);
      for (let i = 0; i < rays; i++) {
        const angle = (nextRand() * 360) * Math.PI / 180;
        const length = (nextRand() * canvas.width * 0.8);
        const color = colors[Math.floor(nextRand() * (colors.length - 1))];
        ctx.strokeStyle = color;
        ctx.lineWidth = 1 + nextRand() * 10;
        ctx.globalAlpha = 0.3 + nextRand() * 0.5;
        ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(centerX + Math.cos(angle) * length, centerY + Math.sin(angle) * length); ctx.stroke();
      }
      ctx.globalAlpha = 1.0;
    } else if (style === 'nodes') {
      const count = Math.floor(10 + complexity / 2);
      const points = [];
      for (let i = 0; i < count; i++) { points.push({ x: nextRand() * canvas.width, y: nextRand() * canvas.height, color: colors[Math.floor(nextRand() * (colors.length - 1))] }); }
      points.forEach((p, i) => {
        ctx.strokeStyle = p.color; ctx.globalAlpha = 0.2; ctx.lineWidth = 1;
        points.slice(i + 1).forEach(p2 => { const dist = Math.hypot(p.x - p2.x, p.y - p2.y); if (dist < canvas.width * 0.3) { ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke(); } });
        ctx.globalAlpha = 0.8; ctx.fillStyle = p.color; ctx.beginPath(); ctx.arc(p.x, p.y, 4, 0, Math.PI * 2); ctx.fill();
        if (nextRand() > 0.7) { ctx.fillStyle = '#fff'; ctx.font = `${Math.floor(10 * (canvas.width/1920))}px monospace`; ctx.fillText(`NODE_${i.toString(16).toUpperCase()}`, p.x + 10, p.y + 10); }
      });
    } else if (style === 'mesh') {
      const size = (80 + (100 - complexity)) * (canvas.width / 1920);
      const rows = canvas.height / size + 1;
      const cols = canvas.width / size + 1;
      ctx.strokeStyle = colors[0]; ctx.lineWidth = 1;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; cols > c; c++) {
          const x = c * size * 1.5;
          const y = r * size * Math.sqrt(3) + (c % 2 === 0 ? 0 : (size * Math.sqrt(3)) / 2);
          ctx.globalAlpha = 0.1 + nextRand() * 0.4;
          ctx.beginPath();
          for (let a = 0; a < 6; a++) { const angle = (a * 60) * Math.PI / 180; const px = x + size * Math.cos(angle); const py = y + size * Math.sin(angle); if (a === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py); }
          ctx.closePath();
          if (nextRand() > 0.8) { ctx.fillStyle = colors[Math.floor(nextRand() * (colors.length - 1))]; ctx.fill(); }
          ctx.stroke();
        }
      }
    } else if (style === 'echo') {
      const streams = Math.floor(10 + complexity / 2);
      ctx.font = `bold ${Math.floor(14 * (canvas.width/1920))}px monospace`;
      for (let i = 0; i < streams; i++) {
        const x = nextRand() * canvas.width; let y = nextRand() * canvas.height;
        const color = colors[Math.floor(nextRand() * (colors.length - 1))];
        const text = Array.from({length: 20}, () => Math.floor(nextRand() * 256).toString(16).padStart(2, '0')).join(' ');
        ctx.fillStyle = color; ctx.globalAlpha = 0.6; ctx.save(); ctx.translate(x, y);
        if (nextRand() > 0.5) ctx.rotate(Math.PI / 2); ctx.fillText(`>> ${text}`, 0, 0);
        if (nextRand() > 0.8) { ctx.strokeStyle = '#fff'; ctx.lineWidth = 0.5; ctx.strokeRect(-5, -15, ctx.measureText(text).width + 40, 20); }
        ctx.restore();
      }
    } else if (style === 'iso') {
      const size = (60 + (100 - complexity)) * (canvas.width / 1920);
      const cols = canvas.width / size + 2;
      const rows = canvas.height / (size * 0.5) + 2;
      for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
          const x = (j - (i % 2 === 0 ? 0.5 : 0)) * size;
          const y = i * size * 0.25;
          if (nextRand() > 0.6) {
            const color = colors[Math.floor(nextRand() * (colors.length - 1))];
            ctx.globalAlpha = 0.4 + nextRand() * 0.4;
            ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + size * 0.5, y + size * 0.25); ctx.lineTo(x, y + size * 0.5); ctx.lineTo(x - size * 0.5, y + size * 0.25); ctx.closePath();
            ctx.fillStyle = color; ctx.fill();
            if (nextRand() > 0.8) { ctx.strokeStyle = '#fff'; ctx.stroke(); }
          }
        }
      }
    } else if (style === 'noise') {
      const paths = Math.floor(5 + complexity / 10);
      for (let i = 0; i < paths; i++) {
        let x = nextRand() * canvas.width; let y = nextRand() * canvas.height;
        const color = colors[Math.floor(nextRand() * (colors.length - 1))];
        ctx.beginPath(); ctx.moveTo(x, y); ctx.strokeStyle = color; ctx.lineWidth = 1 + nextRand() * 5; ctx.globalAlpha = 0.3;
        for (let j = 0; j < 100; j++) { x += (nextRand() - 0.5) * 150; y += (nextRand() - 0.5) * 150; ctx.lineTo(x, y); }
        ctx.stroke();
      }
    } else if (style === 'typematrix') {
      const items = Math.floor(20 + complexity);
      for (let i = 0; i < items; i++) {
        const x = nextRand() * canvas.width; const y = nextRand() * canvas.height;
        const color = colors[Math.floor(nextRand() * (colors.length - 1))];
        const fontSize = Math.floor((10 + nextRand() * 40) * (canvas.width / 1920));
        ctx.font = `${nextRand() > 0.5 ? 'bold ' : ''}${fontSize}px font-mono`;
        ctx.fillStyle = color; ctx.globalAlpha = 0.5 + nextRand() * 0.5;
        const labels = ['SYS_CORE', 'DATA_STREAM', 'VOID_0', 'NULL_PTR', 'AUTH_OK', 'FETCH_META', 'DECRYPT'];
        const text = nextRand() > 0.3 ? labels[Math.floor(nextRand() * labels.length)] : Math.random().toString(16).slice(2, 10).toUpperCase();
        ctx.fillText(text, x, y);
        if (nextRand() > 0.7) { ctx.strokeStyle = color; ctx.lineWidth = 1; ctx.strokeRect(x - 5, y - fontSize, ctx.measureText(text).width + 10, fontSize + 5); }
      }
    } else if (style === 'pipboy') {
      const mainColor = colors[0]; const bgColor = colors[colors.length - 1];
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = mainColor; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.1;
      for (let y = 0; y < canvas.height; y += 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }
      ctx.globalAlpha = 1.0; ctx.fillStyle = mainColor; ctx.font = `bold ${Math.floor(24 * (canvas.width/1920))}px monospace`;
      const tabs = ['STAT', 'INV', 'DATA', 'MAP', 'RADIO'];
      tabs.forEach((tab, i) => { const x = 100 + i * (canvas.width / 6); ctx.fillText(tab, x, 80); if (tab === 'DATA') { ctx.fillRect(x - 10, 90, ctx.measureText(tab).width + 20, 4); } });
      ctx.fillRect(50, 100, canvas.width - 100, 2);
      const centerX = canvas.width * 0.75; const centerY = canvas.height * 0.5; const radius = 200 * (canvas.width / 1920);
      ctx.strokeStyle = mainColor; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(centerX, centerY, radius, 0, Math.PI * 2); ctx.stroke();
      ctx.globalAlpha = 0.3; for (let r = 1; r < 4; r++) { ctx.beginPath(); ctx.arc(centerX, centerY, (radius / 4) * r, 0, Math.PI * 2); ctx.stroke(); }
      ctx.globalAlpha = 0.8; for (let i = 0; i < 5; i++) { const bx = centerX + (nextRand() - 0.5) * radius * 1.5; const by = centerY + (nextRand() - 0.5) * radius * 1.5; ctx.fillRect(bx, by, 8, 8); }
      ctx.font = `${Math.floor(18 * (canvas.width/1920))}px monospace`;
      const entries = ['FEZ_CODEX_OS v4.0.2', 'MEMORY_BANK: OK', 'RAD_LEVEL: 0.02 mSv', 'LOCATION: NEW_VEGAS_STRIP', 'SIGNAL: INTERCEPTED', 'ENCRYPTION: ACTIVE', 'USER: COURIER_SIX'];
      entries.forEach((text, i) => { ctx.globalAlpha = 0.9; ctx.fillText(`> ${text}`, 100, 250 + i * 50); ctx.globalAlpha = 0.2; ctx.fillRect(100, 260 + i * 50, 300, 10); ctx.globalAlpha = 0.7; ctx.fillRect(100, 260 + i * 50, nextRand() * 300, 10); });
      const scanY = (Date.now() / 20) % canvas.height; const grad = ctx.createLinearGradient(0, scanY - 50, 0, scanY); grad.addColorStop(0, 'transparent'); grad.addColorStop(1, mainColor); ctx.fillStyle = grad; ctx.globalAlpha = 0.15; ctx.fillRect(0, scanY - 100, canvas.width, 100);
      ctx.globalAlpha = 1.0; ctx.lineWidth = 4; const cp = 40; ctx.beginPath(); ctx.moveTo(cp, cp+50); ctx.lineTo(cp, cp); ctx.lineTo(cp+50, cp); ctx.stroke(); ctx.beginPath(); ctx.moveTo(canvas.width-cp, canvas.height-cp-50); ctx.lineTo(canvas.width-cp, canvas.height-cp); ctx.lineTo(canvas.width-cp-50, canvas.height-cp); ctx.stroke();
      const compassY = canvas.height - 150; ctx.globalAlpha = 0.6; ctx.fillRect(100, compassY, canvas.width - 200, 2); ctx.font = `${Math.floor(14 * (canvas.width/1920))}px monospace`;
      for(let i = 0; i <= 20; i++) { const x = 100 + i * ((canvas.width - 200) / 20); const h = i % 5 === 0 ? 15 : 8; ctx.fillRect(x, compassY - h, 2, h); if (i % 5 === 0) { const dir = ['W', 'NW', 'N', 'NE', 'E'][i / 5]; if(dir) ctx.fillText(dir, x - 5, compassY - 25); } }
      const vbX = 100; const vbY = 650; ctx.globalAlpha = 1.0; ctx.strokeRect(vbX, vbY, 200, 200); ctx.font = `bold ${Math.floor(12 * (canvas.width/1920))}px monospace`; ctx.fillText("F.C.D.X. STATUS", vbX, vbY - 10); ctx.beginPath(); ctx.arc(vbX + 100, vbY + 80, 40, 0, Math.PI * 2); ctx.moveTo(vbX + 100, vbY + 120); ctx.lineTo(vbX + 100, vbY + 180); ctx.moveTo(vbX + 100, vbY + 140); ctx.lineTo(vbX + 60, vbY + 110); ctx.moveTo(vbX + 100, vbY + 140); ctx.lineTo(vbX + 140, vbY + 110); ctx.stroke(); ctx.fillText("DISCONN", vbX + 50, vbY + 195);
      ctx.font = `${Math.floor(10 * (canvas.width/1920))}px monospace`; ctx.globalAlpha = 0.4; ctx.fillText("AP: 85/85", canvas.width - 200, canvas.height - 80); ctx.fillText("HP: 240/240", canvas.width - 200, canvas.height - 60); ctx.fillText("VOLTAGE: 1.2V", 100, canvas.height - 80); ctx.fillText("OS_BUILD: 0.8.7", 100, canvas.height - 60);
    } else if (style === 'stellar') {
      const mainColor = colors[0]; const accentColor = colors[1] || colors[0]; const bgColor = colors[colors.length - 1];
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2; const centerY = canvas.height / 2; ctx.strokeStyle = mainColor; ctx.lineWidth = 0.5; ctx.globalAlpha = 0.1;
      for (let r = 1; r < 6; r++) { ctx.beginPath(); ctx.arc(centerX, centerY, (canvas.width / 10) * r, 0, Math.PI * 2); ctx.stroke(); }
      for (let a = 0; a < 12; a++) { const angle = (a * 30) * Math.PI / 180; ctx.beginPath(); ctx.moveTo(centerX, centerY); ctx.lineTo(centerX + Math.cos(angle) * canvas.width, centerY + Math.sin(angle) * canvas.width); ctx.stroke(); }
      const starCount = Math.floor(50 + complexity); const stars = []; for (let i = 0; i < starCount; i++) { stars.push({ x: nextRand() * canvas.width, y: nextRand() * canvas.height, size: nextRand() * 3 + 1, color: nextRand() > 0.8 ? accentColor : '#fff' }); }
      ctx.globalAlpha = 0.15; ctx.lineWidth = 1; stars.forEach((s, i) => { stars.slice(i + 1).forEach(s2 => { const d = Math.hypot(s.x - s2.x, s.y - s2.y); if (d < canvas.width * 0.15) { ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s2.x, s2.y); ctx.stroke(); } }); });
      stars.forEach((s, i) => { ctx.globalAlpha = 0.8; ctx.fillStyle = s.color; ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2); ctx.fill(); if (nextRand() > 0.9) { ctx.globalAlpha = 0.4; ctx.font = `${Math.floor(10 * (canvas.width/1920))}px monospace`; ctx.fillText(`STAR_${i.toString(16).toUpperCase()}`, s.x + 8, s.y + 8); } });
      ctx.globalAlpha = 0.2; ctx.strokeStyle = accentColor; for (let i = 0; i < 3; i++) { ctx.save(); ctx.translate(centerX, centerY); ctx.rotate(nextRand() * Math.PI); ctx.beginPath(); ctx.ellipse(0, 0, (nextRand() * 400 + 200) * (canvas.width/1920), (nextRand() * 200 + 100) * (canvas.width/1920), 0, 0, Math.PI * 2); ctx.stroke(); ctx.restore(); }
      ctx.globalAlpha = 0.6; ctx.fillStyle = mainColor; ctx.font = `bold ${Math.floor(12 * (canvas.width/1920))}px monospace`; for (let i = 0; i < 4; i++) { const x = nextRand() * canvas.width; const y = nextRand() * canvas.height; ctx.fillText(`[SECTOR_${Math.floor(nextRand() * 9999).toString().padStart(4, '0')}]`, x, y); ctx.fillRect(x, y + 5, 100, 1); }
    } else if (style === 'circles') {
      const mainColor = colors[0]; const accentColor = colors[1] || colors[0]; const bgColor = colors[colors.length - 1];
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const centerX = canvas.width / 2; const centerY = canvas.height / 2; const baseSize = Math.min(canvas.width, canvas.height);
      const count = Math.floor(5 + complexity / 5); for (let i = 0; i < count; i++) { const x = nextRand() * canvas.width; const y = nextRand() * canvas.height; const radius = (nextRand() * 200 + 50) * (baseSize / 1000); const color = nextRand() > 0.5 ? mainColor : accentColor; ctx.save(); ctx.translate(x, y); ctx.strokeStyle = color; ctx.lineWidth = 1 + nextRand() * 3; ctx.globalAlpha = 0.2 + nextRand() * 0.4; ctx.beginPath(); ctx.arc(0, 0, radius, 0, Math.PI * 2); ctx.stroke(); if (nextRand() > 0.5) { ctx.globalAlpha = 0.1; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(0, 0, radius * 0.8, 0, Math.PI * 2); ctx.fill(); } if (nextRand() > 0.7) { ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.arc(0, 0, radius + 10, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]); } if (nextRand() > 0.6) { ctx.globalAlpha = 0.6; ctx.fillStyle = color; ctx.font = `${Math.floor(10 * (baseSize/1000))}px monospace`; ctx.fillText(`RAD: ${Math.floor(radius)}px`, radius + 5, 0); ctx.fillText(`PHI: ${Math.floor(nextRand() * 360)}°`, radius + 5, 12); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(radius, 0); ctx.stroke(); } ctx.restore(); }
      ctx.globalAlpha = 0.1; ctx.strokeStyle = mainColor; ctx.lineWidth = 10; ctx.beginPath(); ctx.arc(centerX, centerY, baseSize * 0.35, 0, Math.PI * 2); ctx.stroke(); ctx.globalAlpha = 0.3; ctx.setLineDash([2, 10]); ctx.beginPath(); ctx.arc(centerX, centerY, baseSize * 0.37, 0, Math.PI * 2); ctx.stroke(); ctx.setLineDash([]);
    } else if (style === 'pixel') {
      const mainColor = colors[0]; const accentColor = colors[1] || colors[0]; const bgColor = colors[colors.length - 1];
      ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);
      const pixelSize = Math.floor((100 - complexity / 1.5 + 10) * (canvas.width / 1920));
      const cols = Math.ceil(canvas.width / pixelSize); const rows = Math.ceil(canvas.height / pixelSize);
      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          const r = nextRand(); const px = x * pixelSize; const py = y * pixelSize;
          if (r > 0.7) { ctx.fillStyle = r > 0.9 ? accentColor : mainColor; ctx.globalAlpha = 0.2 + nextRand() * 0.5; ctx.fillRect(px, py, pixelSize, pixelSize); }
          else if (r > 0.5) { ctx.fillStyle = mainColor; ctx.globalAlpha = 0.1; const sub = pixelSize / 4; for (let i = 0; i < 4; i++) { for (let j = 0; j < 4; j++) { if ((i + j) % 2 === 0) { ctx.fillRect(px + i * sub, py + j * sub, sub, sub); } } } }
          else if (r < 0.05) { ctx.fillStyle = '#fff'; ctx.globalAlpha = 0.8; const center = pixelSize / 2; const s = pixelSize * 0.2; ctx.fillRect(px + center - s/2, py + 2, s, pixelSize - 4); ctx.fillRect(px + 2, py + center - s/2, pixelSize - 4, s); }
        }
      }
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) { if (nextRand() > 0.5) { const ly = nextRand() * canvas.height; ctx.globalAlpha = 0.1; ctx.beginPath(); ctx.moveTo(0, ly); ctx.lineTo(canvas.width, ly); ctx.stroke(); ctx.font = `${Math.floor(10 * (canvas.width/1920))}px monospace`; ctx.fillText(`PX_SECTOR_${Math.floor(nextRand() * 1000)}`, 10, ly - 5); } }
    } else if (style === 'biohelix') {
      const mainColor = colors[0];
      const accentColor = colors[1] || colors[0];
      const bgColor = colors[colors.length - 1];
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const strands = Math.floor(3 + complexity / 15);
      const spacing = canvas.width / (strands + 1);

      for (let s = 0; s < strands; s++) {
        const centerX = spacing * (s + 1);
        const waveHeight = (40 + nextRand() * 60) * (canvas.width / 1920);
        const freq = (0.005 + nextRand() * 0.01);
        const color = nextRand() > 0.5 ? mainColor : accentColor;

        // Helix connection lines (Nucleotides)
        for (let y = 0; y < canvas.height; y += 30) {
          const x1 = centerX + Math.sin(y * freq) * waveHeight;
          const x2 = centerX + Math.sin(y * freq + Math.PI) * waveHeight;

          ctx.strokeStyle = color;
          ctx.globalAlpha = 0.3;
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.stroke();

          if (nextRand() > 0.8) {
            ctx.fillStyle = '#fff';
            ctx.font = `${Math.floor(8 * (canvas.width/1920))}px monospace`;
            const bases = ['A', 'T', 'C', 'G'];
            ctx.fillText(bases[Math.floor(nextRand() * 4)], (x1 + x2) / 2, y);
          }
        }

        // Main Strands
        ctx.lineWidth = 3;
        ctx.globalAlpha = 0.8;
        ctx.strokeStyle = color;

        // Strand 1
        ctx.beginPath();
        for (let y = 0; y < canvas.height; y += 5) {
          const x = centerX + Math.sin(y * freq) * waveHeight;
          if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Strand 2
        ctx.beginPath();
        for (let y = 0; y < canvas.height; y += 5) {
          const x = centerX + Math.sin(y * freq + Math.PI) * waveHeight;
          if (y === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.stroke();

        // Technical bio-labels
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.5;
        ctx.font = `bold ${Math.floor(12 * (canvas.width/1920))}px monospace`;
        ctx.fillText(`GEN_STRAND_0x${s.toString(16).toUpperCase()}`, centerX + waveHeight + 20, 100 + s * 100);
        ctx.fillText(`SEQ_STABILITY: ${(90 + nextRand() * 10).toFixed(2)}%`, centerX + waveHeight + 20, 115 + s * 100);
      }
    } else if (style === 'fluent') {
      const mainColor = colors[0];
      const accentColor = colors[1] || colors[0];
      const bgColor = colors[colors.length - 1];
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const rows = Math.floor(3 + complexity / 20);
      const cols = Math.floor(rows * (canvas.width / canvas.height));
      const tileW = canvas.width / cols;
      const tileH = canvas.height / rows;

      for (let x = 0; x < cols; x++) {
        for (let y = 0; y < rows; y++) {
          if (nextRand() > 0.3) {
            const posX = x * tileW;
            const posY = y * tileH;
            const color = nextRand() > 0.7 ? accentColor : mainColor;

            // "Acrylic" Surface
            ctx.save();
            ctx.translate(posX + 10, posY + 10);
            const w = tileW - 20;
            const h = tileH - 20;

            const grad = ctx.createLinearGradient(0, 0, w, h);
            grad.addColorStop(0, color);
            grad.addColorStop(1, 'transparent');

            ctx.fillStyle = grad;
            ctx.globalAlpha = 0.1 + nextRand() * 0.3;
            ctx.fillRect(0, 0, w, h);

            // Tile Border (Reveal Highlight)
            ctx.strokeStyle = '#fff';
            ctx.globalAlpha = 0.05 + nextRand() * 0.1;
            ctx.lineWidth = 1;
            ctx.strokeRect(0, 0, w, h);

            // Technical Labels (Metro Style)
            if (nextRand() > 0.6) {
              ctx.globalAlpha = 0.4;
              ctx.fillStyle = '#fff';
              ctx.font = `${Math.floor(10 * (canvas.width/1920))}px monospace`;
              ctx.fillText(`TILE_0x${(x * y).toString(16).toUpperCase()}`, 10, 20);

              if (nextRand() > 0.5) {
                ctx.fillRect(10, 30, w * 0.3, 2);
              }
            }
            ctx.restore();
          }
        }
      }
        } else if (style === 'docs') {
          const mainColor = colors[0];
          const accentColor = colors[1] || colors[0];
          const bgColor = colors[colors.length - 1];
          ctx.fillStyle = bgColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const count = Math.floor(5 + complexity / 10);
          const paperW = 400 * (canvas.width / 1920);
          const paperH = 550 * (canvas.width / 1920);

          // Organized Distribution: Grid with Jitter
          const gridCols = Math.ceil(Math.sqrt(count * (canvas.width / canvas.height)));
          const gridRows = Math.ceil(count / gridCols);
          const cellW = canvas.width / gridCols;
          const cellH = canvas.height / gridRows;

          let drawnCount = 0;
          for (let r = 0; r < gridRows; r++) {
            for (let c = 0; gridCols > c; c++) {
              if (drawnCount >= count) break;

              // Position with jitter (mostly centered in its grid cell)
              const x = (c + 0.5) * cellW + (nextRand() - 0.5) * cellW * 0.4;
              const y = (r + 0.5) * cellH + (nextRand() - 0.5) * cellH * 0.4;
              const rot = (nextRand() - 0.5) * 30 * Math.PI / 180; // Reduced rotation for "stacked" look
              const color = nextRand() > 0.5 ? mainColor : accentColor;

              ctx.save();
              ctx.translate(x, y);
              ctx.rotate(rot);

              // Shadow
              ctx.shadowColor = 'rgba(0,0,0,0.5)';
              ctx.shadowBlur = 30;
              ctx.shadowOffsetX = 10;
              ctx.shadowOffsetY = 10;

              // Paper Base
              ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
              ctx.fillRect(-paperW/2, -paperH/2, paperW, paperH);

              // Reset shadow for content
              ctx.shadowColor = 'transparent';
              ctx.shadowBlur = 0;
              ctx.shadowOffsetX = 0;
              ctx.shadowOffsetY = 0;

              // Paper Border
              ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
              ctx.lineWidth = 1;
              ctx.strokeRect(-paperW/2, -paperH/2, paperW, paperH);

              // Content: Header
              ctx.fillStyle = color;
              ctx.globalAlpha = 0.8;
              ctx.font = `bold ${Math.floor(14 * (canvas.width/1920))}px monospace`;
              ctx.fillText(`FILE_ID: 0x${nextRand().toString(16).slice(2, 6).toUpperCase()}`, -paperW/2 + 20, -paperH/2 + 30);
              ctx.fillRect(-paperW/2 + 20, -paperH/2 + 40, paperW - 40, 2);

              // Content: "Text" lines
              ctx.globalAlpha = 0.3;
              for (let j = 0; j < 15; j++) {
                const lw = (paperW - 40) * (0.3 + nextRand() * 0.7);
                ctx.fillRect(-paperW/2 + 20, -paperH/2 + 70 + j * 25, lw, 4);
              }

              // Content: System Stamp
              if (nextRand() > 0.6) {
                ctx.save();
                ctx.rotate(-15 * Math.PI / 180);
                ctx.strokeStyle = '#f87171'; // Red stamp
                ctx.lineWidth = 2;
                ctx.globalAlpha = 0.6;
                const stampText = nextRand() > 0.5 ? 'CONFIDENTIAL' : 'CLASSIFIED';
                ctx.font = `bold ${Math.floor(20 * (canvas.width/1920))}px monospace`;
                const tw = ctx.measureText(stampText).width;
                ctx.strokeRect(-tw/2 - 10, paperH/4 - 25, tw + 20, 40);
                ctx.fillStyle = '#f87171';
                ctx.fillText(stampText, -tw/2, paperH/4 + 5);
                ctx.restore();
              }

              ctx.restore();
                        drawnCount++;
                      }
                    }
                  } else if (style === 'nightcity') {
                    const mainColor = colors[0];
                    const accentColor = colors[1] || colors[0];
                    const bgColor = colors[colors.length - 1];
                    ctx.fillStyle = bgColor;
                    ctx.fillRect(0, 0, canvas.width, canvas.height);

                    // 1. Scanlines
                    ctx.strokeStyle = mainColor;
                    ctx.globalAlpha = 0.05;
                    ctx.lineWidth = 1;
                    for (let y = 0; y < canvas.height; y += 2) {
                      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
                    }

                    // 2. Slanted Panels (Background Layer)
                    const panelCount = Math.floor(3 + complexity / 20);
                    for (let i = 0; i < panelCount; i++) {
                      const x = nextRand() * canvas.width;
                      const y = nextRand() * canvas.height;
                      const w = (300 + nextRand() * 600) * (canvas.width / 1920);
                      const h = (200 + nextRand() * 400) * (canvas.width / 1920);

                      ctx.save();
                      ctx.translate(x, y);
                      ctx.transform(1, 0, 0.2, 1, 0, 0); // Slant transform

                      ctx.fillStyle = mainColor;
                      ctx.globalAlpha = 0.02;
                      ctx.fillRect(0, 0, w, h);

                      ctx.strokeStyle = mainColor;
                      ctx.globalAlpha = 0.1;
                      ctx.strokeRect(0, 0, w, h);
                      ctx.restore();
                    }

                    // 3. Glitch Bars
                    const glitches = Math.floor(10 + complexity / 2);
                    for (let i = 0; i < glitches; i++) {
                      const x = nextRand() * canvas.width;
                      const y = nextRand() * canvas.height;
                      const w = (nextRand() * 400) * (canvas.width / 1920);
                      const h = (2 + nextRand() * 10) * (canvas.width / 1920);

                      ctx.fillStyle = nextRand() > 0.5 ? mainColor : accentColor;
                      ctx.globalAlpha = 0.4;
                      ctx.fillRect(x, y, w, h);

                      // Offset shadow for chromatic effect
                      ctx.fillStyle = '#fff';
                      ctx.globalAlpha = 0.2;
                      ctx.fillRect(x + 5, y + 2, w, h);
                    }

                    // 4. Interface Readouts
                    ctx.fillStyle = mainColor;
                    ctx.font = `bold ${Math.floor(40 * (canvas.width/1920))}px monospace`;
                    ctx.globalAlpha = 0.8;
                    ctx.fillText("BREACH_STATUS: NOMINAL", 100, 150);

                    ctx.font = `${Math.floor(12 * (canvas.width/1920))}px monospace`;
                    const readouts = [
                      `NC_NET_NODE: 0x${nextRand().toString(16).slice(2, 8).toUpperCase()}`,
                      'SYSTEM_AUTHORIZATION: OK',
                      'BIOMONITOR_SYNC: ACTIVE',
                      'RAM_USAGE: 42.8 GB',
                      'CYBER_DECK: MILITECH_PARELINE'
                    ];

                    readouts.forEach((r, idx) => {
                      ctx.globalAlpha = 0.6;
                      ctx.fillText(`>> ${r}`, 100, 200 + idx * 25);
                    });

                    // 5. Arasaka-style Red Alert
                    if (nextRand() > 0.7) {
                      ctx.save();
                      ctx.translate(canvas.width - 400, 100);
                      ctx.fillStyle = '#ff003c';
                      ctx.globalAlpha = 0.9;
                      ctx.fillRect(0, 0, 300, 60);
                      ctx.fillStyle = '#000';
                      ctx.font = `black ${Math.floor(20 * (canvas.width/1920))}px monospace`;
                      ctx.fillText("SAMURAI_LINK: OK", 20, 40);
                      ctx.restore();
                    }

                    // 6. Technical Overlay Dots
                    const dotCount = Math.floor(complexity);
                    for (let i = 0; i < dotCount; i++) {
                      ctx.fillStyle = '#fff';
                      ctx.globalAlpha = 0.1;
                              ctx.beginPath();
                              ctx.arc(nextRand() * canvas.width, nextRand() * canvas.height, 1, 0, Math.PI * 2);
                              ctx.fill();
                            }
                          } else if (style === 'global') {
                            const mainColor = colors[0];
                            const accentColor = colors[1] || colors[0];
                            const bgColor = colors[colors.length - 1];
                            ctx.fillStyle = bgColor;
                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                            const centerX = canvas.width / 2;
                            const centerY = canvas.height / 2;
                            const radius = Math.min(canvas.width, canvas.height) * 0.4;

                            // 1. Globe Sphere & Long/Lat
                            ctx.strokeStyle = mainColor;
                            ctx.lineWidth = 1;

                            // Outer rim
                            ctx.globalAlpha = 0.3;
                            ctx.beginPath();
                            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                            ctx.stroke();

                            // Latitude lines
                            ctx.globalAlpha = 0.1;
                            for (let i = 1; i < 6; i++) {
                              const r = radius * Math.sin((i / 6) * Math.PI);
                              const y = centerY + radius * Math.cos((i / 6) * Math.PI);
                              ctx.beginPath();
                              ctx.ellipse(centerX, y, radius * Math.sin((i / 6) * Math.PI), r * 0.2, 0, 0, Math.PI * 2);
                              ctx.stroke();
                            }

                            // Longitude lines
                            for (let i = 0; i < 6; i++) {
                              ctx.beginPath();
                              ctx.ellipse(centerX, centerY, radius * Math.sin((i / 6) * Math.PI), radius, 0, 0, Math.PI * 2);
                              ctx.stroke();
                            }

                            // 2. Nodes (Dots)
                            const nodeCount = Math.floor(20 + complexity / 2);
                            const nodes = [];
                            for (let i = 0; i < nodeCount; i++) {
                              const angle = nextRand() * Math.PI * 2;
                              const dist = Math.sqrt(nextRand()) * radius;
                              nodes.push({
                                x: centerX + Math.cos(angle) * dist,
                                y: centerY + Math.sin(angle) * dist,
                                color: nextRand() > 0.7 ? accentColor : mainColor
                              });
                            }

                            // 3. Connections (Lines)
                            ctx.lineWidth = 1;
                            nodes.forEach((n, i) => {
                              // Draw dots
                              ctx.fillStyle = n.color;
                              ctx.globalAlpha = 0.8;
                              ctx.beginPath();
                              ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
                              ctx.fill();

                              // Draw connections
                              ctx.strokeStyle = n.color;
                              nodes.slice(i + 1).forEach(n2 => {
                                const d = Math.hypot(n.x - n2.x, n.y - n2.y);
                                if (d < radius * 0.8 && nextRand() > 0.8) {
                                  ctx.globalAlpha = 0.2;
                                  ctx.beginPath();
                                  ctx.moveTo(n.x, n.y);
                                  // Quadratic curve for "arc" look
                                  const midX = (n.x + n2.x) / 2 + (nextRand() - 0.5) * 50;
                                  const midY = (n.y + n2.y) / 2 + (nextRand() - 0.5) * 50;
                                  ctx.quadraticCurveTo(midX, midY, n2.x, n2.y);
                                  ctx.stroke();
                                }
                              });

                              // Technical Labels
                              if (nextRand() > 0.9) {
                                ctx.fillStyle = '#fff';
                                ctx.globalAlpha = 0.4;
                                ctx.font = `${Math.floor(9 * (canvas.width/1920))}px monospace`;
                                ctx.fillText(`LOC_${Math.floor(n.x)},${Math.floor(n.y)}`, n.x + 8, n.y + 8);
                              }
                            });

                            // 4. Interface HUD
                            ctx.globalAlpha = 0.6;
                            ctx.fillStyle = mainColor;
                            ctx.font = `bold ${Math.floor(12 * (canvas.width/1920))}px monospace`;
                            ctx.fillText("PLANETARY_NETWORK_SCAN: ACTIVE", 50, canvas.height - 50);
                            ctx.fillText(`NODES_DETECTED: ${nodeCount}`, 50, canvas.height - 35);

                            const corners = [
                              { x: 50, y: 50 },
                              { x: canvas.width - 150, y: 50 },
                              { x: canvas.width - 150, y: canvas.height - 50 }
                            ];

                            corners.forEach(c => {
                              ctx.strokeRect(c.x, c.y, 100, 20);
                                              ctx.font = `${Math.floor(10 * (canvas.width/1920))}px monospace`;
                                              ctx.fillText(`SEC_${Math.floor(nextRand() * 99)}`, c.x + 5, c.y + 14);
                                            });
                                          } else if (style === 'schematic') {
                                            const mainColor = colors[0];
                                            const accentColor = colors[1] || colors[0];
                                            const bgColor = colors[colors.length - 1];
                                            ctx.fillStyle = bgColor;
                                            ctx.fillRect(0, 0, canvas.width, canvas.height);

                                            // 1. Technical Grid
                                            ctx.strokeStyle = mainColor;
                                            ctx.lineWidth = 0.5;
                                            const step = 40 * (canvas.width / 1920);
                                            for (let i = 0; i < canvas.width; i += step) {
                                              ctx.globalAlpha = i % (step * 5) === 0 ? 0.15 : 0.05;
                                              ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
                                            }
                                            for (let i = 0; i < canvas.height; i += step) {
                                              ctx.globalAlpha = i % (step * 5) === 0 ? 0.15 : 0.05;
                                              ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
                                            }

                                            // 2. Blueprint Components
                                            const centerX = canvas.width / 2;
                                            const centerY = canvas.height / 2;
                                            const components = Math.floor(2 + complexity / 25);

                                            for (let i = 0; i < components; i++) {
                                              const x = centerX + (nextRand() - 0.5) * canvas.width * 0.6;
                                              const y = centerY + (nextRand() - 0.5) * canvas.height * 0.6;
                                              const w = (200 + nextRand() * 400) * (canvas.width / 1920);
                                              const h = (150 + nextRand() * 300) * (canvas.width / 1920);
                                              const color = nextRand() > 0.5 ? mainColor : accentColor;

                                              ctx.save();
                                              ctx.translate(x, y);

                                              // Outline
                                              ctx.strokeStyle = color;
                                              ctx.lineWidth = 2;
                                              ctx.globalAlpha = 0.8;
                                              ctx.strokeRect(-w/2, -h/2, w, h);

                                              // Cross-hatching
                                              ctx.globalAlpha = 0.1;
                                              ctx.beginPath();
                                              for (let j = -w/2; j < w/2; j += 10) {
                                                ctx.moveTo(j, -h/2); ctx.lineTo(j + 20, h/2);
                                              }
                                              ctx.stroke();

                                              // Dimension lines
                                              ctx.globalAlpha = 0.4;
                                              ctx.lineWidth = 1;
                                              ctx.beginPath();
                                              // Horizontal Dimension
                                              ctx.moveTo(-w/2, -h/2 - 20); ctx.lineTo(w/2, -h/2 - 20);
                                              ctx.moveTo(-w/2, -h/2 - 25); ctx.lineTo(-w/2, -h/2 - 15);
                                              ctx.moveTo(w/2, -h/2 - 25); ctx.lineTo(w/2, -h/2 - 15);
                                              // Vertical Dimension
                                              ctx.moveTo(w/2 + 20, -h/2); ctx.lineTo(w/2 + 20, h/2);
                                              ctx.moveTo(w/2 + 15, -h/2); ctx.lineTo(w/2 + 25, -h/2);
                                              ctx.moveTo(w/2 + 15, h/2); ctx.lineTo(w/2 + 25, h/2);
                                              ctx.stroke();

                                              // Dimension labels
                                              ctx.fillStyle = color;
                                              ctx.font = `${Math.floor(10 * (canvas.width/1920))}px monospace`;
                                              ctx.fillText(`${Math.floor(w)}mm`, -15, -h/2 - 30);
                                              ctx.save();
                                              ctx.translate(w/2 + 35, 0);
                                              ctx.rotate(Math.PI / 2);
                                              ctx.fillText(`${Math.floor(h)}mm`, -15, 0);
                                              ctx.restore();

                                              // Technical Annotation
                                              ctx.globalAlpha = 0.7;
                                              ctx.fillText(`MOD_0x${nextRand().toString(16).slice(2,6).toUpperCase()}`, -w/2, h/2 + 20);

                                              ctx.restore();
                                            }

                                            // 3. Drafting Header
                                            ctx.globalAlpha = 0.9;
                                            ctx.strokeStyle = mainColor;
                                            ctx.lineWidth = 2;
                                            ctx.strokeRect(50, 50, 400, 100);
                                            ctx.font = `bold ${Math.floor(16 * (canvas.width/1920))}px monospace`;
                                            ctx.fillStyle = mainColor;
                                            ctx.fillText("ENGINEERING_ARCHIVE // SCHEMATIC", 70, 85);
                                            ctx.font = `${Math.floor(10 * (canvas.width/1920))}px monospace`;
                                            ctx.fillText(`DRAFT_VER: ${seed.slice(0,4).toUpperCase()}`, 70, 110);
                                            ctx.fillText(`ARCH_SPEC: ${resolution.toUpperCase()}`, 70, 125);
                                          }

                                          if (noise > 0) {      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data; const noiseVal = noise * 2.55;
      for (let i = 0; i < data.length; i += 4) { const n = (nextRand() - 0.5) * noiseVal; data[i] += n; data[i+1] += n; data[i+2] += n; }
      ctx.putImageData(imageData, 0, 0);
    }
  }, [seed, style, complexity, noise, preset, resolution, rng, customColors]);

  useEffect(() => { draw(); }, [draw]);

  const handleRegenerate = () => { setIsGenerating(true); setSeed(Math.random().toString(36).substring(7)); setTimeout(() => setIsGenerating(false), 500); };

  const handleDownload = () => {
    const canvas = canvasRef.current; if (!canvas) return;
    const link = document.createElement('a');
    const res = RESOLUTIONS.find(r => r.value === resolution);
    link.download = `fezcodex-wallpaper-${style}-${seed}-${res.width}x${res.height}.png`;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
    addToast({ title: 'EXPORT SUCCESSFUL', message: `System wallpaper saved at ${res.width}x${res.height}`, type: 'success' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col lg:flex-row overflow-hidden font-mono selection:bg-emerald-500/30">
      <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-white/10 flex flex-col bg-[#080808] z-20">
        <div className="p-6 border-b border-white/10">
          <Link to="/apps" className="flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-6 text-[10px] uppercase tracking-widest">
            <ArrowLeftIcon /> Back to Tools
          </Link>
          <h1 className="text-xl font-black uppercase tracking-tighter flex items-center gap-2">
            <MonitorIcon size={24} weight="fill" className="text-emerald-500" />
            Wallpaper Engine
          </h1>
          <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest">Procedural Visualization v2.0</p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-8 no-scrollbar pb-32">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
                <ArrowsClockwiseIcon /> Protocol Seed
              </span>
              <button onClick={handleRegenerate} className="p-1 hover:text-emerald-500 transition-colors" title="Randomize">
                <ArrowsClockwiseIcon size={14} className={isGenerating ? 'animate-spin' : ''} />
              </button>
            </div>
            <input type="text" value={seed} onChange={(e) => setSeed(e.target.value)} className="w-full bg-white/5 border border-white/10 p-2 text-xs focus:outline-none focus:border-emerald-500/50 transition-colors uppercase" />
          </div>
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
              <ShapesIcon /> Algorithm Style
            </span>
            <CustomDropdown variant="brutalist" fullWidth options={STYLES} value={style} onChange={setStyle} />
          </div>
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
              <PaletteIcon /> Color Protocol
            </span>
            <div className="grid grid-cols-4 gap-2">
              {COLOR_PRESETS.map((p) => {
                const isCustom = p.value === 'custom';
                const isActive = preset === p.value;
                return (
                  <button key={p.value} onClick={() => setPreset(p.value)} className={`relative h-10 border transition-all ${isActive ? 'border-emerald-500 p-0.5' : isCustom ? 'border-primary-500/50 hover:border-primary-500' : 'border-white/10 hover:border-white/30'}`} title={p.label}>
                    <div className="w-full h-full flex overflow-hidden">
                      {(p.value === 'custom' ? customColors : p.colors).slice(0, 3).map((c, i) => (
                        <div key={i} className="flex-1" style={{ backgroundColor: c }} />
                      ))}
                    </div>
                    {isCustom && !isActive && ( <div className="absolute inset-0 flex items-center justify-center pointer-events-none"> <span className="text-[10px] font-black text-white drop-shadow-md">+</span> </div> )}
                    {isActive && ( <div className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-black rounded-full p-0.5"> <CheckIcon size={8} weight="bold" /> </div> )}
                  </button>
                );
              })}
            </div>
            <AnimatePresence>
              {preset === 'custom' && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 pt-2 overflow-hidden">
                  <div className="flex gap-2">
                    {customColors.map((color, idx) => (
                      <div key={idx} className="flex-1 flex flex-col gap-1">
                        <label className="text-[8px] text-gray-600 uppercase">CH_{idx + 1}</label>
                        <input type="color" value={color} onChange={(e) => { const newColors = [...customColors]; newColors[idx] = e.target.value; setCustomColors(newColors); }} className="w-full h-8 bg-transparent border border-white/10 cursor-pointer p-0 block" />
                      </div>
                    ))}
                  </div>
                  <p className="text-[8px] text-gray-600 uppercase italic leading-tight">CH_3 is utilized as the primary foundation layer.</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <CustomSlider label="Complexity Level" value={complexity} onChange={setComplexity} min={1} max={100} />
          <CustomSlider label="Digital Grain" value={noise} onChange={setNoise} min={0} max={50} />
          <div className="space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-gray-500 font-bold flex items-center gap-2">
              <MonitorIcon /> Export Target
            </span>
            <CustomDropdown variant="brutalist" fullWidth options={RESOLUTIONS} value={resolution} onChange={setResolution} />
          </div>
          <button onClick={handleDownload} className="w-full group flex items-center justify-between bg-emerald-500 hover:bg-emerald-400 text-black p-4 rounded-sm font-black uppercase tracking-tighter transition-all active:scale-[0.98]">
            <span>Execute Export</span>
            <DownloadSimpleIcon size={20} weight="bold" className="group-hover:translate-y-0.5 transition-transform" />
          </button>
        </div>
      </aside>
      <main className="flex-1 relative bg-[#050505] p-4 md:p-12 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-5" style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative w-full h-full flex flex-col items-center justify-center max-w-5xl">
          <div className="mb-4 w-full flex justify-between items-end">
            <div>
              <span className="text-[10px] text-emerald-500/50 uppercase tracking-[0.3em] block mb-1">Live_Preview_Stream</span>
              <div className="flex gap-4 font-mono text-[9px] text-gray-600 uppercase">
                <span>Res: {RESOLUTIONS.find(r => r.value === resolution).width} x {RESOLUTIONS.find(r => r.value === resolution).height}</span>
                <span>Seed: {seed}</span>
                <span>Algorithm: {style}</span>
              </div>
            </div>
            <div className="flex gap-2"> <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> <div className="w-2 h-2 rounded-full bg-white/10" /> <div className="w-2 h-2 rounded-full bg-white/10" /> </div>
          </div>
          <div className="w-full relative shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 rounded-sm overflow-hidden bg-black flex items-center justify-center" style={{ aspectRatio: `${RESOLUTIONS.find(r => r.value === resolution).width} / ${RESOLUTIONS.find(r => r.value === resolution).height}`, maxHeight: '70vh' }}>
            <canvas ref={canvasRef} className="w-full h-full object-contain" />
            <AnimatePresence>
              {isGenerating && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] uppercase tracking-[0.5em] text-emerald-500 animate-pulse">Re-Compiling...</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="mt-8 w-full border-t border-white/5 pt-6 grid grid-cols-2 gap-8">
             <StatsModule label="Render_Engine" value="Canvas_v2" />
             <StatsModule label="Data_Protocol" value="Procedural" />
          </div>
        </div>
      </main>
    </div>
  );
};

const StatsModule = ({ label, value }) => (
  <div>
    <span className="text-[9px] text-gray-600 uppercase tracking-widest block mb-1">{label}</span>
    <span className="text-xs text-gray-400 font-bold uppercase">{value}</span>
  </div>
);

export default WallpaperEnginePage;
