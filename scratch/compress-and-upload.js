const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const CLOUD_NAME = 'dpgqct4hz';
const UPLOAD_PRESET = 'alazharpwk';

async function compressAndUpload(filePath) {
  const compressedFilePath = path.join(path.dirname(filePath), 'TAWWAB_PA_compressed.jpg');
  
  console.log(`[Pending] Compressing: ${filePath}`);

  try {
    // Compress image to JPEG to significantly reduce size while maintaining high quality
    await sharp(filePath)
      .jpeg({ quality: 85 })
      .toFile(compressedFilePath);
      
    const stat = fs.statSync(compressedFilePath);
    console.log(`[Success] Compressed size: ${stat.size} bytes`);
    
    if (stat.size > 10485760) {
        console.error('File is still larger than 10MB after compression');
        return;
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
    } else {
      console.error(`[Error] Failed to upload:`, result.error ? result.error.message : result);
    }
  } catch (err) {
    console.error(`[Error] Exception:`, err.message);
  }
}

compressAndUpload(path.join(__dirname, '..', 'public', 'TAWWAB PA .png'));
