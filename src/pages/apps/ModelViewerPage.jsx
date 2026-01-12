import React, { useState, Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Stage,
  PerspectiveCamera,
  Environment,
  ContactShadows,
  useGLTF,
} from '@react-three/drei';
import { TeapotGeometry } from 'three/examples/jsm/geometries/TeapotGeometry';
import { Link } from 'react-router-dom';
import {
  ArrowLeftIcon,
  DownloadSimpleIcon,
  ArrowsClockwiseIcon,
  UploadIcon,
} from '@phosphor-icons/react';
import Seo from '../../components/Seo';
import { useToast } from '../../hooks/useToast';
import BreadcrumbTitle from '../../components/BreadcrumbTitle';
import CustomSlider from '../../components/CustomSlider';
import CustomColorPicker from '../../components/CustomColorPicker';

const DefaultModel = ({ color, wireframe, speed }) => {
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed;
    }
  });

  const geometry = useMemo(() => new TeapotGeometry(1, 15), []);

  return (
    <mesh ref={meshRef} geometry={geometry} castShadow receiveShadow>
      <meshStandardMaterial
        color={color}
        wireframe={wireframe}
        roughness={0.3}
        metalness={0.8}
      />
    </mesh>
  );
};

const CustomModel = ({ url, color, wireframe, speed }) => {
  const { scene } = useGLTF(url);
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * speed;
    }
  });

  // Apply properties to the model
  scene.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
      if (child.material) {
        child.material.wireframe = wireframe;
        // Only apply color if it's a simple model, or maybe just tint it
        // For now, let's keep original materials but allow wireframe toggle
      }
    }
  });

  return <primitive ref={meshRef} object={scene} scale={3} />;
};

