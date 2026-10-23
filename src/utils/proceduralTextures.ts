import * as THREE from 'three';

/**
 * Procedurally generates a high-resolution, futuristic smartwatch AMOLED dial texture
 */
export function createWatchFaceTexture(renderer: THREE.WebGLRenderer, finishColor: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Draw background - deep AMOLED true black with subtle edge vignette
  const bgGrad = ctx.createRadialGradient(512, 512, 100, 512, 512, 512);
  bgGrad.addColorStop(0, '#0a0d14');
  bgGrad.addColorStop(0.7, '#05070a');
  bgGrad.addColorStop(1, '#000000');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  // Outer subtle minute tick markings
  ctx.save();
  ctx.translate(512, 512);
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI) / 30;
    const isMajor = i % 5 === 0;
    const length = isMajor ? 18 : 8;
    const innerR = 470;
    const outerR = innerR + length;

    ctx.beginPath();
    ctx.strokeStyle = isMajor ? 'rgba(255, 255, 255, 0.45)' : 'rgba(255, 255, 255, 0.15)';
    ctx.lineWidth = isMajor ? 3 : 1.5;
    ctx.moveTo(Math.cos(angle) * innerR, Math.sin(angle) * innerR);
    ctx.lineTo(Math.cos(angle) * outerR, Math.sin(angle) * outerR);
    ctx.stroke();
  }
  ctx.restore();

  // Top Status Bar: Battery and Weather
  // Battery Arc (top left)
  ctx.save();
  ctx.beginPath();
  ctx.arc(320, 240, 48, -Math.PI * 0.8, Math.PI * 0.6, false);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(320, 240, 48, -Math.PI * 0.8, Math.PI * 0.35, false);
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.stroke();

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 24px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('94%', 320, 242);

  ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('BATTERY', 320, 262);
  ctx.restore();

  // Weather Widget (top right)
  ctx.save();
  ctx.beginPath();
  ctx.arc(704, 240, 48, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#fbbf24';
  ctx.beginPath();
  ctx.arc(704, 225, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('72°', 704, 258);

  ctx.font = '500 12px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('CLEAR', 704, 274);
  ctx.restore();

  // Center Brand Pill & Date
  ctx.save();
  ctx.fillStyle = finishColor || '#38bdf8';
  ctx.font = '700 18px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.letterSpacing = '3px';
  ctx.fillText('AURA AERO', 512, 330);

  ctx.fillStyle = 'rgba(255, 255, 255, 0.65)';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('FRI 24 OCT', 512, 365);
  ctx.restore();

  // Large Bold Digital Time
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = '800 132px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.35)';
  ctx.shadowBlur = 18;
  ctx.fillText('10:09', 512, 500);
  ctx.restore();

  // Seconds sweep accent badge
  ctx.save();
  ctx.fillStyle = finishColor || '#38bdf8';
  ctx.font = '700 36px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('38 SEC', 512, 550);
  ctx.restore();

  // Triple Activity Rings (Move, Exercise, Stand)
  const ringCenterX = 350;
  const ringCenterY = 720;

  // Outer Ring: Move (Coral Red)
  ctx.save();
  ctx.beginPath();
  ctx.arc(ringCenterX, ringCenterY, 80, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(ringCenterX, ringCenterY, 80, -Math.PI / 2, Math.PI * 0.9, false);
  ctx.strokeStyle = '#fa3958';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Middle Ring: Exercise (Electric Lime)
  ctx.beginPath();
  ctx.arc(ringCenterX, ringCenterY, 62, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(163, 230, 53, 0.15)';
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(ringCenterX, ringCenterY, 62, -Math.PI / 2, Math.PI * 0.7, false);
  ctx.strokeStyle = '#a3e635';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();

  // Inner Ring: Stand (Cyan)
  ctx.beginPath();
  ctx.arc(ringCenterX, ringCenterY, 44, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(6, 182, 212, 0.15)';
  ctx.lineWidth = 14;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(ringCenterX, ringCenterY, 44, -Math.PI / 2, Math.PI * 0.5, false);
  ctx.strokeStyle = '#06b6d4';
  ctx.lineWidth = 14;
  ctx.lineCap = 'round';
  ctx.stroke();
  ctx.restore();

  // Activity Labels
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('640 / 750', 460, 690);
  ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#fa3958';
  ctx.fillText('CALORIES BURNED', 460, 710);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('42 / 30 MIN', 460, 742);
  ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#a3e635';
  ctx.fillText('ACTIVE EXERCISE', 460, 762);
  ctx.restore();

  // Bottom Center: Heart Rate Pill
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(360, 830, 304, 56, 28);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.08)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Red Heart Icon
  ctx.fillStyle = '#ef4444';
  ctx.font = '24px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('♥', 400, 866);

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('74 BPM', 425, 866);

  ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.fillText('RESTING', 525, 866);
  ctx.restore();

  // Texture instantiation
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  texture.needsUpdate = true;
  return texture;
}

/**
 * Creates soft contact shadow radial gradient texture
 */
export function createContactShadowTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    const gradient = ctx.createRadialGradient(256, 256, 40, 256, 256, 250);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0.85)');
    gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.55)');
    gradient.addColorStop(0.65, 'rgba(0, 0, 0, 0.2)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
