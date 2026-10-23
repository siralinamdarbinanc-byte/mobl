import * as THREE from 'three';
import { ColorFinish } from '../types/product';
import { createContactShadowTexture, createWatchFaceTexture } from './proceduralTextures';

export interface WatchModelRefs {
  rootGroup: THREE.Group;
  materials: {
    caseMaterial: THREE.MeshStandardMaterial;
    strapMaterial: THREE.MeshStandardMaterial;
    bezelMaterial: THREE.MeshStandardMaterial;
    crownMaterial: THREE.MeshStandardMaterial;
    crownAccentMaterial: THREE.MeshStandardMaterial;
    displayMaterial: THREE.MeshBasicMaterial;
    glassMaterial: THREE.MeshPhysicalMaterial;
    sensorBackMaterial: THREE.MeshStandardMaterial;
  };
  parts: {
    caseMesh: THREE.Mesh;
    bezelMesh: THREE.Mesh;
    displayMesh: THREE.Mesh;
    glassMesh: THREE.Mesh;
    backHousingMesh: THREE.Mesh;
    crownGroup: THREE.Group;
    sideButtonGroup: THREE.Group;
    topStrapGroup: THREE.Group;
    bottomStrapGroup: THREE.Group;
    sensorsGroup: THREE.Group;
  };
  updateFinish: (finish: ColorFinish, renderer: THREE.WebGLRenderer) => void;
  setExploded: (amount: number) => void;
  shadowPlane: THREE.Mesh;
}

/**
 * Creates a rounded rectangular 2D shape with smooth corner fillets
 */
function createRoundedRectShape(width: number, height: number, radius: number): THREE.Shape {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -height / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + height - radius);
  shape.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  shape.lineTo(x + radius, y + height);
  shape.quadraticCurveTo(x, y + height, x, y + height - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);
  return shape;
}

/**
 * Builds the comprehensive procedural smartwatch model
 */
