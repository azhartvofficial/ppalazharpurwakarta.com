const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CLOUD_NAME = 'dpgqct4hz';
const UPLOAD_PRESET = 'alazharpwk';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

async function processFile(filename) {
  const filePath = path.join(PUBLIC_DIR, filename);
  let uploadPath = filePath;

  console.log(`\n[Pending] Processing: ${filename}`);

  try {
    if (filename.endsWith('.png')) {
      uploadPath = path.join(PUBLIC_DIR, filename.replace('.png', '_compressed.jpg'));
      await sharp(filePath)
        .jpeg({ quality: 80 })
        .toFile(uploadPath);
    }
      
    const stat = fs.statSync(uploadPath);
    console.log(`[Success] File size to upload: ${stat.size} bytes`);
    
    const fileBuffer = fs.readFileSync(uploadPath);
    const blob = new Blob([fileBuffer], { type: 'image/jpeg' });
    
    const formData = new FormData();
    formData.append('file', blob, path.basename(uploadPath));
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

async function main() {
  await processFile('Bahasa Arab PA.png');
  await processFile('Media Kreatif PA.png');
  await processFile('Matematika PA_compressed.jpg');
}

main();
