import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { ColorFinish } from '../../types/product';
import { buildProceduralWatch, WatchModelRefs } from '../../utils/watchGeometry';
import { Rotate3d, Play, Pause, Maximize2, Minimize2, Eye, Sliders, RefreshCw } from 'lucide-react';

interface ProductViewerProps {
  selectedFinish: ColorFinish;
}

export const ProductViewer: React.FC<ProductViewerProps> = ({ selectedFinish }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const watchRefs = useRef<WatchModelRefs | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);

  // Viewer state
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [explodedAmount, setExplodedAmount] = useState<number>(0);
  const [isZenMode, setIsZenMode] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<string>('hero');

  // Target camera state for smooth damping
  const targetCamPos = useRef(new THREE.Vector3(0, 0.4, 6.2));
  const targetLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isTransitioningCam = useRef(false);

  // Keep latest finish and exploded amount in ref for render loop access
  const finishRef = useRef(selectedFinish);
  finishRef.current = selectedFinish;

  const explodedRef = useRef(explodedAmount);
  explodedRef.current = explodedAmount;

  const autoRotateRef = useRef(autoRotate);
  autoRotateRef.current = autoRotate;

  // React to finish color changes instantly
  useEffect(() => {
    if (watchRefs.current && rendererRef.current) {
      watchRefs.current.updateFinish(selectedFinish, rendererRef.current);
    }
  }, [selectedFinish]);

  // React to exploded view changes
  useEffect(() => {
    if (watchRefs.current) {
      watchRefs.current.setExploded(explodedAmount);
    }
  }, [explodedAmount]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Detect software WebGL guard
    const isSoftwareGl = (() => {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    })();

    // 2. Initialize Three.js Scene, Camera, Renderer
    const scene = new THREE.Scene();

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 600;

    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    camera.position.set(0, 0.4, 6.2);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
      alpha: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = !isSoftwareGl;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Studio Reflections using RoomEnvironment
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    pmremGenerator.dispose();

    // 4. Lighting Rig (Studio standard)
    // Warm key light
    const keyLight = new THREE.DirectionalLight(0xfff5ea, 2.6);
    keyLight.position.set(4, 5, 4);
    keyLight.castShadow = !isSoftwareGl;
    if (keyLight.castShadow) {
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      keyLight.shadow.bias = -0.0005;
      keyLight.shadow.normalBias = 0.02;
    }
    scene.add(keyLight);

    // Cool hemisphere fill
    const hemiLight = new THREE.HemisphereLight(0xeff6ff, 0x1e293b, 1.2);
    scene.add(hemiLight);

    // Back rim light for edge definition
    const rimLight = new THREE.DirectionalLight(0x93c5fd, 2.0);
    rimLight.position.set(-4, 3, -4);
    scene.add(rimLight);

    // Subtle front fill
    const frontFill = new THREE.DirectionalLight(0xffffff, 0.8);
    frontFill.position.set(0, 0, 5);
    scene.add(frontFill);

    // 5. Build procedural watch model
    const watch = buildProceduralWatch(renderer, finishRef.current, isSoftwareGl);
    scene.add(watch.rootGroup);
    watchRefs.current = watch;

    // 6. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 3.2;
    controls.maxDistance = 10;
    controls.maxPolarAngle = Math.PI / 1.7; // Prevent going too far beneath ground
    controls.minPolarAngle = Math.PI / 6;
    controls.target.set(0, 0, 0);
    controlsRef.current = controls;

    // Track user drag interaction
    const isInteracting = { current: false };
    controls.addEventListener('start', () => {
      isTransitioningCam.current = false;
      isInteracting.current = true;
    });
    controls.addEventListener('end', () => {
      isInteracting.current = false;
    });

    // 7. Animation Loop with Software Gl pace protection
    let frameId = 0;
    const clock = new THREE.Clock();

    function afterDraw(cb: () => void) {
      const gl = renderer.getContext() as WebGL2RenderingContext;
      const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
      gl.flush();
      const poll = () => {
        const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
        if (state === gl.UNSIGNALED) {
          frameId = window.setTimeout(poll, 5);
        } else {
          gl.deleteSync(sync);
          frameId = window.setTimeout(cb, 80);
        }
      };
      frameId = window.setTimeout(poll, 5);
    }

    function tick() {
      const delta = clock.getDelta();

      // Camera preset smooth transition interpolation
      if (isTransitioningCam.current) {
        camera.position.lerp(targetCamPos.current, Math.min(delta * 4, 0.2));
        controls.target.lerp(targetLookAt.current, Math.min(delta * 4, 0.2));
        if (camera.position.distanceTo(targetCamPos.current) < 0.02) {
          isTransitioningCam.current = false;
        }
      }

      // Smooth idle auto rotation when enabled and not dragging
      if (autoRotateRef.current && !isInteracting.current) {
        watch.rootGroup.rotation.y += delta * 0.45;
      }

      controls.update();
      renderer.render(scene, camera);

      if (isSoftwareGl) {
        afterDraw(tick);
      } else {
        frameId = requestAnimationFrame(tick);
      }
    }

    tick();

    // 8. Resize Observer for fluid responsiveness
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });

    resizeObserver.observe(container);

    // 9. Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      clearTimeout(frameId);
      resizeObserver.disconnect();
      controls.dispose();

      // Dispose geometries and materials
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry?.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material?.dispose();
          }
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Camera preset handler
  const setCameraPreset = (preset: 'hero' | 'front' | 'side' | 'back' | 'crown') => {
    setActivePreset(preset);
    isTransitioningCam.current = true;

    // Reset watch root rotation so presets face correctly
    if (watchRefs.current) {
      watchRefs.current.rootGroup.rotation.set(0, 0, 0);
    }

    switch (preset) {
      case 'front':
        targetCamPos.current.set(0, 0, 5.8);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'side':
        targetCamPos.current.set(-5.6, 0, 0.5);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'crown':
        targetCamPos.current.set(4.8, 0.8, 1.8);
        targetLookAt.current.set(1.2, 0.4, 0);
        break;
      case 'back':
        targetCamPos.current.set(0, 0, -5.8);
        targetLookAt.current.set(0, 0, 0);
        break;
      case 'hero':
      default:
        targetCamPos.current.set(0, 0.4, 6.2);
        targetLookAt.current.set(0, 0, 0);
        break;
    }
  };

  const handleReset = () => {
    setCameraPreset('hero');
    setExplodedAmount(0);
    setAutoRotate(true);
    if (watchRefs.current) {
      watchRefs.current.rootGroup.rotation.set(0.15, -0.3, 0);
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] lg:min-h-[640px] flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#141822] via-[#0d1017] to-[#08090d] border border-white/5 shadow-2xl">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top subtle interaction hint */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 text-xs font-medium text-slate-300">
        <Rotate3d className="w-3.5 h-3.5 text-sky-400 animate-spin [animation-duration:8s]" />
        <span>Drag to orbit • Scroll to zoom</span>
      </div>

      {/* Top Right Zen / Fullscreen Toggle */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          onClick={() => setIsZenMode(!isZenMode)}
          title={isZenMode ? 'Show Controls' : 'Zen View'}
          className="p-2 rounded-xl bg-black/50 hover:bg-black/75 border border-white/10 text-slate-300 hover:text-white transition-colors"
        >
          {isZenMode ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Ergonomic Collapsible Bottom Control Dock */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[92%] max-w-[580px] transition-all duration-300 ${
          isZenMode ? 'translate-y-24 opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
        }`}
      >
        <div className="bg-[#12161f]/90 border border-white/10 rounded-2xl p-3 shadow-2xl shadow-black/80 flex flex-col gap-2.5">
          {/* Top row: Presets & Action Toggles */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto py-0.5">
            {/* View presets */}
            <div className="flex items-center gap-1 bg-black/30 p-1 rounded-xl border border-white/5">
              {(
                [
                  { id: 'hero', label: 'Perspective' },
                  { id: 'front', label: 'Dial' },
                  { id: 'crown', label: 'Crown' },
                  { id: 'back', label: 'Sensors' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setCameraPreset(preset.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                    activePreset === preset.id
                      ? 'bg-sky-500 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-1.5 ml-auto">
              {/* Auto rotate toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                  autoRotate
                    ? 'bg-sky-500/15 border-sky-500/30 text-sky-400'
                    : 'bg-black/30 border-white/5 text-slate-400 hover:text-white'
                }`}
                title="Toggle continuous rotation"
              >
                {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span>Spin</span>
              </button>

              {/* Reset button */}
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-black/30 border border-white/5 text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                title="Reset angle and zoom"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Bottom row: Exploded Anatomy Slider */}
          <div className="flex items-center gap-3 pt-1 border-t border-white/5 px-1">
            <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 whitespace-nowrap">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Exploded View:</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={explodedAmount}
              onChange={(e) => setExplodedAmount(parseFloat(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-400"
            />
            <span className="text-xs font-mono text-slate-400 w-9 text-right">
              {Math.round(explodedAmount * 100)}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
