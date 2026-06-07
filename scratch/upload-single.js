const fs = require('fs');
const path = require('path');

const CLOUD_NAME = 'dpgqct4hz';
const UPLOAD_PRESET = 'alazharpwk';

async function uploadFile(filePath) {
  const ext = path.extname(filePath);
  
  console.log(`\n[Pending] Uploading: ${filePath}`);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = 'image/png';
    const blob = new Blob([fileBuffer], { type: mimeType });
    
    const formData = new FormData();
    formData.append('file', blob, path.basename(filePath));
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
    console.error(`[Error] Exception during upload:`, err.message);
  }
}

uploadFile(path.join(__dirname, '..', 'public', 'Ketua Media Azhar Tv.png'));
