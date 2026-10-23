import React, { Suspense, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { SofaModelType, WoodFinish, FabricMaterial } from '../../types/furniture';
import { RoyalSofaModel } from './RoyalSofaModel';
import {
  Rotate3d,
  Play,
  Pause,
  RefreshCw,
  Camera,
  Maximize2,
  Sparkles,
  Layers,
  ZoomIn,
} from 'lucide-react';

interface FurnitureViewerProps {
  modelType: SofaModelType;
  wood: WoodFinish;
  fabric: FabricMaterial;
  customTextureUrl?: string;
}

export const FurnitureViewer: React.FC<FurnitureViewerProps> = ({
  modelType,
  wood,
  fabric,
  customTextureUrl,
}) => {
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [activePreset, setActivePreset] = useState<'hero' | 'front' | 'crest' | 'fabric'>('hero');
  const [lightingPreset, setLightingPreset] = useState<'studio' | 'palace' | 'noir'>('studio');
  const controlsRef = useRef<any>(null);

  // Detect software WebGL guard
  const isSoftwareGl = (() => {
    try {
      const gl = document.createElement('canvas').getContext('webgl2');
      if (!gl) return true;
      const ext = gl.getExtension('WEBGL_debug_renderer_info');
      const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
      const gpu = String(gl.getParameter(param));
      gl.getExtension('WEBGL_lose_context')?.loseContext();
      return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
    } catch {
      return false;
    }
  })();

  const setCameraView = (view: 'hero' | 'front' | 'crest' | 'fabric') => {
    setActivePreset(view);
    if (!controlsRef.current) return;

    switch (view) {
      case 'front':
        controlsRef.current.setLookAt(0, 1.2, 7.5, 0, 1.2, 0, true);
        break;
      case 'crest':
        controlsRef.current.setLookAt(0, 3.2, 3.8, 0, 3.2, -0.6, true);
        break;
      case 'fabric':
        controlsRef.current.setLookAt(0.6, 1.6, 2.8, 0, 1.4, 0, true);
        break;
      case 'hero':
      default:
        controlsRef.current.setLookAt(5.2, 3.2, 6.2, 0, 1.2, 0, true);
        break;
    }
  };

  const handleReset = () => {
    setCameraView('hero');
    setAutoRotate(true);
  };

  return (
    <div className="relative w-full h-full min-h-[500px] lg:min-h-[660px] flex items-center justify-center select-none overflow-hidden rounded-2xl bg-gradient-to-b from-[#14151a] via-[#0d0e12] to-[#07080a] border border-[#d4af37]/20 shadow-2xl">
      {/* 3D Canvas */}
      <Canvas
        shadows={!isSoftwareGl}
        camera={{ position: [5.2, 3.2, 6.2], fov: 38 }}
        gl={{
          antialias: !isSoftwareGl,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.15,
        }}
        className="w-full h-full cursor-grab active:cursor-grabbing"
      >
        <Suspense fallback={null}>
          {/* Lighting Rigs */}
          {lightingPreset === 'palace' ? (
            <>
              <ambientLight intensity={0.6} color="#ffe8b8" />
              <directionalLight
                position={[5, 8, 4]}
                intensity={2.8}
                color="#fff0cc"
                castShadow={!isSoftwareGl}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0005}
              />
              <directionalLight position={[-4, 4, -3]} intensity={1.5} color="#d4af37" />
            </>
          ) : lightingPreset === 'noir' ? (
            <>
              <ambientLight intensity={0.3} color="#94a3b8" />
              <spotLight
                position={[3, 9, 3]}
                intensity={4.2}
                angle={0.6}
                penumbra={0.8}
                color="#ffffff"
                castShadow={!isSoftwareGl}
              />
              <directionalLight position={[-4, 2, -4]} intensity={1.8} color="#d4af37" />
            </>
          ) : (
            // Default Studio Rig
            <>
              <ambientLight intensity={0.5} color="#ffffff" />
              <directionalLight
                position={[6, 8, 5]}
                intensity={2.4}
                color="#fffdfa"
                castShadow={!isSoftwareGl}
                shadow-mapSize-width={1024}
                shadow-mapSize-height={1024}
                shadow-bias={-0.0005}
              />
              <directionalLight position={[-5, 4, -4]} intensity={1.6} color="#d4af37" />
              <hemisphereLight args={['#ffffff', '#1a1a24', 0.8]} />
            </>
          )}

          {/* Environment Studio Reflexion */}
          <Environment preset="city" />

          {/* Royal Sofa Parametric 3D Model */}
          <RoyalSofaModel
            modelType={modelType}
            wood={wood}
            fabric={fabric}
            customTextureUrl={customTextureUrl}
            isSoftwareGl={isSoftwareGl}
          />

          {/* Ground Soft Contact Shadow */}
          {!isSoftwareGl && (
            <ContactShadows
              position={[0, -0.6, 0]}
              opacity={0.7}
              scale={12}
              blur={2.4}
              far={4}
              resolution={512}
              color="#000000"
            />
          )}

          {/* Orbit Controls */}
          <OrbitControls
            ref={controlsRef}
            enableDamping
            dampingFactor={0.05}
            minDistance={3.2}
            maxDistance={14}
            maxPolarAngle={Math.PI / 2.05}
            minPolarAngle={Math.PI / 8}
            autoRotate={autoRotate}
            autoRotateSpeed={0.8}
            target={[0, 1.2, 0]}
          />
        </Suspense>
      </Canvas>

      {/* Top Floating Badges */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 pointer-events-none">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 border border-[#d4af37]/30 text-xs font-medium text-amber-200 backdrop-blur-md shadow-lg">
          <Rotate3d className="w-3.5 h-3.5 text-[#d4af37] animate-spin [animation-duration:10s]" />
          <span>3D Royal Studio • Drag to Orbit / Scroll to Zoom</span>
        </div>
      </div>

      {/* Top Right Model Indicator */}
      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <div className="px-3 py-1.5 rounded-xl bg-black/60 border border-[#d4af37]/30 text-xs font-semibold text-[#d4af37] backdrop-blur-md">
          {modelType === '1-seater' ? '1-Seater Throne' : '3-Seater Grand Sofa'}
        </div>
      </div>

      {/* Bottom Floating Control Dock */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 w-[94%] max-w-[620px]">
        <div className="bg-[#12141a]/95 border border-[#d4af37]/25 rounded-2xl p-3 shadow-2xl shadow-black/90 flex flex-col gap-2.5 backdrop-blur-lg">
          {/* Top row: Camera Angle Presets */}
          <div className="flex items-center justify-between gap-2 overflow-x-auto py-0.5">
            <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
              {(
                [
                  { id: 'hero', label: 'Perspective', labelFa: 'سه‌بعدی' },
                  { id: 'front', label: 'Front View', labelFa: 'روبه‌رو' },
                  { id: 'crest', label: 'Carved Crown', labelFa: 'تاج منبت' },
                  { id: 'fabric', label: 'Tufting', labelFa: 'لمسه‌کوبی' },
                ] as const
              ).map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setCameraView(preset.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                    activePreset === preset.id
                      ? 'bg-gradient-to-r from-[#d4af37] to-[#aa7c11] text-black font-bold shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>{preset.label}</span>
                </button>
              ))}
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-1.5 ml-auto">
              {/* Lighting Preset selector */}
              <select
                value={lightingPreset}
                onChange={(e) => setLightingPreset(e.target.value as any)}
                className="bg-black/40 border border-white/10 text-[#d4af37] text-xs rounded-lg px-2 py-1 outline-none cursor-pointer"
                title="Lighting Ambience"
              >
                <option value="studio">Studio Light</option>
                <option value="palace">Palace Gold</option>
                <option value="noir">Noir Spotlight</option>
              </select>

              {/* Spin Toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all ${
                  autoRotate
                    ? 'bg-[#d4af37]/15 border-[#d4af37]/40 text-[#d4af37]'
                    : 'bg-black/40 border-white/10 text-slate-400 hover:text-white'
                }`}
                title="Toggle turntable spin"
              >
                {autoRotate ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                <span className="hidden sm:inline">Turntable</span>
              </button>

              {/* Reset */}
              <button
                onClick={handleReset}
                className="p-1.5 rounded-lg bg-black/40 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset Camera"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
