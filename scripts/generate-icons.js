import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const ICONS_DIR = path.resolve('public/icons');
if (!fs.existsSync(ICONS_DIR)) {
  fs.mkdirSync(ICONS_DIR, { recursive: true });
}

function hexToRgba(hex, alpha = 255) {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
    a: alpha
  };
}

function setPixel(png, x, y, r, g, b, a = 255) {
  if (x < 0 || x >= png.width || y < 0 || y >= png.height) return;
  const idx = (png.width * Math.floor(y) + Math.floor(x)) << 2;
  
  if (a < 255) {
    const bgA = png.data[idx + 3] / 255;
    const fgA = a / 255;
    const outA = fgA + bgA * (1 - fgA);
    if (outA > 0) {
      png.data[idx] = Math.round((r * fgA + png.data[idx] * bgA * (1 - fgA)) / outA);
      png.data[idx + 1] = Math.round((g * fgA + png.data[idx + 1] * bgA * (1 - fgA)) / outA);
      png.data[idx + 2] = Math.round((b * fgA + png.data[idx + 2] * bgA * (1 - fgA)) / outA);
      png.data[idx + 3] = Math.round(outA * 255);
    }
  } else {
    png.data[idx] = r;
    png.data[idx + 1] = g;
    png.data[idx + 2] = b;
    png.data[idx + 3] = a;
  }
}

