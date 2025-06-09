#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔨 Building HBUI application...');

try {
  // Step 1: Build the application
  console.log('📦 Building main, preload, and renderer...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 2: Ensure .webpack directory structure
  const webpackDir = path.join(__dirname, '.webpack');
  if (!fs.existsSync(webpackDir)) {
    fs.mkdirSync(webpackDir, { recursive: true });
  }

  // Step 3: Copy main.js to the expected location
  const mainSrc = path.join(__dirname, 'dist', 'main.js');
  const mainDest = path.join(__dirname, '.webpack', 'main');
  
  if (fs.existsSync(mainSrc)) {
    console.log('📋 Copying main.js to .webpack/main...');
    fs.copyFileSync(mainSrc, mainDest);
  } else {
    throw new Error('main.js not found in dist directory');
  }

  // Step 4: Copy preload.js to the expected location
  const preloadSrc = path.join(__dirname, 'dist', 'preload.js');
  const preloadDest = path.join(__dirname, '.webpack', 'preload.js');
  
  if (fs.existsSync(preloadSrc)) {
    console.log('📋 Copying preload.js to .webpack/preload.js...');
    fs.copyFileSync(preloadSrc, preloadDest);
  }

  // Step 5: Verify files exist
  if (!fs.existsSync(mainDest)) {
    throw new Error('.webpack/main file not found after copy');
  }

  console.log('✅ Build preparation complete');
  console.log('📦 Starting Electron Forge packaging...');

  // Step 6: Backup original config and use simple config
  const originalConfig = path.join(__dirname, 'forge.config.ts');
  const simpleConfig = path.join(__dirname, 'forge.config.simple.ts');
  const backupConfig = path.join(__dirname, 'forge.config.ts.backup');

  if (fs.existsSync(originalConfig)) {
    fs.copyFileSync(originalConfig, backupConfig);
  }
  fs.copyFileSync(simpleConfig, originalConfig);

  try {
    // Step 7: Run electron-forge package
    execSync('npx electron-forge package', { stdio: 'inherit' });
  } finally {
    // Step 8: Restore original config
    if (fs.existsSync(backupConfig)) {
      fs.copyFileSync(backupConfig, originalConfig);
      fs.unlinkSync(backupConfig);
    }
  }

  console.log('🎉 Packaging completed successfully!');

  // Step 7: List the output
  const outDir = path.join(__dirname, 'out');
  if (fs.existsSync(outDir)) {
    console.log('\n📁 Generated packages:');
    const files = fs.readdirSync(outDir);
    files.forEach(file => {
      const filePath = path.join(outDir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        console.log(`  📂 ${file}/`);
        const subFiles = fs.readdirSync(filePath);
        subFiles.forEach(subFile => {
          console.log(`    📄 ${subFile}`);
        });
      } else {
        console.log(`  📄 ${file}`);
      }
    });
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
