import fs from 'fs';
import path from 'path';
import { Resvg } from '@resvg/resvg-js';
import sharp from 'sharp';

const RES_DIR = path.resolve(process.cwd(), 'android/app/src/main/res');
const SVG_PATH = path.resolve(process.cwd(), 'public/vtw-logo.svg');

async function run() {
  console.log('Generating official Valmiki Tiger Watch Android launcher icon assets...');

  if (!fs.existsSync(SVG_PATH)) {
    throw new Error(`Source SVG not found at ${SVG_PATH}`);
  }

  if (!fs.existsSync(RES_DIR)) {
    throw new Error(`Android resources directory not found at ${RES_DIR}`);
  }

  // 1. Read SVG and prepare emblem without outer square background
  const rawSvg = fs.readFileSync(SVG_PATH, 'utf-8');
  const transparentSvg = rawSvg.replace(
    '<rect width="1024" height="1024" fill="url(#bgDarkGrad)" />',
    ''
  );

  // 2. Render high-resolution master PNG (1024x1024) with vector precision
  const resvg = new Resvg(transparentSvg, {
    fitTo: { mode: 'width', value: 1024 }
  });
  const masterPng = resvg.render().asPng();

  // 3. Trim outer transparent padding to obtain exact tight bounding box of the circular emblem
  const tightEmblemBuffer = await sharp(masterPng).trim().toBuffer();
  const tightMeta = await sharp(tightEmblemBuffer).metadata();
  console.log(`Tight emblem master dimensions: ${tightMeta.width}x${tightMeta.height}`);

  // Android mipmap densities and dimensions
  const densities = [
    { name: 'mipmap-mdpi', legacy: 48, fgCanvas: 108, fgEmblem: 70 },
    { name: 'mipmap-hdpi', legacy: 72, fgCanvas: 162, fgEmblem: 105 },
    { name: 'mipmap-xhdpi', legacy: 96, fgCanvas: 216, fgEmblem: 140 },
    { name: 'mipmap-xxhdpi', legacy: 144, fgCanvas: 324, fgEmblem: 210 },
    { name: 'mipmap-xxxhdpi', legacy: 192, fgCanvas: 432, fgEmblem: 280 }
  ];

  for (const d of densities) {
    const dir = path.join(RES_DIR, d.name);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // A. Generate ic_launcher_foreground.png (Adaptive icon foreground, safe-zone fitted)
    const fgEmblem = await sharp(tightEmblemBuffer)
      .resize(d.fgEmblem, d.fgEmblem, { fit: 'contain' })
      .toBuffer();

    const fgOffset = Math.round((d.fgCanvas - d.fgEmblem) / 2);
    await sharp({
      create: {
        width: d.fgCanvas,
        height: d.fgCanvas,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: fgEmblem, top: fgOffset, left: fgOffset }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_foreground.png'));

    // B. Generate ic_launcher_round.png (Circular legacy icon, full bleed)
    const roundEmblemSize = Math.round(d.legacy * 0.96);
    const roundEmblem = await sharp(tightEmblemBuffer)
      .resize(roundEmblemSize, roundEmblemSize, { fit: 'contain' })
      .toBuffer();

    const roundOffset = Math.round((d.legacy - roundEmblemSize) / 2);
    await sharp({
      create: {
        width: d.legacy,
        height: d.legacy,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: roundEmblem, top: roundOffset, left: roundOffset }])
      .png()
      .toFile(path.join(dir, 'ic_launcher_round.png'));

    // C. Generate ic_launcher.png (Standard legacy icon with subtle padding)
    const legacyEmblemSize = Math.round(d.legacy * 0.92);
    const legacyEmblem = await sharp(tightEmblemBuffer)
      .resize(legacyEmblemSize, legacyEmblemSize, { fit: 'contain' })
      .toBuffer();

    const legacyOffset = Math.round((d.legacy - legacyEmblemSize) / 2);
    await sharp({
      create: {
        width: d.legacy,
        height: d.legacy,
        channels: 4,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      }
    })
      .composite([{ input: legacyEmblem, top: legacyOffset, left: legacyOffset }])
      .png()
      .toFile(path.join(dir, 'ic_launcher.png'));

    console.log(`Generated ${d.name}: ic_launcher (${d.legacy}x${d.legacy}), ic_launcher_round (${d.legacy}x${d.legacy}), ic_launcher_foreground (${d.fgCanvas}x${d.fgCanvas})`);
  }

  // 4. Update adaptive icon background color (#082E22 matches official VTW emerald emblem)
  const bgValuesPath = path.join(RES_DIR, 'values/ic_launcher_background.xml');
  const bgXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#082E22</color>
</resources>
`;
  fs.writeFileSync(bgValuesPath, bgXml, 'utf-8');
  console.log(`Updated values/ic_launcher_background.xml -> #082E22`);

  // 5. Update drawable/ic_launcher_background.xml with matching official emerald
  const bgDrawablePath = path.join(RES_DIR, 'drawable/ic_launcher_background.xml');
  const bgDrawableXml = `<?xml version="1.0" encoding="utf-8"?>
<vector xmlns:android="http://schemas.android.com/apk/res/android"
    android:width="108dp"
    android:height="108dp"
    android:viewportWidth="108"
    android:viewportHeight="108">
    <path
        android:fillColor="#082E22"
        android:pathData="M0,0h108v108h-108z" />
</vector>
`;
  fs.writeFileSync(bgDrawablePath, bgDrawableXml, 'utf-8');
  console.log(`Updated drawable/ic_launcher_background.xml -> #082E22`);

  // 6. Ensure mipmap-anydpi-v26 XMLs point to the foreground and background
  const anydpiDir = path.join(RES_DIR, 'mipmap-anydpi-v26');
  if (!fs.existsSync(anydpiDir)) {
    fs.mkdirSync(anydpiDir, { recursive: true });
  }

  const adaptiveIconXml = `<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
`;
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher.xml'), adaptiveIconXml, 'utf-8');
  fs.writeFileSync(path.join(anydpiDir, 'ic_launcher_round.xml'), adaptiveIconXml, 'utf-8');
  console.log(`Configured mipmap-anydpi-v26 adaptive icons`);

  // 7. Remove conflicting default vector ic_launcher_foreground.xml in drawable-v24 if present
  const robotVectorPath = path.join(RES_DIR, 'drawable-v24/ic_launcher_foreground.xml');
  if (fs.existsSync(robotVectorPath)) {
    fs.unlinkSync(robotVectorPath);
    console.log(`Removed conflicting default vector in drawable-v24/ic_launcher_foreground.xml`);
  }

  console.log('Android icon generation completed successfully!');
}

run().catch((err) => {
  console.error('Failed to generate Android icons:', err);
  process.exit(1);
});
