import React, { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { SofaModelType, WoodFinish, FabricMaterial } from '../../types/furniture';
import { createWoodTexture, createFabricTexture, createCustomUploadedTexture } from '../../utils/textureGenerators';

interface RoyalSofaModelProps {
  modelType: SofaModelType;
  wood: WoodFinish;
  fabric: FabricMaterial;
  customTextureUrl?: string;
  isSoftwareGl?: boolean;
}

export const RoyalSofaModel: React.FC<RoyalSofaModelProps> = ({
  modelType,
  wood,
  fabric,
  customTextureUrl,
  isSoftwareGl = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const is3Seater = modelType === '3-seater';

  // Target width for smooth transition
  const currentScaleX = useRef(is3Seater ? 1.0 : 1.0);

  // Generate or memoize textures
  const { woodMap, woodRoughnessMap } = useMemo(() => {
    const res = createWoodTexture(wood);
    return { woodMap: res.map, woodRoughnessMap: res.roughnessMap };
  }, [wood]);

  const { fabricMap, fabricNormalMap } = useMemo(() => {
    if (customTextureUrl) {
      const customTex = createCustomUploadedTexture(customTextureUrl);
      return { fabricMap: customTex, fabricNormalMap: undefined };
    }
    const res = createFabricTexture(fabric);
    return { fabricMap: res.map, fabricNormalMap: res.normalMap };
  }, [fabric, customTextureUrl]);

  // Wood PBR material
  const woodMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(wood.color),
      map: woodMap,
      roughness: wood.roughness,
      roughnessMap: woodRoughnessMap,
      metalness: wood.metalness,
      clearcoat: wood.clearcoat ?? 0.5,
      clearcoatRoughness: wood.clearcoatRoughness ?? 0.2,
      envMapIntensity: 1.4,
    });
  }, [wood, woodMap, woodRoughnessMap]);

  // Fabric PBR Material with luxurious sheen / cloth reflection
  const fabricMaterial = useMemo(() => {
    return new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(customTextureUrl ? 0xffffff : fabric.color),
      map: fabricMap,
      normalMap: fabricNormalMap,
      roughness: fabric.roughness,
      metalness: fabric.metalness,
      sheen: fabric.sheen ?? 0.8,
      sheenColor: new THREE.Color(fabric.sheenColor || fabric.color),
      sheenRoughness: 0.35,
      envMapIntensity: 0.8,
    });
  }, [fabric, fabricMap, fabricNormalMap, customTextureUrl]);

  // Gold Button material for tufting buttons
  const buttonMaterial = useMemo(() => {
    return new THREE.MeshStandardMaterial({
      color: new THREE.Color(wood.textureType === 'gold_leaf' ? '#ffd700' : wood.secondaryColor || '#aa7c11'),
      metalness: 0.85,
      roughness: 0.25,
    });
  }, [wood]);

  // Geometric layout dimensions
  const seatWidth = is3Seater ? 5.2 : 2.2;
  const halfW = seatWidth / 2;
  const seatDepth = 1.8;
  const seatY = 1.0;
  const backY = 2.4;
  const crownY = 3.8;

  // Smooth transition on model change
  useFrame((_, delta) => {
    if (groupRef.current) {
      // Gentle floating/breathing idle tilt
      const targetScale = is3Seater ? 1.0 : 1.0;
      currentScaleX.current = THREE.MathUtils.damp(currentScaleX.current, targetScale, 4, delta);
    }
  });

  // Procedural Diamond Tufting Buttons
  const tuftButtons = useMemo(() => {
    const buttons: [number, number, number][] = [];
    const rows = 4;
    const cols = is3Seater ? 11 : 5;
    const startX = -halfW + 0.35;
    const endX = halfW - 0.35;
    const stepX = (endX - startX) / (cols - 1);
    const startY = seatY + 0.45;
    const endY = crownY - 0.7;
    const stepY = (endY - startY) / (rows - 1);

    for (let r = 0; r < rows; r++) {
      const y = startY + r * stepY;
      const isOffset = r % 2 === 1;
      const numCols = isOffset ? cols - 1 : cols;
      const rowStartX = isOffset ? startX + stepX * 0.5 : startX;

      for (let c = 0; c < numCols; c++) {
        const x = rowStartX + c * stepX;
        // Curve along backrest depth
        const z = -0.5 - Math.sin((x / halfW) * 0.6) * 0.15;
        buttons.push([x, y, z]);
      }
    }
    return buttons;
  }, [is3Seater, halfW, seatY, crownY]);

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* 1. SEAT DECK & CUSHIONS */}
      {/* Wooden Apron Frame (Front & Sides) */}
      <mesh
        position={[0, seatY - 0.25, -0.1]}
        material={woodMaterial}
        castShadow={!isSoftwareGl}
        receiveShadow={!isSoftwareGl}
      >
        <boxGeometry args={[seatWidth + 0.5, 0.3, seatDepth + 0.2]} />
      </mesh>

      {/* Front Carved Apron Scroll Medallion */}
      <mesh
        position={[0, seatY - 0.25, seatDepth / 2 + 0.05]}
        material={woodMaterial}
        castShadow={!isSoftwareGl}
      >
        <cylinderGeometry args={[0.3, 0.4, 0.18, 16]} />
      </mesh>

      {/* Cushions */}
      {is3Seater ? (
        // 3-Seater Triple Cushions
        [-1.6, 0, 1.6].map((posX, i) => (
          <group key={`cushion-${i}`} position={[posX, seatY + 0.12, 0.05]}>
            <mesh material={fabricMaterial} castShadow={!isSoftwareGl}>
              <boxGeometry args={[1.65, 0.42, seatDepth - 0.1]} />
            </mesh>
            {/* Cushion Piping Trim */}
            <mesh position={[0, 0.18, 0]} material={buttonMaterial}>
              <boxGeometry args={[1.68, 0.04, seatDepth - 0.08]} />
            </mesh>
          </group>
        ))
      ) : (
        // 1-Seater Single Plush Cushion
        <group position={[0, seatY + 0.12, 0.05]}>
          <mesh material={fabricMaterial} castShadow={!isSoftwareGl}>
            <boxGeometry args={[seatWidth - 0.1, 0.44, seatDepth - 0.1]} />
          </mesh>
          {/* Piping Trim */}
          <mesh position={[0, 0.19, 0]} material={buttonMaterial}>
            <boxGeometry args={[seatWidth - 0.06, 0.04, seatDepth - 0.06]} />
          </mesh>
        </group>
      )}

      {/* 2. TUFTED BACKREST UPHOLSTERY */}
      <group position={[0, backY, -0.55]}>
        {/* Soft padded backrest slab with gentle arc */}
        <mesh material={fabricMaterial} castShadow={!isSoftwareGl}>
          <boxGeometry args={[seatWidth + 0.1, crownY - seatY - 0.3, 0.4]} />
        </mesh>

        {/* Diamond Tufting Buttons */}
        {tuftButtons.map(([bx, by, bz], idx) => (
          <mesh key={`tuft-${idx}`} position={[bx, by - backY, 0.22]} material={buttonMaterial}>
            <sphereGeometry args={[0.045, 12, 12]} />
          </mesh>
        ))}
      </group>

      {/* 3. ORNATE CARVED BACKREST WOODEN FRAME */}
      {/* Top Arched Frame Rail */}
      <mesh
        position={[0, crownY - 0.1, -0.6]}
        material={woodMaterial}
        castShadow={!isSoftwareGl}
      >
        <boxGeometry args={[seatWidth + 0.6, 0.35, 0.35]} />
      </mesh>

      {/* Left Outer Vertical Molding */}
      <mesh
        position={[-halfW - 0.25, (backY + crownY) / 2 - 0.3, -0.6]}
        material={woodMaterial}
        castShadow={!isSoftwareGl}
      >
        <cylinderGeometry args={[0.18, 0.2, crownY - seatY + 0.2, 16]} />
      </mesh>

      {/* Right Outer Vertical Molding */}
      <mesh
        position={[halfW + 0.25, (backY + crownY) / 2 - 0.3, -0.6]}
        material={woodMaterial}
        castShadow={!isSoftwareGl}
      >
        <cylinderGeometry args={[0.18, 0.2, crownY - seatY + 0.2, 16]} />
      </mesh>

      {/* 4. ROYAL CROWN CRESTS (تاج منبت‌کاری شده سلطنتی) */}
      {/* Central Magnificent Baroque Acanthus Crest */}
      <group position={[0, crownY + 0.25, -0.6]}>
        {/* Central Arch Shield */}
        <mesh material={woodMaterial} castShadow={!isSoftwareGl}>
          <cylinderGeometry args={[0.65, 0.3, 0.55, 16]} />
        </mesh>
        {/* Ornate Finial Spire */}
        <mesh position={[0, 0.45, 0]} material={woodMaterial}>
          <sphereGeometry args={[0.22, 16, 16]} />
        </mesh>
        <mesh position={[0, 0.72, 0]} material={woodMaterial}>
          <coneGeometry args={[0.15, 0.35, 16]} />
        </mesh>
        {/* Flanking Acanthus Scrolls */}
        <mesh position={[-0.55, -0.05, 0]} rotation={[0, 0, 0.4]} material={woodMaterial}>
          <torusGeometry args={[0.28, 0.08, 12, 24, Math.PI]} />
        </mesh>
        <mesh position={[0.55, -0.05, 0]} rotation={[0, 0, -0.4]} material={woodMaterial}>
          <torusGeometry args={[0.28, 0.08, 12, 24, Math.PI]} />
        </mesh>
      </group>

      {/* Flanking Secondary Crests for 3-Seater Sofa */}
      {is3Seater && (
        <>
          <group position={[-halfW * 0.65, crownY + 0.12, -0.6]}>
            <mesh material={woodMaterial} castShadow={!isSoftwareGl}>
              <cylinderGeometry args={[0.4, 0.2, 0.35, 16]} />
            </mesh>
            <mesh position={[0, 0.3, 0]} material={woodMaterial}>
              <sphereGeometry args={[0.15, 12, 12]} />
            </mesh>
          </group>
          <group position={[halfW * 0.65, crownY + 0.12, -0.6]}>
            <mesh material={woodMaterial} castShadow={!isSoftwareGl}>
              <cylinderGeometry args={[0.4, 0.2, 0.35, 16]} />
            </mesh>
            <mesh position={[0, 0.3, 0]} material={woodMaterial}>
              <sphereGeometry args={[0.15, 12, 12]} />
            </mesh>
          </group>
        </>
      )}

      {/* 5. CARVED ARMRESTS & ARM PADS (دسته‌های منبت و لمسه) */}
      {/* Left Armrest Assembly */}
      <group position={[-halfW - 0.28, seatY + 0.55, 0]}>
        {/* Wooden Curved Arm Rail */}
        <mesh material={woodMaterial} castShadow={!isSoftwareGl}>
          <boxGeometry args={[0.3, 0.22, seatDepth + 0.3]} />
        </mesh>
        {/* Front Scroll Volute */}
        <mesh position={[0, -0.15, seatDepth / 2 + 0.1]} material={woodMaterial}>
          <sphereGeometry args={[0.22, 16, 16]} />
        </mesh>
        {/* Armrest Fabric Pad */}
        <mesh position={[0, 0.16, -0.05]} material={fabricMaterial} castShadow={!isSoftwareGl}>
          <boxGeometry args={[0.26, 0.12, seatDepth - 0.2]} />
        </mesh>
      </group>

      {/* Right Armrest Assembly */}
      <group position={[halfW + 0.28, seatY + 0.55, 0]}>
        {/* Wooden Curved Arm Rail */}
        <mesh material={woodMaterial} castShadow={!isSoftwareGl}>
          <boxGeometry args={[0.3, 0.22, seatDepth + 0.3]} />
        </mesh>
        {/* Front Scroll Volute */}
        <mesh position={[0, -0.15, seatDepth / 2 + 0.1]} material={woodMaterial}>
          <sphereGeometry args={[0.22, 16, 16]} />
        </mesh>
        {/* Armrest Fabric Pad */}
        <mesh position={[0, 0.16, -0.05]} material={fabricMaterial} castShadow={!isSoftwareGl}>
          <boxGeometry args={[0.26, 0.12, seatDepth - 0.2]} />
        </mesh>
      </group>

      {/* 6. ORNATE CABRIOLE LEGS (پایه‌های سم آهویی سلطنتی) */}
      {/* Front Left Leg */}
      <group position={[-halfW - 0.1, 0, seatDepth / 2 - 0.05]}>
        <mesh position={[0, seatY * 0.45, 0]} material={woodMaterial} castShadow={!isSoftwareGl}>
          <cylinderGeometry args={[0.18, 0.1, seatY * 0.9, 16]} />
        </mesh>
        <mesh position={[0, 0.08, 0]} material={woodMaterial}>
          <sphereGeometry args={[0.13, 16, 16]} />
        </mesh>
      </group>

      {/* Front Right Leg */}
      <group position={[halfW + 0.1, 0, seatDepth / 2 - 0.05]}>
        <mesh position={[0, seatY * 0.45, 0]} material={woodMaterial} castShadow={!isSoftwareGl}>
          <cylinderGeometry args={[0.18, 0.1, seatY * 0.9, 16]} />
        </mesh>
        <mesh position={[0, 0.08, 0]} material={woodMaterial}>
          <sphereGeometry args={[0.13, 16, 16]} />
        </mesh>
      </group>

      {/* Back Left Leg */}
      <group position={[-halfW - 0.05, 0, -seatDepth / 2 + 0.1]}>
        <mesh position={[0, seatY * 0.45, 0]} material={woodMaterial} castShadow={!isSoftwareGl}>
          <cylinderGeometry args={[0.16, 0.12, seatY * 0.9, 16]} />
        </mesh>
      </group>

      {/* Back Right Leg */}
      <group position={[halfW + 0.05, 0, -seatDepth / 2 + 0.1]}>
        <mesh position={[0, seatY * 0.45, 0]} material={woodMaterial} castShadow={!isSoftwareGl}>
          <cylinderGeometry args={[0.16, 0.12, seatY * 0.9, 16]} />
        </mesh>
      </group>

      {/* Additional Center Legs for 3-Seater Sofa Stability */}
      {is3Seater && (
        <>
          <group position={[0, 0, seatDepth / 2 - 0.05]}>
            <mesh position={[0, seatY * 0.45, 0]} material={woodMaterial} castShadow={!isSoftwareGl}>
              <cylinderGeometry args={[0.16, 0.1, seatY * 0.9, 16]} />
            </mesh>
            <mesh position={[0, 0.08, 0]} material={woodMaterial}>
              <sphereGeometry args={[0.12, 16, 16]} />
            </mesh>
          </group>
          <group position={[0, 0, -seatDepth / 2 + 0.1]}>
            <mesh position={[0, seatY * 0.45, 0]} material={woodMaterial} castShadow={!isSoftwareGl}>
              <cylinderGeometry args={[0.15, 0.1, seatY * 0.9, 16]} />
            </mesh>
          </group>
        </>
      )}

      {/* 7. GROUND SHADOW DISC */}
      <mesh position={[0, 0.01, -0.1]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow={!isSoftwareGl}>
        <ringGeometry args={[0.2, Math.max(seatWidth, 3.5) * 0.85, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.45} depthWrite={false} />
      </mesh>
    </group>
  );
};
