import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowUpRight, ToggleLeft, Clock, Stack, GridFour, Globe } from '@phosphor-icons/react';
import { useProjects } from '../../utils/projectParser';
import Seo from '../../components/Seo';
import { useVisualSettings } from '../../context/VisualSettingsContext';
import LuxeArt from '../../components/LuxeArt';
import * as THREE from 'three';

// --- Components ---

const TimeDisplay = () => {
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);
  return <span className="font-mono tabular-nums">{time.toLocaleTimeString('en-US', { hour12: false })}</span>;
};

const StatusItem = ({ label, value, icon: Icon, onClick, actionLabel }) => {
  const isClickable = !!onClick;
  const Component = isClickable ? motion.button : motion.div;

  return (
    <Component
      onClick={onClick}
      whileHover={isClickable ? { backgroundColor: 'rgba(255, 255, 255, 0.6)' } : {}}
      whileTap={isClickable ? { scale: 0.98 } : {}}
      className={`flex flex-col items-center justify-center gap-2 p-6 border-r border-black/10 last:border-r-0 transition-colors flex-1 min-w-[160px] md:min-w-[200px] ${isClickable ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-black/60 group-hover:bg-black group-hover:text-white transition-colors">
           {Icon && <Icon size={16} />}
        </div>
        <span className="font-outfit text-[10px] uppercase tracking-[0.2em] text-black/40">{label}</span>
      </div>

      <div className="flex items-center gap-3">
         <span className="font-playfairDisplay italic text-xl md:text-2xl text-black">
             {value}
         </span>
         {isClickable && actionLabel && (
            <span className="text-[9px] font-sans border border-black/20 px-2 py-0.5 rounded-full text-black/40 uppercase tracking-widest bg-white/20">
                {actionLabel}
            </span>
         )}
      </div>
    </Component>
  );
};

// --- Adaptive Card Components ---

const ProjectCard = ({ project, index, isStacked }) => {
  // Adjusted offset for better stacking visibility - 150px base + 60px per card
  const topOffset = 150 + index * 60;

  const containerClass = isStacked
    ? "sticky w-full mb-32 last:mb-0 pt-10" // Increased margin-bottom to allow scroll space between reveals
    : "w-full mb-12 last:mb-0";

  const innerClass = "relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] w-full bg-[#EBEBEB] rounded-xl overflow-hidden border border-white/20 group " +
    (isStacked ? "shadow-2xl max-h-[700px]" : "shadow-xl");

  const style = isStacked ? { top: topOffset, zIndex: index + 1 } : {};

  return (
    <div className={containerClass} style={style}>
      <div className={innerClass}>
         <Link to={`/projects/${project.slug}`} className="block w-full h-full relative">
            <div className="absolute inset-0 transition-transform duration-1000 group-hover:scale-110">
                <LuxeArt seed={project.title} className="w-full h-full opacity-90 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/5 p-8 flex flex-col justify-between text-white">
                <div className="flex justify-between items-start">
                    <span className="font-outfit text-xs uppercase tracking-widest border border-white/20 px-3 py-1 rounded-full backdrop-blur-md">
                        Work {index + 1}
                    </span>
                    <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center group-hover:bg-white group-hover:text-black transition-all duration-300">
                        <ArrowUpRight size={24} />
                    </div>
                </div>
                <div>
                    <h3 className={`font-playfairDisplay italic mb-4 ${isStacked ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl'}`}>
                        {project.title}
                    </h3>
                    <p className={`font-outfit text-white/80 leading-relaxed max-w-md ${isStacked ? 'text-sm md:text-base line-clamp-4' : 'text-xs md:text-sm line-clamp-3'}`}>
                        {project.shortDescription}
                    </p>
                </div>
            </div>
         </Link>
      </div>
    </div>
  );
};

const JournalCard = ({ post, index, isStacked }) => {
  const topOffset = 150 + index * 60;

  const containerClass = isStacked
    ? "sticky w-full mb-32 last:mb-0 pt-10"
    : "w-full mb-12 last:mb-0";

  const innerClass = "relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] w-full bg-white rounded-xl overflow-hidden border border-black/5 flex flex-col group " +
    (isStacked ? "shadow-2xl max-h-[700px]" : "shadow-sm hover:shadow-xl transition-all duration-500");

  const style = isStacked ? { top: topOffset, zIndex: index + 1 } : {};

  return (
    <div className={containerClass} style={style}>
       <Link to={`/blog/${post.slug}`} className="block h-full">
          <div className={innerClass}>
              <div className="p-8 border-b border-black/5 flex justify-between items-center bg-[#FAFAF8]">
                  <span className="font-outfit text-xs uppercase tracking-widest text-black/50">
                      {new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                  </span>
                  <span className="font-outfit text-[10px] uppercase tracking-widest text-black/30 border border-black/10 px-2 py-1 rounded">
                      Entry {index + 1}
                  </span>
              </div>
              <div className="flex-1 p-8 flex flex-col justify-center items-center text-center bg-[#FDFCFB] group-hover:bg-[#FFF] transition-colors relative overflow-hidden">
                   <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                        style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                   />
                   <h3 className={`font-playfairDisplay text-[#1A1A1A] leading-tight group-hover:scale-105 transition-transform duration-700 ease-out ${isStacked ? 'text-4xl md:text-6xl' : 'text-3xl md:text-4xl lg:text-5xl'}`}>
                       {post.title}
                   </h3>
              </div>
              <div className="p-6 border-t border-black/5 flex justify-between items-center bg-[#FAFAF8]">
                   <span className="font-outfit text-xs font-bold uppercase tracking-widest text-black/40 group-hover:text-[#8D4004] transition-colors">
                       Read Article
                   </span>
                   <ArrowRight size={20} className="text-black/30 group-hover:text-[#8D4004] group-hover:translate-x-2 transition-all" />
              </div>
          </div>
       </Link>
    </div>
  );
};

// --- Omniverse Hero (Three.js - Maximalist) ---

const OmniverseHero = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5F5F0);
    scene.fog = new THREE.FogExp2(0xF5F5F0, 0.003); // Slightly denser fog for depth

    const camera = new THREE.PerspectiveCamera(75, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.z = 35;
    camera.position.y = 12;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mount.appendChild(renderer.domElement);

    // --- ASSETS ---

    // 1. THE GLOBE (Complex Wireframe)
    const globeGeo = new THREE.IcosahedronGeometry(10, 5);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0x1A1A1A, wireframe: true, transparent: true, opacity: 0.05 });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    // 2. INNER CORE (Glowing)
    const coreGeo = new THREE.IcosahedronGeometry(9.5, 2);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.1 });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // 3. ORBITAL RINGS (More variety)
    const rings = [];
    const ringConfig = [
        { r: 16, t: 0.05, speed: 0.002, color: 0x8D4004 },
        { r: 22, t: 0.02, speed: -0.003, color: 0x1A1A1A },
        { r: 28, t: 0.08, speed: 0.001, color: 0x8D4004 },
        { r: 35, t: 0.01, speed: -0.001, color: 0x000000 }
    ];

    ringConfig.forEach(conf => {
        const ringGeo = new THREE.TorusGeometry(conf.r, conf.t, 16, 100);
        const ringMat = new THREE.MeshBasicMaterial({ color: conf.color, transparent: true, opacity: 0.2 });
        const ring = new THREE.Mesh(ringGeo, ringMat);
        ring.rotation.x = Math.random() * Math.PI;
        ring.rotation.y = Math.random() * Math.PI;
        scene.add(ring);
        rings.push({ mesh: ring, geo: ringGeo, mat: ringMat, speed: conf.speed });
    });

    // 4. PARTICLES (Stars/Dust - Increased density)
    const particlesGeo = new THREE.BufferGeometry();
    const particleCount = 1500;
    const posArray = new Float32Array(particleCount * 3);
    for(let i = 0; i < particleCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 150;
    }
    particlesGeo.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMat = new THREE.PointsMaterial({ size: 0.15, color: 0x8D4004, transparent: true, opacity: 0.3 });
    const particlesMesh = new THREE.Points(particlesGeo, particlesMat);
    scene.add(particlesMesh);

    // 5. TERRAIN GRID (Mountains - Dynamic)
    // We create a custom grid with some height variation
    const planeGeo = new THREE.PlaneGeometry(300, 300, 60, 60);
    const posAttribute = planeGeo.attributes.position;
    for (let i = 0; i < posAttribute.count; i++) {
        const x = posAttribute.getX(i);
        const y = posAttribute.getY(i);
        // Simple noise-like elevation
        const z = Math.sin(x * 0.1) * Math.cos(y * 0.1) * 2 + Math.random() * 0.5;
        posAttribute.setZ(i, z);
    }
    planeGeo.computeVertexNormals();

    const planeMat = new THREE.MeshBasicMaterial({
        color: 0x1A1A1A,
        wireframe: true,
        transparent: true,
        opacity: 0.05
    });
    const terrain = new THREE.Mesh(planeGeo, planeMat);
    terrain.rotation.x = -Math.PI / 2;
    terrain.position.y = -20;
    scene.add(terrain);

    // 6. DIGITAL RIVERS (Moving Lines)
    const riverCount = 20;
    const rivers = [];
    for(let i=0; i<riverCount; i++) {
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3((Math.random()-0.5)*100, -18, (Math.random()-0.5)*100),
            new THREE.Vector3((Math.random()-0.5)*100, -15, (Math.random()-0.5)*100),
            new THREE.Vector3((Math.random()-0.5)*100, -18, (Math.random()-0.5)*100),
        ]);
        const pts = curve.getPoints(50);
        const riverGeo = new THREE.BufferGeometry().setFromPoints(pts);
        const riverMat = new THREE.LineBasicMaterial({ color: 0x8D4004, transparent: true, opacity: 0.4 });
        const river = new THREE.Line(riverGeo, riverMat);
        scene.add(river);
        rivers.push({ mesh: river, geo: riverGeo, mat: riverMat, speed: 0.02 + Math.random() * 0.05 });
    }

    // 7. ASTEROID BELT (Reduced)
    const asteroids = [];
    const asteroidGeo = new THREE.DodecahedronGeometry(0.4, 0);
    const asteroidMat = new THREE.MeshBasicMaterial({ color: 0x333333 });

    for(let i=0; i<15; i++) {
        const asteroid = new THREE.Mesh(asteroidGeo, asteroidMat);
        const theta = Math.random() * Math.PI * 2;
        const r = 18 + Math.random() * 5;
        asteroid.position.x = r * Math.cos(theta);
        asteroid.position.z = r * Math.sin(theta);
        asteroid.position.y = (Math.random() - 0.5) * 6;
        asteroid.rotation.x = Math.random() * Math.PI;
        asteroid.rotation.y = Math.random() * Math.PI;
        scene.add(asteroid);
        asteroids.push({
            mesh: asteroid,
            angle: theta,
            radius: r,
            speed: 0.002 + Math.random() * 0.003,
            rotSpeed: 0.01 + Math.random() * 0.02
        });
    }

    // 7.5 DISTANT PLANETS
    const planets = [];
    const planetConfig = [
        { size: 1.2, r: 45, speed: 0.0005, color: 0x8D4004, opacity: 0.4 }, // Soft Amber
        { size: 0.8, r: 55, speed: -0.0003, color: 0x1A1A1A, opacity: 0.3 }, // Dark
        { size: 1.5, r: 70, speed: 0.0002, color: 0xFFFFFF, opacity: 0.2 }, // White/Cloudy
        { size: 0.5, r: 40, speed: 0.0008, color: 0x457B9D, opacity: 0.3 }, // Soft Blue
    ];

    planetConfig.forEach(conf => {
        const planetGeo = new THREE.SphereGeometry(conf.size, 32, 32);
        const planetMat = new THREE.MeshBasicMaterial({
            color: conf.color,
            transparent: true,
            opacity: conf.opacity
        });
        const planet = new THREE.Mesh(planetGeo, planetMat);
        const theta = Math.random() * Math.PI * 2;
        planet.position.x = conf.r * Math.cos(theta);
        planet.position.z = conf.r * Math.sin(theta);
        planet.position.y = (Math.random() - 0.5) * 20;
        scene.add(planet);
        planets.push({ mesh: planet, angle: theta, radius: conf.r, speed: conf.speed });
    });

    // 8. SATELLITES (More complex shapes)
    const satellites = [];
    for(let i=0; i<8; i++) {
        const satGroup = new THREE.Group();

        // Main body
        const bodyGeo = new THREE.BoxGeometry(0.5, 0.5, 1);
        const bodyMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        satGroup.add(body);

        // Solar panels
        const panelGeo = new THREE.PlaneGeometry(2, 0.5);
        const panelMat = new THREE.MeshBasicMaterial({ color: 0x8D4004, side: THREE.DoubleSide });
        const panel = new THREE.Mesh(panelGeo, panelMat);
        panel.rotation.x = Math.PI / 2;
        satGroup.add(panel);

        scene.add(satGroup);
        satellites.push({
            mesh: satGroup,
            geo: bodyGeo, // track for disposal
            mat: bodyMat, // track for disposal
            geo2: panelGeo,
            mat2: panelMat,
            angle: Math.random() * Math.PI * 2,
            radius: 25 + Math.random() * 15,
            speed: 0.003 + Math.random() * 0.005,
            inclination: (Math.random() - 0.5) * 1
        });
    }

    // ANIMATION LOOP
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const time = Date.now() * 0.001;

      // Globe
      globe.rotation.y += 0.001;
      core.rotation.y -= 0.0005;

      // Rings
      rings.forEach(r => {
          r.mesh.rotation.x += r.speed;
          r.mesh.rotation.y += r.speed;
      });

      // Particles
      particlesMesh.rotation.y += 0.0002;

      // Terrain Move
      terrain.position.z = (time * 2) % 10; // Illusion of movement

      // Asteroids
      asteroids.forEach(a => {
          a.angle += a.speed;
          a.mesh.position.x = a.radius * Math.cos(a.angle);
          a.mesh.position.z = a.radius * Math.sin(a.angle);
          a.mesh.rotation.x += a.rotSpeed;
          a.mesh.rotation.y += a.rotSpeed;
      });

      // Planets
      planets.forEach(p => {
          p.angle += p.speed;
          p.mesh.position.x = p.radius * Math.cos(p.angle);
          p.mesh.position.z = p.radius * Math.sin(p.angle);
      });

      // Satellites
      satellites.forEach(s => {
          s.angle += s.speed;
          // Apply inclination
          const x = s.radius * Math.cos(s.angle);
          const z = s.radius * Math.sin(s.angle);
          const y = Math.sin(s.angle * 2) * s.radius * Math.sin(s.inclination);

          s.mesh.position.set(x, y, z);
          s.mesh.lookAt(0, 0, 0); // Face earth
      });

      // Rivers pulse
      rivers.forEach((r, i) => {
          r.mesh.material.opacity = 0.2 + Math.sin(time + i) * 0.2;
      });

      // Camera drift
      camera.position.x = Math.sin(time * 0.1) * 2;
      camera.position.y = 10 + Math.cos(time * 0.1) * 2;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE HANDLING via ResizeObserver (Detects sidebar toggles)
    const resizeObserver = new ResizeObserver(() => {
      if (!mount) return;
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(mount);

    // CLEANUP
    return () => {
      resizeObserver.disconnect();
      cancelAnimationFrame(frameId);
      if (mount && mount.contains(renderer.domElement)) {
          mount.removeChild(renderer.domElement);
      }

      // Extensive disposal
      globeGeo.dispose(); globeMat.dispose();
      coreGeo.dispose(); coreMat.dispose();
      rings.forEach(r => { r.geo.dispose(); r.mat.dispose(); });
      particlesGeo.dispose(); particlesMat.dispose();
      planeGeo.dispose(); planeMat.dispose();
      rivers.forEach(r => { r.geo.dispose(); r.mat.dispose(); });
      asteroidGeo.dispose(); asteroidMat.dispose();
      planets.forEach(p => { p.mesh.geometry.dispose(); p.mesh.material.dispose(); });
      satellites.forEach(s => {
          s.geo.dispose(); s.mat.dispose();
          s.geo2.dispose(); s.mat2.dispose();
      });
    };
  }, []);

  return (
    <div className="relative h-screen w-full bg-[#F5F5F0] overflow-hidden">
        <div ref={mountRef} className="absolute inset-0 z-0" />

        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
            <div className="text-center animate-fade-in-up bg-white/5 backdrop-blur-sm p-8 rounded-2xl border border-white/10 shadow-2xl">
                <div className="inline-flex items-center gap-3 px-4 py-2 border border-black/10 rounded-full bg-white/40 mb-8">
                    <Globe size={16} className="text-[#8D4004] animate-spin-slow" />
                    <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-black/80">Omniverse::Online</span>
                </div>
                <h1 className="font-playfairDisplay text-8xl md:text-[10rem] text-[#1A1A1A] leading-[0.8] mb-6 tracking-tighter mix-blend-overlay">
                  <span className="italic">FEZ</span><br/><span className="text-black/40">CODEX</span>
                </h1>
                <p className="font-outfit text-sm uppercase tracking-widest text-black/60 max-w-md mx-auto">
                    Exploring the infinite digital expanse.
                </p>
            </div>
        </div>

        <div className="absolute inset-0 bg-radial-gradient-to-t from-[#F5F5F0] via-transparent to-transparent z-0 pointer-events-none" />
    </div>
  );
};

