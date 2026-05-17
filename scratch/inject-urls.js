const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const MAPPING_FILE = path.join(__dirname, '..', 'src', 'utils', 'cloudinary-mapping.json');

// Get all files in a directory recursively matching extension
function getFiles(dir, exts, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      getFiles(filePath, exts, files);
    } else {
      const ext = path.extname(file).toLowerCase();
      if (exts.includes(ext)) {
        files.push(filePath);
      }
    }
  }
  return files;
}

function main() {
  console.log('=== Cloudinary URL Injector ===');
  
  if (!fs.existsSync(MAPPING_FILE)) {
    console.error('Error: Mapping file not found!');
    process.exit(1);
  }

  const mapping = JSON.parse(fs.readFileSync(MAPPING_FILE, 'utf8'));
  console.log(`Loaded ${Object.keys(mapping).length} URL mappings.`);

  // Find all .tsx, .ts, .css files in src
  const files = getFiles(SRC_DIR, ['.tsx', '.ts', '.css']);
  console.log(`Found ${files.length} code files to check.\n`);

  let totalReplacements = 0;
  let filesModified = 0;

  for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;
    let fileReplacedCount = 0;

    // Apply each mapping to the file content
    for (const [localPath, remoteUrl] of Object.entries(mapping)) {
      // Create variations for matching:
      // 1. Raw local path (e.g. "/Logo/Logo Pondok Pesantren.png")
      // 2. URL-encoded path (e.g. "/Logo/Logo%20Pondok%20Pesantren.png")
      // 3. No leading slash variations (e.g. "Logo/Logo Pondok Pesantren.png" & "Logo/Logo%20Pondok%20Pesantren.png")
      
      const localPathNoSlash = localPath.startsWith('/') ? localPath.slice(1) : localPath;
      const localPathSlash = localPath.startsWith('/') ? localPath : '/' + localPath;
      
      const encodedSlash = encodeURI(localPathSlash);
      const encodedNoSlash = encodeURI(localPathNoSlash);

      const targets = new Set([
        localPathSlash,
        localPathNoSlash,
        encodedSlash,
        encodedNoSlash,
        // Also handle double quote surrounding or single quote if necessary
      ]);

      for (const target of targets) {
        // Escape special regex characters in the target
        const escapedTarget = target.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
        
        // We want to match the target string exactly when enclosed in quotes or in a CSS url()
        // Or in a JSX source attribute
        const regexStr = escapedTarget;
        const regex = new RegExp(regexStr, 'g');
        
        if (regex.test(content)) {
          const matchCount = (content.match(regex) || []).length;
          content = content.replace(regex, remoteUrl);
          fileReplacedCount += matchCount;
          totalReplacements += matchCount;
        }
      }
    }

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      const relativePath = path.relative(SRC_DIR, filePath);
      console.log(`[Modified] src/${relativePath} - Replaced ${fileReplacedCount} image paths.`);
      filesModified++;
    }
  }

  console.log('\n=== Injection Summary ===');
  console.log(`Files modified: ${filesModified}`);
  console.log(`Total image paths replaced: ${totalReplacements}`);
}

main();
