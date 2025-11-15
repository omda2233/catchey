const fs = require('fs');
const path = require('path');

function rmdirRecursive(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir)) {
    const full = path.join(dir, entry);
    const stat = fs.statSync(full);
    if (stat.isDirectory()) rmdirRecursive(full);
    else fs.unlinkSync(full);
  }
  fs.rmdirSync(dir);
}

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const stat = fs.statSync(s);
    if (stat.isDirectory()) copyRecursive(s, d);
    else fs.copyFileSync(s, d);
  }
}

const srcDir = path.resolve('build/web');
const destDir = path.resolve('www');

if (!fs.existsSync(srcDir)) {
  console.error(`Source directory not found: ${srcDir}`);
  process.exit(1);
}

if (fs.existsSync(destDir)) {
  rmdirRecursive(destDir);
}

fs.mkdirSync(destDir, { recursive: true });
copyRecursive(srcDir, destDir);
console.log(`Copied web assets from ${srcDir} -> ${destDir}`);