import * as THREE from 'three';
import { WoodFinish, FabricMaterial } from '../types/furniture';

/**
 * Procedurally generates wood grain and carving finish textures
 */
export function createWoodTexture(wood: WoodFinish): { map: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  const roughCanvas = document.createElement('canvas');
  roughCanvas.width = 1024;
  roughCanvas.height = 1024;
  const rCtx = roughCanvas.getContext('2d')!;

  if (wood.textureType === 'gold_leaf') {
    // Ornate distressed gold leaf with leaf seams and warm patina
    ctx.fillStyle = wood.color;
    ctx.fillRect(0, 0, 1024, 1024);

    // Gold leaf square grid lines (traditional 8x8cm gold leaf sheets)
    ctx.strokeStyle = 'rgba(74, 53, 14, 0.4)';
    ctx.lineWidth = 3;
    const leafSize = 256;
    for (let x = 0; x <= 1024; x += leafSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 1024);
      ctx.stroke();
    }
    for (let y = 0; y <= 1024; y += leafSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(1024, y);
      ctx.stroke();
    }

    // Gilded micro-flakes and burnished specks
    for (let i = 0; i < 4000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const size = Math.random() * 4 + 1;
      const alpha = Math.random() * 0.4;
      ctx.fillStyle = Math.random() > 0.4 ? `rgba(255, 235, 140, ${alpha})` : `rgba(80, 50, 10, ${alpha})`;
      ctx.fillRect(x, y, size, size);
    }
  } else if (wood.textureType === 'pearl_patina') {
    // Ivory enamel with gold glaze in crevices
    ctx.fillStyle = wood.color;
    ctx.fillRect(0, 0, 1024, 1024);

    const grad = ctx.createLinearGradient(0, 0, 1024, 1024);
    grad.addColorStop(0, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(0.5, 'rgba(212, 175, 55, 0.15)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0.25)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Subtle pearlescent marble veins
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.2)';
    ctx.lineWidth = 2;
    for (let i = 0; i < 20; i++) {
      ctx.beginPath();
      let y = Math.random() * 1024;
      ctx.moveTo(0, y);
      for (let x = 0; x < 1024; x += 100) {
        y += (Math.random() - 0.5) * 40;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else {
    // Natural Walnut or Beechwood grain
    ctx.fillStyle = wood.color;
    ctx.fillRect(0, 0, 1024, 1024);

    // Flowing organic wood rings & fibers
    const ringCount = wood.textureType === 'walnut' ? 35 : 55;
    for (let i = 0; i < ringCount; i++) {
      ctx.beginPath();
      const waveOffset = Math.sin(i * 0.3) * 60;
      ctx.strokeStyle = i % 2 === 0 ? 'rgba(0, 0, 0, 0.22)' : 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = Math.random() * 6 + 2;

      for (let y = 0; y <= 1024; y += 40) {
        const x = (i * 1024) / ringCount + Math.sin(y * 0.015) * (waveOffset + 25);
        if (y === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }

    // Micro pores
    for (let j = 0; j < 3000; j++) {
      const px = Math.random() * 1024;
      const py = Math.random() * 1024;
      ctx.fillStyle = 'rgba(0, 0, 0, 0.18)';
      ctx.fillRect(px, py, 1.5, Math.random() * 8 + 2);
    }
  }

  // Roughness Map
  rCtx.fillStyle = `rgb(${Math.floor(wood.roughness * 255)}, ${Math.floor(wood.roughness * 255)}, ${Math.floor(wood.roughness * 255)})`;
  rCtx.fillRect(0, 0, 1024, 1024);

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(2, 2);

  const roughnessMap = new THREE.CanvasTexture(roughCanvas);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;
  roughnessMap.repeat.set(2, 2);

  return { map, roughnessMap };
}

/**
 * Procedurally generates fabric textures including Persian Damask, Velvet, and Leather
 */
export function createFabricTexture(fabric: FabricMaterial): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture } {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // Base base color
  ctx.fillStyle = fabric.color;
  ctx.fillRect(0, 0, 1024, 1024);

  if (fabric.patternType === 'damask') {
    // Royal Damask Floral Arabesque (طرح زریبافت اسلیمی)
    const goldColor = '#d4af37';
    ctx.save();
    const tileSize = 256;

    for (let ox = 0; ox < 1024; ox += tileSize) {
      for (let oy = 0; oy < 1024; oy += tileSize) {
        ctx.save();
        ctx.translate(ox + tileSize / 2, oy + tileSize / 2);

        // Damask central ornate medallion
        ctx.fillStyle = 'rgba(212, 175, 55, 0.65)';
        ctx.strokeStyle = goldColor;
        ctx.lineWidth = 3;

        // Central acanthus bud
        ctx.beginPath();
        ctx.arc(0, 0, 24, 0, Math.PI * 2);
        ctx.stroke();

        // 4 Petals
        for (let p = 0; p < 4; p++) {
          ctx.rotate(Math.PI / 2);
          ctx.beginPath();
          ctx.moveTo(0, 15);
          ctx.bezierCurveTo(35, 35, 45, 75, 0, 95);
          ctx.bezierCurveTo(-45, 75, -35, 35, 0, 15);
          ctx.fillStyle = 'rgba(212, 175, 55, 0.35)';
          ctx.fill();
          ctx.stroke();

          // Scroll flourishes
          ctx.beginPath();
          ctx.arc(40, 50, 12, 0, Math.PI * 1.5);
          ctx.stroke();
        }

        // Diamond enclosing lattice
        ctx.beginPath();
        ctx.moveTo(0, -tileSize / 2 + 10);
        ctx.lineTo(tileSize / 2 - 10, 0);
        ctx.lineTo(0, tileSize / 2 - 10);
        ctx.lineTo(-tileSize / 2 + 10, 0);
        ctx.closePath();
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.restore();
      }
    }
    ctx.restore();
  } else if (fabric.patternType === 'leather') {
    // Vintage Italian Leather pore network and subtle distress
    for (let i = 0; i < 6000; i++) {
      const x = Math.random() * 1024;
      const y = Math.random() * 1024;
      const radius = Math.random() * 3 + 1;
      ctx.fillStyle = Math.random() > 0.5 ? 'rgba(0, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.08)';
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
  } else {
    // Velvet or Silk micro-weave cross-hatch
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    for (let x = 0; x < 1024; x += 4) {
      ctx.fillRect(x, 0, 1.5, 1024);
    }
    for (let y = 0; y < 1024; y += 4) {
      ctx.fillRect(0, y, 1024, 1.5);
    }
  }

  // Normal Map (Soft textile relief)
  const normCanvas = document.createElement('canvas');
  normCanvas.width = 512;
  normCanvas.height = 512;
  const nCtx = normCanvas.getContext('2d')!;
  nCtx.fillStyle = '#8080ff'; // Flat normal
  nCtx.fillRect(0, 0, 512, 512);

  const map = new THREE.CanvasTexture(canvas);
  map.colorSpace = THREE.SRGBColorSpace;
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;
  map.repeat.set(fabric.patternType === 'damask' ? 3 : 4, fabric.patternType === 'damask' ? 3 : 4);

  const normalMap = new THREE.CanvasTexture(normCanvas);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;
  normalMap.repeat.set(4, 4);

  return { map, normalMap };
}

/**
 * Loads user-uploaded image texture
 */
export function createCustomUploadedTexture(dataUrl: string): THREE.Texture {
  const loader = new THREE.TextureLoader();
  const texture = loader.load(dataUrl);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 3);
  return texture;
}
