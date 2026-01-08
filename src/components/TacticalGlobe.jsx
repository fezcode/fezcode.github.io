import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const TacticalGlobe = ({ className, accentColor = '#10b981' }) => {
  const mountRef = useRef(null);
  const materialsRef = useRef({});
  const targetColorRef = useRef(new THREE.Color(accentColor));

  useEffect(() => {
    targetColorRef.current.set(accentColor);
  }, [accentColor]);

  useEffect(() => {
    const mountNode = mountRef.current;
    if (!mountNode) return;

    // Scene Setup
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(
      75,
      mountNode.clientWidth / mountNode.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(mountNode.clientWidth, mountNode.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountNode.appendChild(renderer.domElement);

    // --- Objects ---

    // 1. Main Wireframe Globe
    const geometry = new THREE.IcosahedronGeometry(1.2, 2);
    const wireframeMaterial = new THREE.MeshBasicMaterial({
      color: accentColor,
      wireframe: true,
      transparent: true,
      opacity: 0.3,
    });
    const globe = new THREE.Mesh(geometry, wireframeMaterial);
    scene.add(globe);

    // 2. Inner Solid Core
    const coreGeometry = new THREE.IcosahedronGeometry(1.19, 2);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x050505,
    });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);

    // 3. Outer Rotating Ring
    const ringGeometry = new THREE.TorusGeometry(1.6, 0.02, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({
        color: accentColor,
        transparent: true,
        opacity: 0.2
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);

    // 4. Particle Field
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.02,
        color: accentColor,
        transparent: true,
        opacity: 0.4
    });
    const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);

    // Store refs for animation
    materialsRef.current = {
        wireframe: wireframeMaterial,
        ring: ringMaterial,
        particles: particlesMaterial
    };

    // Animation Loop
    const animate = () => {
      requestAnimationFrame(animate);

      // Color Interpolation
      const lerpSpeed = 0.05;
      wireframeMaterial.color.lerp(targetColorRef.current, lerpSpeed);
      ringMaterial.color.lerp(targetColorRef.current, lerpSpeed);
      particlesMaterial.color.lerp(targetColorRef.current, lerpSpeed);

      // Rotate Globe
      globe.rotation.y += 0.002;

      // Rotate Ring
      ring.rotation.z -= 0.005;
      ring.rotation.x = Math.PI / 2 + Math.sin(Date.now() * 0.001) * 0.1;

      // Rotate Particles
      particlesMesh.rotation.y += 0.0005;

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
        if (!mountNode) return;
        const width = mountNode.clientWidth;
        const height = mountNode.clientHeight;

        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    return () => {
        window.removeEventListener('resize', handleResize);
        if (mountNode && mountNode.contains(renderer.domElement)) {
            mountNode.removeChild(renderer.domElement);
        }
        geometry.dispose();
        wireframeMaterial.dispose();
        coreGeometry.dispose();
        coreMaterial.dispose();
        ringGeometry.dispose();
        ringMaterial.dispose();
        particlesGeometry.dispose();
        particlesMaterial.dispose();
        renderer.dispose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Re-run if mount changes (unlikely), but NOT on accentColor change.

  return <div ref={mountRef} className={className} />;
};

export default TacticalGlobe;
