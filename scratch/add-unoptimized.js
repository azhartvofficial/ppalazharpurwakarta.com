const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');

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
  console.log('=== Next.js Image Tag unoptimized Injector ===');

  const files = getFiles(SRC_DIR, ['.tsx']);
  console.log(`Found ${files.length} component files to check.\n`);

  let modifiedCount = 0;
  let totalInjected = 0;

  for (const filePath of files) {
    let content = fs.readFileSync(filePath, 'utf8');
    let originalContent = content;

    // Regex to match <Image tags. This handles multiline tags up to the closing />
    // It captures:
    // Group 1: '<Image'
    // Group 2: All props inside the tag before the ending
    // Group 3: '/>' or '>'
    const imageTagRegex = /(<Image\b)([\s\S]*?)(\/>)/g;

    let match;
    let fileModified = false;
    let fileInjectedCount = 0;

    content = content.replace(imageTagRegex, (fullMatch, openTag, props, closeTag) => {
      // If it already has the 'unoptimized' prop, skip it
      if (/\bunoptimized\b/.test(props)) {
        return fullMatch;
      }

      // Check if it's loading a Cloudinary image or dynamic path
      const hasCloudinary = /res\.cloudinary\.com/.test(props);
      const isDynamicSrc = /src=\{/.test(props);
      
      if (hasCloudinary || isDynamicSrc || true) {
        // We add the 'unoptimized' prop right before the closing '/>'
        // Clean up trailing whitespaces, then add ' unoptimized'
        let newProps = props.trimEnd();
        
        // Insert 'unoptimized' on a new line or with simple spacing
        // We preserve the indentation formatting if possible
        if (newProps.includes('\n')) {
          // Find the indentation of the last line of props
          const lines = newProps.split('\n');
          const lastLine = lines[lines.length - 1];
          const indent = lastLine.match(/^\s*/)[0] || '              ';
          newProps += `\n${indent}unoptimized`;
        } else {
          newProps += ' unoptimized';
        }

        fileModified = true;
        fileInjectedCount++;
        totalInjected++;
        return `${openTag}${newProps}\n${closeTag.padStart(closeTag.length + 1)}`;
      }

      return fullMatch;
    });

    if (fileModified) {
      fs.writeFileSync(filePath, content, 'utf8');
      const relativePath = path.relative(SRC_DIR, filePath);
      console.log(`[Modified] src/${relativePath} - Injected 'unoptimized' to ${fileInjectedCount} <Image /> tags.`);
      modifiedCount++;
    }
  }

  console.log('\n=== Injector Summary ===');
  console.log(`Files modified: ${modifiedCount}`);
  console.log(`Total 'unoptimized' props added: ${totalInjected}`);
}

main();
