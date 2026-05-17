const fs = require('fs');
const path = require('path');

const CLOUD_NAME = 'dpgqct4hz';
const UPLOAD_PRESET = 'alazharpwk';
const PUBLIC_DIR = path.join(__dirname, '..', 'public');

// MIME types mapping
const MIME_TYPES = {
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};

// Recursive file scanner
function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, files);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (MIME_TYPES[ext]) {
        files.push(filePath);
      }
    }
  }
  return files;
}

async function uploadFile(filePath) {
  const relativePath = path.relative(PUBLIC_DIR, filePath);
  const ext = path.extname(filePath);
  
  console.log(`\n[Pending] Uploading: ${relativePath}`);

  try {
    const fileBuffer = fs.readFileSync(filePath);
    const mimeType = MIME_TYPES[ext] || 'application/octet-stream';
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
      return { success: true, local: relativePath, remote: result.secure_url };
    } else {
      console.error(`[Error] Failed to upload ${relativePath}:`, result.error ? result.error.message : result);
      return { success: false, local: relativePath, error: result.error ? result.error.message : 'Unknown error' };
    }
  } catch (err) {
    console.error(`[Error] Exception during upload of ${relativePath}:`, err.message);
    return { success: false, local: relativePath, error: err.message };
  }
}

async function main() {
  console.log('=== Cloudinary Bulk Uploader ===');
  console.log(`Scanning: ${PUBLIC_DIR}`);
  
  if (!fs.existsSync(PUBLIC_DIR)) {
    console.error('Error: public directory not found!');
    process.exit(1);
  }

  const files = getFiles(PUBLIC_DIR);
  console.log(`Found ${files.length} images to upload.\n`);

  const results = [];
  for (let i = 0; i < files.length; i++) {
    console.log(`Progress: ${i + 1}/${files.length}`);
    const res = await uploadFile(files[i]);
    results.push(res);
    // Tiny delay to be gentle on rate limits
    await new Promise(resolve => setTimeout(resolve, 300));
  }

  console.log('\n=== Upload Summary ===');
  const succeeded = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`Successfully uploaded: ${succeeded.length}`);
  console.log(`Failed: ${failed.length}`);

  if (failed.length > 0) {
    console.log('\nFailed uploads:');
    failed.forEach(f => console.log(`- ${f.local}: ${f.error}`));
  }

  // Save the mapping for easy reference in our code changes
  const mappingFile = path.join(__dirname, 'cloudinary-mapping.json');
  const mapping = {};
  succeeded.forEach(s => {
    // Standardize path to use forward slashes for cross-platform matches
    const key = '/' + s.local.replace(/\\/g, '/');
    mapping[key] = s.remote;
  });
  fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));
  console.log(`\nMapping successfully saved to: ${mappingFile}`);
}

main();
