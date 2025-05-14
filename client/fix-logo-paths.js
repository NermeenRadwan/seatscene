// ES module version for browser compatibility
import { promises as fs } from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// Get equivalent of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const directoryPath = path.join(__dirname, 'src');
const wrongPath = '/ArtboVard 1@4x.png';
const correctPath = '/Artboard 1@4x.png';
let filesFixed = 0;

// Function to read all files in a directory recursively
async function readFilesRecursively(dir) {
  const files = await fs.readdir(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = await fs.stat(filePath);
    
    if (stat.isDirectory()) {
      await readFilesRecursively(filePath);
    } else if (stat.isFile() && (file.endsWith('.jsx') || file.endsWith('.js'))) {
      await fixLogoPath(filePath);
    }
  }
}

// Function to fix logo path in a file
async function fixLogoPath(filePath) {
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    if (content.includes(wrongPath)) {
      const newContent = content.replace(new RegExp(wrongPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), correctPath);
      await fs.writeFile(filePath, newContent, 'utf8');
      filesFixed++;
      console.log(`Fixed logo path in: ${filePath}`);
    }
  } catch (err) {
    console.error(`Error processing file ${filePath}:`, err);
  }
}

// Start the process
console.log('Starting to fix logo paths...');
readFilesRecursively(directoryPath).then(() => {
  console.log(`Completed! Fixed ${filesFixed} files.`);
}); 