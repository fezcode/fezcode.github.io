import * as THREE from 'three';
import {
  createSculptureGeometry,
  getSculptureParameters,
} from './sculptureSeed';

// Broad studio softboxes and a narrow cobalt strip produce real metal
// reflections without downloading an environment image.
function makeEnvironment(renderer) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Studio environment unavailable');
  context.fillStyle = '#141d30';
  context.fillRect(0, 0, 1024, 512);
  const wash = context.createLinearGradient(0, 0, 0, 512);
  wash.addColorStop(0, '#9da9bc');
  wash.addColorStop(0.42, '#293141');
  wash.addColorStop(1, '#e7e9ef');
  context.fillStyle = wash;
  context.fillRect(0, 0, 1024, 512);
  context.fillStyle = '#ffffff';
  context.fillRect(72, 60, 105, 345);
  context.fillRect(610, 40, 210, 130);
  context.fillStyle = '#c6d4ff';
  context.fillRect(873, 140, 38, 275);
  context.fillStyle = '#536ce8';
  context.fillRect(432, 80, 23, 340);
  context.fillStyle = '#101724';
  context.fillRect(195, 100, 75, 330);
  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  texture.colorSpace = THREE.SRGBColorSpace;
  const generator = new THREE.PMREMGenerator(renderer);
  try {
    return generator.fromEquirectangular(texture);
  } finally {
    texture.dispose();
    generator.dispose();
  }
}

/**
 * Shared studio for live sculptures and deterministic OG renders. The caller
 * owns canvas placement and animation. render(0) is the exact seeded pose.
 */
export function createSculptureScene({
  seed = 'wordup',
  canvas,
  width = 1,
  height = 1,
  pixelRatio = 1,
  preserveDrawingBuffer = false,
  renderOnUpdate = true,
  onRender,
} = {}) {
  let renderer;
  let environment;
  let scene;
  let sculpture;
  let disposed = false;
  let geometries = [];
  const materials = [];
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    sculpture?.clear();
    if (scene) {
      scene.environment = null;
      scene.clear();
    }
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    geometries = [];
    materials.length = 0;
    environment?.dispose();
    renderer?.dispose();
  };

  try {
    renderer = new THREE.WebGLRenderer({
      ...(canvas ? { canvas } : {}),
      alpha: true,
      antialias: true,
      powerPreference: 'low-power',
      preserveDrawingBuffer,
    });
    renderer.setPixelRatio(pixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
    scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0.05, 6.7);
    environment = makeEnvironment(renderer);
    scene.environment = environment.texture;
    scene.add(new THREE.HemisphereLight(0xf3f5ff, 0x27364f, 2.3));
    const key = new THREE.DirectionalLight(0xffffff, 4);
    key.position.set(-4, 5, 5);
    scene.add(key);
    const edgeLight = new THREE.DirectionalLight(0x99aaff, 3.2);
    edgeLight.position.set(4, -1, -3);
    scene.add(edgeLight);
    const metal = new THREE.MeshPhysicalMaterial({
      color: 0xdde3f4,
      metalness: 0.76,
      roughness: 0.18,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      iridescence: 0.8,
      iridescenceIOR: 1.46,
      iridescenceThicknessRange: [150, 440],
      transmission: 0.12,
      thickness: 0.35,
      envMapIntensity: 1.3,
      side: THREE.DoubleSide,
    });
    const seamMaterial = new THREE.MeshStandardMaterial({
      color: 0x798ed5,
      metalness: 0.75,
      roughness: 0.22,
    });
    materials.push(metal, seamMaterial);
    sculpture = new THREE.Group();
    scene.add(sculpture);
    let parameters = null;
    let lastElapsed = 0;
    let currentWidth = 0;
    let currentHeight = 0;
    const render = (elapsedSeconds = 0) => {
      if (disposed || !parameters) return;
      const elapsed = Number.isFinite(elapsedSeconds)
        ? Math.max(0, elapsedSeconds)
        : 0;
      lastElapsed = elapsed;
      sculpture.rotation.set(
        parameters.pose[0] + Math.sin(elapsed * 0.23) * 0.12,
        parameters.pose[1] + elapsed * 0.075,
        parameters.pose[2] + Math.sin(elapsed * 0.16) * 0.06,
      );
      sculpture.position.y = 0.04 + Math.sin(elapsed * 0.4) * 0.055;
      const started = onRender ? performance.now() : 0;
      renderer.render(scene, camera);
      onRender?.({
        submissionMs: performance.now() - started,
        calls: renderer.info.render.calls,
        triangles: renderer.info.render.triangles,
        width: renderer.domElement.width,
        height: renderer.domElement.height,
      });
    };
    const setSeed = (word) => {
      if (disposed) return false;
      const next = getSculptureParameters(word);
      if (parameters?.identity === next.identity) return false;
      const built = createSculptureGeometry(next);
      const nextGeometries = [built.geometry];
      try {
        for (const edge of built.edges) {
          nextGeometries.push(
            new THREE.TubeGeometry(
              new THREE.CatmullRomCurve3(edge, true),
              240,
              0.007,
              5,
              true,
            ),
          );
        }
      } catch (error) {
        nextGeometries.forEach((geometry) => geometry.dispose());
        throw error;
      }
      sculpture.clear();
      geometries.forEach((geometry) => geometry.dispose());
      geometries = nextGeometries;
      sculpture.add(new THREE.Mesh(built.geometry, metal));
      nextGeometries
        .slice(1)
        .forEach((geometry) =>
          sculpture.add(new THREE.Mesh(geometry, seamMaterial)),
        );
      metal.color.set(next.pearl);
      metal.roughness = next.roughness;
      metal.iridescence = next.iridescence;
      metal.iridescenceThicknessRange = [...next.film];
      seamMaterial.color.set(next.accent);
      parameters = next;
      lastElapsed = 0;
      if (renderOnUpdate) render(0);
      return true;
    };
    const resize = (nextWidth, nextHeight) => {
      if (
        disposed ||
        !Number.isFinite(nextWidth) ||
        !Number.isFinite(nextHeight) ||
        nextWidth <= 0 ||
        nextHeight <= 0 ||
        (nextWidth === currentWidth && nextHeight === currentHeight)
      )
        return false;
      currentWidth = nextWidth;
      currentHeight = nextHeight;
      renderer.setSize(nextWidth, nextHeight, false);
      camera.aspect = nextWidth / nextHeight;
      camera.position.z = camera.aspect < 0.85 ? 8.2 : 6.7;
      camera.updateProjectionMatrix();
      if (renderOnUpdate) render(lastElapsed);
      return true;
    };
    setSeed(seed);
    resize(width, height);
    return {
      renderer,
      scene,
      camera,
      sculpture,
      get parameters() {
        return parameters;
      },
      setSeed,
      resize,
      render,
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