export function buildProceduralWatch(
  renderer: THREE.WebGLRenderer,
  initialFinish: ColorFinish,
  isSoftwareGl: boolean
): WatchModelRefs {
  const rootGroup = new THREE.Group();
  rootGroup.name = 'SmartAeroWatch';

  // 1. Materials setup with PBR physical properties
  const caseMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialFinish.caseColor),
    metalness: initialFinish.metalness,
    roughness: initialFinish.roughness,
    envMapIntensity: 1.25,
  });

  const strapMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialFinish.strapColor),
    metalness: 0.1,
    roughness: 0.65,
    envMapIntensity: 0.5,
  });

  const bezelMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialFinish.bezelColor),
    metalness: 0.95,
    roughness: 0.15,
    envMapIntensity: 1.4,
  });

  const crownMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialFinish.buckleColor),
    metalness: 0.95,
    roughness: 0.2,
    envMapIntensity: 1.5,
  });

  const crownAccentMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color(initialFinish.caseColor),
    metalness: 0.9,
    roughness: 0.2,
  });

  const sensorBackMaterial = new THREE.MeshStandardMaterial({
    color: new THREE.Color('#15171c'),
    metalness: 0.85,
    roughness: 0.2,
  });

  // Watch Face AMOLED Texture
  const displayTexture = createWatchFaceTexture(renderer, initialFinish.hex);
  const displayMaterial = new THREE.MeshBasicMaterial({
    map: displayTexture,
    toneMapped: false,
  });

  // Sapphire Front Glass
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: new THREE.Color(0xffffff),
    metalness: 0.05,
    roughness: 0.04,
    transmission: isSoftwareGl ? 0 : 0.94,
    transparent: true,
    opacity: isSoftwareGl ? 0.35 : 1,
    ior: 1.54,
    thickness: 0.2,
    reflectivity: 0.9,
    depthWrite: false,
  });

  // 2. Main Watch Chassis (Extruded Rounded Rectangle with beveled edges)
  // Dimensions calibrated to approx 44mm smartwatch scale
  const caseShape = createRoundedRectShape(2.2, 2.5, 0.55);
  const caseExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.38,
    bevelEnabled: true,
    bevelSegments: 8,
    steps: 1,
    bevelSize: 0.12,
    bevelThickness: 0.12,
  };
  const caseGeometry = new THREE.ExtrudeGeometry(caseShape, caseExtrudeSettings);
  caseGeometry.center();
  const caseMesh = new THREE.Mesh(caseGeometry, caseMaterial);
  caseMesh.castShadow = !isSoftwareGl;
  caseMesh.receiveShadow = !isSoftwareGl;
  rootGroup.add(caseMesh);

  // 3. Bezel Rim (Surrounds the OLED screen)
  const bezelShape = createRoundedRectShape(1.95, 2.25, 0.45);
  const bezelExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.05,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.04,
    bevelThickness: 0.04,
  };
  const bezelGeometry = new THREE.ExtrudeGeometry(bezelShape, bezelExtrudeSettings);
  bezelGeometry.center();
  const bezelMesh = new THREE.Mesh(bezelGeometry, bezelMaterial);
  bezelMesh.position.z = 0.32;
  rootGroup.add(bezelMesh);

  // 4. AMOLED Display Face
  const displayShape = createRoundedRectShape(1.86, 2.16, 0.4);
  const displayGeometry = new THREE.ShapeGeometry(displayShape, 32);
  const displayMesh = new THREE.Mesh(displayGeometry, displayMaterial);
  displayMesh.position.z = 0.34;
  rootGroup.add(displayMesh);

  // 5. Sapphire Crystal Glass Cover
  const glassShape = createRoundedRectShape(1.96, 2.26, 0.46);
  const glassExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.02,
    bevelEnabled: true,
    bevelSegments: 6,
    bevelSize: 0.05,
    bevelThickness: 0.05,
  };
  const glassGeometry = new THREE.ExtrudeGeometry(glassShape, glassExtrudeSettings);
  glassGeometry.center();
  const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
  glassMesh.position.z = 0.36;
  glassMesh.renderOrder = 2;
  rootGroup.add(glassMesh);

  // 6. Rear Ceramic Sensor Housing & Optical Bio-sensors
  const backShape = createRoundedRectShape(1.9, 2.1, 0.45);
  const backExtrudeSettings: THREE.ExtrudeGeometryOptions = {
    depth: 0.1,
    bevelEnabled: true,
    bevelSegments: 5,
    bevelSize: 0.06,
    bevelThickness: 0.06,
  };
  const backGeometry = new THREE.ExtrudeGeometry(backShape, backExtrudeSettings);
  backGeometry.center();
  const backHousingMesh = new THREE.Mesh(backGeometry, sensorBackMaterial);
  backHousingMesh.position.z = -0.32;
  rootGroup.add(backHousingMesh);

  // Sensor cluster (optical round pod + 4 LED diodes)
  const sensorsGroup = new THREE.Group();
  sensorsGroup.position.z = -0.42;

  const sensorDiscGeo = new THREE.CylinderGeometry(0.55, 0.55, 0.04, 32);
  const sensorGlassMat = new THREE.MeshStandardMaterial({
    color: 0x050508,
    metalness: 0.95,
    roughness: 0.1,
  });
  const sensorDisc = new THREE.Mesh(sensorDiscGeo, sensorGlassMat);
  sensorDisc.rotation.x = Math.PI / 2;
  sensorsGroup.add(sensorDisc);

  // Optical LED rings (green + infrared emitters)
  const ledGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16);
  const greenLedMat = new THREE.MeshStandardMaterial({
    color: 0x22c55e,
    emissive: new THREE.Color(0x15803d),
    emissiveIntensity: 0.8,
  });
  const redLedMat = new THREE.MeshStandardMaterial({
    color: 0xef4444,
    emissive: new THREE.Color(0xb91c1c),
    emissiveIntensity: 0.8,
  });

  const ledOffsets = [
    { x: 0.25, y: 0, mat: greenLedMat },
    { x: -0.25, y: 0, mat: greenLedMat },
    { x: 0, y: 0.25, mat: redLedMat },
    { x: 0, y: -0.25, mat: redLedMat },
  ];

  ledOffsets.forEach(({ x, y, mat }) => {
    const led = new THREE.Mesh(ledGeo, mat);
    led.position.set(x, y, -0.01);
    led.rotation.x = Math.PI / 2;
    sensorsGroup.add(led);
  });
  rootGroup.add(sensorsGroup);

  // 7. Right Digital Crown (Knurled rotating dial)
  const crownGroup = new THREE.Group();
  crownGroup.position.set(1.28, 0.55, 0);

  const crownBodyGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.22, 32);
  const crownMesh = new THREE.Mesh(crownBodyGeo, crownMaterial);
  crownMesh.rotation.z = Math.PI / 2;
  crownGroup.add(crownMesh);

  // Knurled grip grooves around the crown (instanced ring ribs)
  const grooveGeo = new THREE.BoxGeometry(0.2, 0.02, 0.02);
  const grooveMat = new THREE.MeshStandardMaterial({
    color: 0x111115,
    metalness: 0.9,
    roughness: 0.4,
  });
  const grooveCount = 20;
  for (let i = 0; i < grooveCount; i++) {
    const angle = (i * Math.PI * 2) / grooveCount;
    const rib = new THREE.Mesh(grooveGeo, grooveMat);
    rib.position.set(0.08, Math.cos(angle) * 0.24, Math.sin(angle) * 0.24);
    crownGroup.add(rib);
  }

  // Crown accent inner cap
  const crownCapGeo = new THREE.CylinderGeometry(0.18, 0.18, 0.04, 32);
  const crownCap = new THREE.Mesh(crownCapGeo, crownAccentMaterial);
  crownCap.rotation.z = Math.PI / 2;
  crownCap.position.x = 0.11;
  crownGroup.add(crownCap);
  rootGroup.add(crownGroup);

  // 8. Right Side Pill Button
  const sideButtonGroup = new THREE.Group();
  sideButtonGroup.position.set(1.24, -0.45, 0);
  const buttonGeo = new THREE.CapsuleGeometry(0.1, 0.45, 4, 16);
  const sideButtonMesh = new THREE.Mesh(buttonGeo, crownMaterial);
  sideButtonMesh.scale.set(0.6, 1, 0.6);
  sideButtonGroup.add(sideButtonMesh);
  rootGroup.add(sideButtonGroup);

  // Left Acoustic Mic & Speaker Ports
  const speakerGeo = new THREE.CapsuleGeometry(0.04, 0.35, 4, 12);
  const speakerMat = new THREE.MeshBasicMaterial({ color: 0x050507 });
  const speakerMesh = new THREE.Mesh(speakerGeo, speakerMat);
  speakerMesh.position.set(-1.26, 0.2, 0);
  speakerMesh.scale.set(0.5, 1, 0.5);
  rootGroup.add(speakerMesh);

  // 9. Watch Straps (Curved ergonomic band wrapping around top & bottom)
  // We construct realistic curved sweep curves for top strap (12 o'clock) and bottom strap (6 o'clock)
  const topStrapGroup = new THREE.Group();
  const bottomStrapGroup = new THREE.Group();

  function createStrapMesh(isTop: boolean): THREE.Mesh {
    const curvePoints: THREE.Vector3[] = [];
    const segments = 16;
    const sign = isTop ? 1 : -1;

    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      // Natural watch strap draping curve extending from lugs to display stand
      const y = sign * (1.3 + t * 2.2);
      const z = -Math.pow(t, 1.8) * 1.35;
      curvePoints.push(new THREE.Vector3(0, y, z));
    }

    const path = new THREE.CatmullRomCurve3(curvePoints);
    // Extrude rectangular band cross-section along the curve
    const bandWidth = 1.45;
    const bandThickness = 0.14;
    const bandShape = createRoundedRectShape(bandWidth, bandThickness, 0.05);

    const extrudeSettings: THREE.ExtrudeGeometryOptions = {
      steps: 40,
      bevelEnabled: false,
      extrudePath: path,
    };

    const strapGeo = new THREE.ExtrudeGeometry(bandShape, extrudeSettings);
    const strapMesh = new THREE.Mesh(strapGeo, strapMaterial);
    strapMesh.castShadow = !isSoftwareGl;
    return strapMesh;
  }

  const topStrapMesh = createStrapMesh(true);
  topStrapGroup.add(topStrapMesh);
  rootGroup.add(topStrapGroup);

  const bottomStrapMesh = createStrapMesh(false);
  bottomStrapGroup.add(bottomStrapMesh);

  // Add Buckle / Clasp Pin on the bottom strap
  const buckleGeo = new THREE.BoxGeometry(1.52, 0.2, 0.22);
  const buckleMesh = new THREE.Mesh(buckleGeo, crownMaterial);
  buckleMesh.position.set(0, -2.4, -0.65);
  bottomStrapGroup.add(buckleMesh);

  rootGroup.add(bottomStrapGroup);

  // 10. Contact Shadow Plane grounded beneath the watch
  const shadowGeo = new THREE.PlaneGeometry(6, 6);
  const shadowTexture = createContactShadowTexture();
  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -3.2;
  rootGroup.add(shadowPlane);

  // 11. Initial rotation angle for striking hero product showcase
  rootGroup.position.set(0, 0.1, 0);
  rootGroup.rotation.set(0.15, -0.3, 0);

  // Finish updater function
  const updateFinish = (finish: ColorFinish, activeRenderer: THREE.WebGLRenderer) => {
    // Smoothly set material colors
    caseMaterial.color.set(finish.caseColor);
    caseMaterial.metalness = finish.metalness;
    caseMaterial.roughness = finish.roughness;

    strapMaterial.color.set(finish.strapColor);
    bezelMaterial.color.set(finish.bezelColor);
    crownMaterial.color.set(finish.buckleColor);
    crownAccentMaterial.color.set(finish.caseColor);

    // Update watch face accent color
    const newDisplayTexture = createWatchFaceTexture(activeRenderer, finish.hex);
    displayMaterial.map = newDisplayTexture;
    displayMaterial.needsUpdate = true;
  };

  // Exploded View Assembly controller
  const setExploded = (amount: number) => {
    // amount: 0 (assembled) to 1 (fully separated)
    glassMesh.position.z = 0.36 + amount * 0.9;
    bezelMesh.position.z = 0.32 + amount * 0.6;
    displayMesh.position.z = 0.34 + amount * 0.35;
    backHousingMesh.position.z = -0.32 - amount * 0.45;
    sensorsGroup.position.z = -0.42 - amount * 0.8;
    topStrapGroup.position.y = amount * 0.6;
    bottomStrapGroup.position.y = -amount * 0.6;
    crownGroup.position.x = 1.28 + amount * 0.5;
    sideButtonGroup.position.x = 1.24 + amount * 0.4;
  };

  return {
    rootGroup,
    materials: {
      caseMaterial,
      strapMaterial,
      bezelMaterial,
      crownMaterial,
      crownAccentMaterial,
      displayMaterial,
      glassMaterial,
      sensorBackMaterial,
    },
    parts: {
      caseMesh,
      bezelMesh,
      displayMesh,
      glassMesh,
      backHousingMesh,
      crownGroup,
      sideButtonGroup,
      topStrapGroup,
      bottomStrapGroup,
      sensorsGroup,
    },
    updateFinish,
    setExploded,
    shadowPlane,
  };
}