const ModelViewerPage = () => {
  const { addToast } = useToast();

  // App State
  const [modelUrl, setModelUrl] = useState(null);
  const [color, setColor] = useState('#10b981');
  const [bgColor, setBgColor] = useState('#080808');
  const [wireframe, setWireframe] = useState(false);
  const [rotationSpeed, setRotationSpeed] = useState(0.5);
  const [intensity, setIntensity] = useState(1);

  const handleModelUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setModelUrl(url);
      addToast({
        title: 'Model Loaded',
        message: `${file.name} is ready for inspection.`,
        duration: 3000,
      });
    }
  };

  const handleDownloadSnapshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'model-snapshot.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      addToast({
        title: 'Snapshot Saved',
        message: 'The 3D view has been captured.',
        duration: 3000,
      });
    }
  };

  const randomize = () => {
    const randomColor = '#' + Math.floor(Math.random()*16777215).toString(16);
    const randomBg = '#' + Math.floor(Math.random()*2105376).toString(16); // Prefer dark colors
    setColor(randomColor);
    setBgColor(randomBg);
    setRotationSpeed(Math.random() * 2);
    setIntensity(0.5 + Math.random() * 1.5);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-gray-400 flex flex-col">
      <Seo
        title="3D Model Viewer | Fezcodex"
        description="Inspect and interact with 3D models in your browser."
        keywords={['3d', 'model', 'viewer', 'webgl', 'threejs', 'react-three-fiber']}
      />
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col max-w-7xl">
        {/* Header */}
        <Link
          to="/apps"
          className="group text-emerald-500 hover:text-emerald-400 flex items-center gap-2 text-sm mb-4 font-mono uppercase tracking-widest"
        >
          <ArrowLeftIcon className="transition-transform group-hover:-translate-x-1" />
          Back to Terminal
        </Link>
                <BreadcrumbTitle title="3D Model Viewer" slug="model-viewer" variant="brutalist" />

                                <div className="flex flex-col gap-8 flex-grow mt-6">

                                  {/* Controls Panel - Now at top in a grid */}

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-[#0a0a0a] p-6 border border-white/5 rounded-sm">

                                    <div className="space-y-4">

                                      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 border-b border-white/5 pb-2">Source & Actions</h3>

                                      <div className="flex flex-col gap-2">

                                        <label

                                          htmlFor="model-upload"

                                          className="w-full py-3 px-4 bg-white text-black hover:bg-emerald-400 transition-all font-mono text-[10px] uppercase tracking-widest font-black rounded-sm cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_0_0_#d1d5db] active:translate-y-1 active:shadow-none"

                                        >

                                          <UploadIcon size={16} weight="bold" />

                                          Select .GLB/.GLTF

                                          <input

                                            id="model-upload"

                                            type="file"

                                            accept=".glb,.gltf"

                                            onChange={handleModelUpload}

                                            className="hidden"

                                          />

                                        </label>

                                        {modelUrl && (

                                          <button

                                            onClick={() => setModelUrl(null)}

                                            className="w-full py-2 px-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-sm hover:bg-red-500/20 transition-all font-mono text-[9px] uppercase tracking-widest"

                                          >

                                            Reset to Default

                                          </button>

                                        )}

                                        <div className="flex gap-2 mt-2">

                                          <button

                                            onClick={randomize}

                                            className="flex-1 py-2 px-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-sm hover:bg-emerald-500/20 flex items-center justify-center gap-2 transition-all font-mono text-xs uppercase tracking-widest"

                                          >

                                            <ArrowsClockwiseIcon size={16} /> Randomize

                                          </button>

                                          <button

                                            onClick={handleDownloadSnapshot}

                                            className="px-4 py-2 bg-white/5 text-gray-400 border border-white/10 rounded-sm hover:bg-white/10 flex items-center justify-center transition-all"

                                            title="Capture Snapshot"

                                          >

                                            <DownloadSimpleIcon size={20} />

                                          </button>

                                        </div>

                                      </div>

                                    </div>

                                    <div className="space-y-4 border-l border-white/5 pl-6">

                                      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 border-b border-white/5 pb-2">Appearance</h3>

                                      <div className="flex items-center justify-between mb-2">

                                        <label className="font-mono text-[10px] uppercase tracking-widest text-gray-500 font-bold">Wireframe</label>

                                        <button

                                          onClick={() => setWireframe(!wireframe)}

                                          className={`w-10 h-5 rounded-full transition-all relative ${wireframe ? 'bg-emerald-500' : 'bg-white/10'}`}

                                        >

                                          <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${wireframe ? 'left-6' : 'left-1'}`} />

                                        </button>

                                      </div>

                                      <CustomColorPicker

                                        label="Model Color"

                                        value={color}

                                        onChange={setColor}

                                      />

                                    </div>

                                    <div className="space-y-4 border-l border-white/5 pl-6">

                                      <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40 border-b border-white/5 pb-2">Dynamics & Stage</h3>

                                      <div className="grid grid-cols-2 gap-4">

                                        <CustomSlider

                                          label="Speed"

                                          value={rotationSpeed}

                                          min={0}

                                          max={5}

                                          step={0.1}

                                          onChange={setRotationSpeed}

                                          variant="brutalist"

                                        />

                                        <CustomSlider

                                          label="Light"

                                          value={intensity}

                                          min={0.1}

                                          max={3}

                                          step={0.1}

                                          onChange={setIntensity}

                                          variant="brutalist"

                                        />

                                      </div>

                                      <CustomColorPicker

                                        label="BG Color"

                                        value={bgColor}

                                        onChange={setBgColor}

                                      />

                                    </div>

                                  </div>

                                  {/* Viewer Area - Now full width and shorter */}

                                  <div className="w-full h-[450px] bg-[#080808] border border-white/5 rounded-sm relative overflow-hidden">

                      <Suspense fallback={

                        <div className="absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-widest animate-pulse">

                          Initializing 3D Buffer...

                        </div>

                      }>

                        <Canvas shadows gl={{ preserveDrawingBuffer: true }}>

                          <color attach="background" args={[bgColor]} />

                          <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />

                          <OrbitControls makeDefault enableDamping dampingFactor={0.05} />

                          <Environment preset="city" />

                          <Suspense fallback={null}>

                            <Stage intensity={intensity} contactShadow={false} adjustCamera={false} environment={null}>

                              {modelUrl ? (

                                <CustomModel url={modelUrl} color={color} wireframe={wireframe} speed={rotationSpeed} />

                              ) : (

                                <DefaultModel color={color} wireframe={wireframe} speed={rotationSpeed} />

                              )}

                            </Stage>

                          </Suspense>

                          <ContactShadows

                            opacity={0.4}

                            scale={10}

                            blur={2}

                            far={4.5}

                            resolution={256}

                            color="#000000"

                          />

                        </Canvas>

                      </Suspense>

            {/* UI Overlays */}
            <div className="absolute top-4 right-4 flex flex-col items-end gap-1 pointer-events-none">
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">Axis_Locked: False</span>
              <span className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em]">Viewport: Dynamic</span>
            </div>

            <div className="absolute bottom-4 left-4 flex gap-4 pointer-events-none">
               <div className="flex flex-col">
                  <span className="font-mono text-[8px] text-white/30 uppercase">Triangles</span>
                  <span className="font-mono text-xs text-emerald-500 font-bold">12,288</span>
               </div>
               <div className="flex flex-col border-l border-white/10 pl-4">
                  <span className="font-mono text-[8px] text-white/30 uppercase">Vertices</span>
                  <span className="font-mono text-xs text-emerald-500 font-bold">6,146</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModelViewerPage;
