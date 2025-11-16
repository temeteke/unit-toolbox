import sharp from 'sharp';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..');

const svgBuffer = readFileSync(join(projectRoot, 'public', 'icon.svg'));

async function generateIcons() {
  // 192x192 icon
  await sharp(svgBuffer)
    .resize(192, 192)
    .png()
    .toFile(join(projectRoot, 'public', 'icon-192x192.png'));

  console.log('✓ Generated icon-192x192.png');

  // 512x512 icon
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(join(projectRoot, 'public', 'icon-512x512.png'));

  console.log('✓ Generated icon-512x512.png');

  // 180x180 apple-touch-icon
  await sharp(svgBuffer)
    .resize(180, 180)
    .png()
    .toFile(join(projectRoot, 'public', 'apple-touch-icon.png'));

  console.log('✓ Generated apple-touch-icon.png');

  // 32x32 favicon
  await sharp(svgBuffer)
    .resize(32, 32)
    .png()
    .toFile(join(projectRoot, 'public', 'favicon-32x32.png'));

  console.log('✓ Generated favicon-32x32.png');

  // 16x16 favicon
  await sharp(svgBuffer)
    .resize(16, 16)
    .png()
    .toFile(join(projectRoot, 'public', 'favicon-16x16.png'));

  console.log('✓ Generated favicon-16x16.png');

  console.log('\n✓ All icons generated successfully!');
}

generateIcons().catch(console.error);
