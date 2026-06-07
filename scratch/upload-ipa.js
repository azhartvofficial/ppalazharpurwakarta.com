const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CLOUD_NAME = 'dpgqct4hz';
const UPLOAD_PRESET = 'alazharpwk';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

async function processFile(filename) {
  const filePath = path.join(PUBLIC_DIR, filename);
  const compressedFilePath = path.join(PUBLIC_DIR, filename.replace('.png', '_compressed.jpg'));
  
  console.log(`\n[Pending] Compressing: ${filename}`);

  try {
    await sharp(filePath)
      .jpeg({ quality: 80 })
      .toFile(compressedFilePath);
      
    const stat = fs.statSync(compressedFilePath);
    console.log(`[Success] Compressed size: ${stat.size} bytes`);
    
    const fileBuffer = fs.readFileSync(compressedFilePath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('file', blob, path.basename(compressedFilePath));
    formData.append('upload_preset', UPLOAD_PRESET);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
      method: 'POST',
      body: formData
    });

    const result = await response.json();

    if (response.ok) {
      console.log(`[Success] Uploaded to: ${result.secure_url}`);
    } else {
      console.error(`[Error] Failed to upload:`, result.error);
    }
  } catch (err) {
    console.error(`[Error] Exception:`, err.message);
  }
}

processFile('Ilmu Pengetahuan Alam PA.png');
