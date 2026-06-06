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
    // Compress image
    await sharp(filePath)
      .jpeg({ quality: 80 })
      .toFile(compressedFilePath);
      
    const stat = fs.statSync(compressedFilePath);
    console.log(`[Success] Compressed size: ${stat.size} bytes`);
    
    if (stat.size > 10485760) {
        console.error('File is still larger than 10MB after compression');
        return null;
    }

    console.log(`[Pending] Uploading compressed file...`);
    const fileBuffer = fs.readFileSync(compressedFilePath);
    const mimeType = 'image/jpeg';
    const blob = new Blob([fileBuffer], { type: mimeType });
    
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
      return {
        name: filename.replace(' PA.png', ''),
        url: result.secure_url
      };
    } else {
      console.error(`[Error] Failed to upload:`, result.error ? result.error.message : result);
      return null;
    }
  } catch (err) {
    console.error(`[Error] Exception:`, err.message);
    return null;
  }
}

async function main() {
  const files = [
    'Bahasa Arab PA.png',
    'Bahasa Inggris PA.png',
    'Fiqih 4 Mazhab PA.png',
    'Kitab Kuning PA.png',
    'Physical Education PA.png',
    'Sains & Teknologi PA.png',
    'Sosial Humanity PA.png',
    "Tahfidz Al-Qur'an PA.png"
  ];

  const results = [];
  for (const file of files) {
    const res = await processFile(file);
    if (res) results.push(res);
  }

  fs.writeFileSync(path.join(__dirname, 'pa_images.json'), JSON.stringify(results, null, 2));
  console.log('Finished uploading all images.');
}

main();