function drawIcon(size, isMaskable = false) {
  const png = new PNG({ width: size, height: size });
  const center = size / 2;
  const maxRadius = isMaskable ? size * 0.48 : size * 0.46;

  const darkGreen = hexToRgba('#0B3D2E');
  const lightGreen = hexToRgba('#145A43');
  const tigerOrange = hexToRgba('#E65100');
  const tigerGold = hexToRgba('#F59E0B');
  const offWhite = hexToRgba('#F5F1E6');
  const pureBlack = hexToRgba('#18181B');
  const goldBorder = hexToRgba('#D97706');

  // Fill background
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - center;
      const dy = y - center;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (isMaskable) {
        // Full square background with subtle radial gradient
        const factor = Math.min(dist / (size * 0.7), 1);
        const r = Math.round(darkGreen.r * (1 - factor * 0.2));
        const g = Math.round(darkGreen.g * (1 - factor * 0.2));
        const b = Math.round(darkGreen.b * (1 - factor * 0.2));
        setPixel(png, x, y, r, g, b, 255);
      } else {
        // Rounded circle or badge with gold border
        if (dist <= maxRadius) {
          if (dist > maxRadius - size * 0.03) {
            // Outer gold border
            setPixel(png, x, y, goldBorder.r, goldBorder.g, goldBorder.b, 255);
          } else {
            const factor = dist / maxRadius;
            const r = Math.round(darkGreen.r * (1 - factor * 0.3) + lightGreen.r * (factor * 0.3));
            const g = Math.round(darkGreen.g * (1 - factor * 0.3) + lightGreen.g * (factor * 0.3));
            const b = Math.round(darkGreen.b * (1 - factor * 0.3) + lightGreen.b * (factor * 0.3));
            setPixel(png, x, y, r, g, b, 255);
          }
        } else if (dist <= maxRadius + 1) {
          // Antialias edge
          const alpha = Math.max(0, Math.min(255, Math.round((maxRadius + 1 - dist) * 255)));
          setPixel(png, x, y, goldBorder.r, goldBorder.g, goldBorder.b, alpha);
        } else {
          setPixel(png, x, y, 0, 0, 0, 0);
        }
      }
    }
  }

  // Draw Forest Tree Silhouettes in lower background
  const horizon = center + size * 0.12;
  for (let x = 0; x < size; x++) {
    const relX = (x - center) / (size * 0.4);
    if (Math.abs(relX) <= 1) {
      // 5 pine / sal tree cones
      for (let t = -2; t <= 2; t++) {
        const treeX = center + t * size * 0.15;
        const treePeakY = horizon - size * (0.18 + Math.cos(t) * 0.04);
        const treeBaseY = horizon + size * 0.08;
        const treeDx = Math.abs(x - treeX);
        const treeWidth = size * 0.1;
        
        if (treeDx < treeWidth) {
          for (let y = treePeakY; y <= treeBaseY; y++) {
            const progress = (y - treePeakY) / (treeBaseY - treePeakY);
            if (treeDx <= (progress * treeWidth)) {
              setPixel(png, x, y, 10, 45, 34, 180);
            }
          }
        }
      }
    }
  }

  // Draw stylized Tiger Head in center
  const headCenterY = center - size * 0.02;
  const headRadius = size * 0.24;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = x - center;
      const dy = y - headCenterY;
      const dist = Math.sqrt(dx * dx + (dy * 1.08) * (dy * 1.08));

      // Tiger Head Shape
      if (dist <= headRadius) {
        // Base orange-gold fur
        const furFactor = Math.abs(dx) / headRadius;
        const furR = Math.round(tigerGold.r * (1 - furFactor * 0.35) + tigerOrange.r * (furFactor * 0.35));
        const furG = Math.round(tigerGold.g * (1 - furFactor * 0.35) + tigerOrange.g * (furFactor * 0.35));
        const furB = Math.round(tigerGold.b * (1 - furFactor * 0.35) + tigerOrange.b * (furFactor * 0.35));
        setPixel(png, x, y, furR, furG, furB, 255);

        // White Muzzle Area (lower center)
        const muzzleDy = y - (headCenterY + headRadius * 0.45);
        const muzzleDist = Math.sqrt((dx * 1.3) * (dx * 1.3) + (muzzleDy * 1.8) * (muzzleDy * 1.8));
        if (muzzleDist < headRadius * 0.48) {
          setPixel(png, x, y, offWhite.r, offWhite.g, offWhite.b, 255);
        }

        // White eyebrow patches
        const eyePatchDy = y - (headCenterY - headRadius * 0.15);
        const leftEyePatchDist = Math.sqrt((dx + headRadius * 0.35) * (dx + headRadius * 0.35) + eyePatchDy * eyePatchDy * 2);
        const rightEyePatchDist = Math.sqrt((dx - headRadius * 0.35) * (dx - headRadius * 0.35) + eyePatchDy * eyePatchDy * 2);
        if (leftEyePatchDist < headRadius * 0.2 || rightEyePatchDist < headRadius * 0.2) {
          setPixel(png, x, y, offWhite.r, offWhite.g, offWhite.b, 255);
        }

        // Black stripes (forehead center trident & cheek stripes)
        // Center forehead trident
        if (Math.abs(dx) < headRadius * 0.08 && dy < headRadius * 0.1 && dy > -headRadius * 0.75) {
          setPixel(png, x, y, pureBlack.r, pureBlack.g, pureBlack.b, 240);
        }
        // Forehead side stripes
        const stripe1Dist = Math.abs(Math.abs(dx) - headRadius * 0.22);
        if (stripe1Dist < headRadius * 0.05 && dy < -headRadius * 0.15 && dy > -headRadius * 0.65) {
          setPixel(png, x, y, pureBlack.r, pureBlack.g, pureBlack.b, 240);
        }
        // Cheek stripes (angled)
        const cheekStripe1 = Math.abs((Math.abs(dx) - headRadius * 0.55) + dy * 0.4);
        if (cheekStripe1 < headRadius * 0.06 && Math.abs(dx) > headRadius * 0.3 && dy > -headRadius * 0.2 && dy < headRadius * 0.5) {
          setPixel(png, x, y, pureBlack.r, pureBlack.g, pureBlack.b, 240);
        }
        const cheekStripe2 = Math.abs((Math.abs(dx) - headRadius * 0.6) - dy * 0.3);
        if (cheekStripe2 < headRadius * 0.05 && Math.abs(dx) > headRadius * 0.35 && dy > 0 && dy < headRadius * 0.6) {
          setPixel(png, x, y, pureBlack.r, pureBlack.g, pureBlack.b, 240);
        }

        // Tiger Eyes (luminous amber/emerald gold)
        const leftEyeDist = Math.sqrt((dx + headRadius * 0.36) * (dx + headRadius * 0.36) + (y - (headCenterY + headRadius * 0.02)) * (y - (headCenterY + headRadius * 0.02)) * 2);
        const rightEyeDist = Math.sqrt((dx - headRadius * 0.36) * (dx - headRadius * 0.36) + (y - (headCenterY + headRadius * 0.02)) * (y - (headCenterY + headRadius * 0.02)) * 2);
        if (leftEyeDist < headRadius * 0.11 || rightEyeDist < headRadius * 0.11) {
          // Eye rim black
          if (leftEyeDist > headRadius * 0.07 || rightEyeDist > headRadius * 0.07) {
            setPixel(png, x, y, pureBlack.r, pureBlack.g, pureBlack.b, 255);
          } else {
            // Golden eye pupil
            setPixel(png, x, y, 250, 204, 21, 255);
            // Slit pupil
            if (Math.abs(dx + headRadius * 0.36) < headRadius * 0.02 || Math.abs(dx - headRadius * 0.36) < headRadius * 0.02) {
              setPixel(png, x, y, 20, 20, 20, 255);
            }
          }
        }

        // Nose (pinkish-black triangle at bottom center of muzzle)
        const noseDy = y - (headCenterY + headRadius * 0.42);
        if (noseDy >= 0 && noseDy < headRadius * 0.18 && Math.abs(dx) < (headRadius * 0.16 - noseDy * 0.5)) {
          setPixel(png, x, y, 50, 30, 30, 255);
        }
      }

      // Tiger Ears (top left & top right rounded triangles)
      const earLeftDist = Math.sqrt((dx + headRadius * 0.65) * (dx + headRadius * 0.65) + (dy + headRadius * 0.75) * (dy + headRadius * 0.75));
      const earRightDist = Math.sqrt((dx - headRadius * 0.65) * (dx - headRadius * 0.65) + (dy + headRadius * 0.75) * (dy + headRadius * 0.75));
      if (earLeftDist < headRadius * 0.32 || earRightDist < headRadius * 0.32) {
        if (earLeftDist < headRadius * 0.18 || earRightDist < headRadius * 0.18) {
          setPixel(png, x, y, offWhite.r, offWhite.g, offWhite.b, 255);
        } else {
          setPixel(png, x, y, pureBlack.r, pureBlack.g, pureBlack.b, 255);
        }
      }
    }
  }

  // Draw stylized text banner or stars at bottom
  const bannerY = center + size * 0.32;
  for (let x = 0; x < size; x++) {
    const dx = x - center;
    if (Math.abs(dx) < size * 0.28) {
      for (let y = bannerY - size * 0.03; y <= bannerY + size * 0.03; y++) {
        const factor = Math.abs(dx) / (size * 0.28);
        if (factor < 0.95) {
          setPixel(png, x, y, goldBorder.r, goldBorder.g, goldBorder.b, 240);
        }
      }
    }
  }

  return png;
}

function savePng(png, filepath) {
  return new Promise((resolve, reject) => {
    const stream = fs.createWriteStream(filepath);
    png.pack().pipe(stream);
    stream.on('finish', () => {
      console.log(`Saved: ${filepath}`);
      resolve();
    });
    stream.on('error', reject);
  });
}

async function main() {
  const icon192 = drawIcon(192, false);
  await savePng(icon192, path.resolve('public/icons/icon-192.png'));

  const icon512 = drawIcon(512, false);
  await savePng(icon512, path.resolve('public/icons/icon-512.png'));

  const maskable512 = drawIcon(512, true);
  await savePng(maskable512, path.resolve('public/icons/maskable-512.png'));

  // Also save apple-touch-icon and favicon
  await savePng(icon192, path.resolve('public/apple-touch-icon.png'));
  await savePng(drawIcon(64, false), path.resolve('public/favicon.png'));
  
  console.log('All icons generated successfully!');
}

main().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