const LuxeHomePage = () => {
  const { projects, loading: loadingProjects } = useProjects(true);
  const { setFezcodexTheme } = useVisualSettings();
  const [posts, setPosts] = useState([]);
  const [layoutMode, setLayoutMode] = useState('stack');

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/posts/posts.json');
        if(res.ok) setPosts(await res.json());
      } catch(e) { console.error(e); }
    };
    fetchPosts();
  }, []);

  return (
    <div className="min-h-full w-full bg-[#F5F5F0] text-[#1A1A1A] font-sans selection:bg-[#C0B298] selection:text-black pb-20">
      <Seo title="Fezcodex | Luxe" description="A digital sanctuary." />

      <OmniverseHero />

      <div className="border-y border-black/10 bg-white/40 backdrop-blur-md sticky top-0 z-40">
          <div className="flex justify-center divide-x divide-black/10 max-w-[1800px] mx-auto overflow-x-auto no-scrollbar">
              <StatusItem
                label="View Mode"
                value={layoutMode === 'stack' ? 'Stacked' : 'Grid'}
                icon={layoutMode === 'stack' ? Stack : GridFour}
                onClick={() => setLayoutMode(prev => prev === 'stack' ? 'grid' : 'stack')}
                actionLabel="Toggle"
              />
              <StatusItem label="Local Time" value={<TimeDisplay />} icon={Clock} />
              <StatusItem
                label="Interface"
                value="Luxe"
                icon={ToggleLeft}
                onClick={() => setFezcodexTheme('brutalist')}
                actionLabel="Switch"
              />
          </div>
      </div>

      <section className="max-w-[1800px] mx-auto px-6 md:px-12 py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
              <div className="order-1 lg:order-1">
                  <div className="mb-16 border-b border-black/10 pb-6">
                      <h2 className="font-playfairDisplay text-4xl text-[#1A1A1A]">Latest <span className="italic text-black/50">Observations</span></h2>
                  </div>
                  {posts.slice(0, 5).map((post, i) => (
                      <JournalCard key={post.slug} post={post} index={i} isStacked={layoutMode === 'stack'} />
                  ))}
                  <div className="mt-12 text-center lg:text-left">
                       <Link to="/blog" className="font-outfit text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-black/60 transition-colors">
                           View Journal Archive
                       </Link>
                  </div>
              </div>
              <div className="order-2 lg:order-2">
                  <div className="mb-16 border-b border-black/10 pb-6 text-right">
                      <h2 className="font-playfairDisplay text-4xl text-[#1A1A1A]">Selected <span className="italic text-black/50">Works</span></h2>
                  </div>
                  {loadingProjects ? (
                      <div className="py-20 text-center font-outfit opacity-50">Loading Collections...</div>
                  ) : (
                      projects.slice(0, 5).map((p, i) => (
                          <ProjectCard key={p.slug} project={p} index={i} isStacked={layoutMode === 'stack'} />
                      ))
                  )}
                  <div className="mt-12 text-center lg:text-right">
                       <Link to="/projects" className="font-outfit text-xs uppercase tracking-widest border-b border-black pb-1 hover:text-black/60 transition-colors">
                           View All Projects
                       </Link>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
};

export default LuxeHomePage;
