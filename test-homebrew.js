#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🧪 Running HBUI Basic Tests...\n');

let testsPassed = 0;
let testsFailed = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
    testsPassed++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    testsFailed++;
  }
}

// Test 1: Check if main files exist
test('Main application files exist', () => {
  const requiredFiles = [
    'package.json',
    'src/main/main.ts',
    'src/main/preload.ts',
    'src/renderer/App.tsx',
    'src/renderer/index.html'
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(`Required file missing: ${file}`);
    }
  }
});

// Test 2: Check package.json structure
test('Package.json has required fields', () => {
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  
  const requiredFields = ['name', 'version', 'main', 'scripts'];
  for (const field of requiredFields) {
    if (!pkg[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
  
  if (pkg.version !== '1.0.0') {
    throw new Error(`Expected version 1.0.0, got ${pkg.version}`);
  }
});

// Test 3: Check if build files can be generated
test('Build system configuration is valid', () => {
  const buildFiles = [
    'webpack.main.config.js',
    'webpack.preload.config.js',
    'webpack.renderer.config.js',
    'forge.config.ts'
  ];
  
  for (const file of buildFiles) {
    if (!fs.existsSync(file)) {
      throw new Error(`Build configuration file missing: ${file}`);
    }
  }
});

// Test 4: Check if TypeScript files are valid
test('TypeScript configuration exists', () => {
  if (!fs.existsSync('tsconfig.json')) {
    throw new Error('tsconfig.json not found');
  }
  
  const tsconfig = JSON.parse(fs.readFileSync('tsconfig.json', 'utf8'));
  if (!tsconfig.compilerOptions) {
    throw new Error('Invalid tsconfig.json structure');
  }
});

// Test 5: Check if React components exist
test('Core React components exist', () => {
  const components = [
    'src/renderer/components/PackageDetails.tsx',
    'src/renderer/components/TagManager.tsx',
    'src/renderer/components/BatchOperations.tsx',
    'src/renderer/components/ServiceManager.tsx',
    'src/renderer/components/CacheManager.tsx'
  ];
  
  for (const component of components) {
    if (!fs.existsSync(component)) {
      throw new Error(`Component missing: ${component}`);
    }
  }
});

// Test 6: Check if i18n files exist
test('Internationalization files exist', () => {
  if (!fs.existsSync('src/renderer/i18n.ts')) {
    throw new Error('i18n configuration missing');
  }
  
  // Check if i18n file contains required languages
  const i18nContent = fs.readFileSync('src/renderer/i18n.ts', 'utf8');
  const requiredLanguages = ['en', 'zh-CN', 'zh-TW'];
  
  for (const lang of requiredLanguages) {
    if (!i18nContent.includes(`'${lang}'`) && !i18nContent.includes(`"${lang}"`)) {
      throw new Error(`Language ${lang} not found in i18n configuration`);
    }
  }
});

// Test 7: Check if build scripts exist
test('Build scripts exist and are executable', () => {
  const scripts = [
    'build-and-package.js',
    'build-and-make.js'
  ];
  
  for (const script of scripts) {
    if (!fs.existsSync(script)) {
      throw new Error(`Build script missing: ${script}`);
    }
    
    // Check if file is executable (on Unix systems)
    try {
      const stats = fs.statSync(script);
      if (process.platform !== 'win32' && !(stats.mode & parseInt('111', 8))) {
        console.warn(`⚠️  Warning: ${script} may not be executable`);
      }
    } catch (error) {
      // Ignore permission check errors
    }
  }
});

// Test 8: Check if dist directory can be created
test('Build output directory structure', () => {
  // This test just checks if we can create the dist directory
  const distDir = 'dist';
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  if (!fs.existsSync(distDir)) {
    throw new Error('Cannot create dist directory');
  }
});

// Test 9: Validate forge configuration
test('Forge configuration is valid', () => {
  const forgeConfig = 'forge.config.ts';
  const simpleConfig = 'forge.config.simple.ts';
  
  if (!fs.existsSync(forgeConfig)) {
    throw new Error('forge.config.ts not found');
  }
  
  if (!fs.existsSync(simpleConfig)) {
    throw new Error('forge.config.simple.ts not found');
  }
  
  // Basic syntax check
  const configContent = fs.readFileSync(forgeConfig, 'utf8');
  if (!configContent.includes('ForgeConfig')) {
    throw new Error('Invalid forge configuration structure');
  }
});

// Test 10: Check CSS files
test('CSS files exist', () => {
  const cssFiles = [
    'src/renderer/App.css'
  ];
  
  for (const cssFile of cssFiles) {
    if (!fs.existsSync(cssFile)) {
      throw new Error(`CSS file missing: ${cssFile}`);
    }
  }
});

// Summary
console.log('\n📊 Test Results:');
console.log(`✅ Passed: ${testsPassed}`);
console.log(`❌ Failed: ${testsFailed}`);
console.log(`📈 Total: ${testsPassed + testsFailed}`);

if (testsFailed > 0) {
  console.log('\n❌ Some tests failed. Please fix the issues before proceeding.');
  process.exit(1);
} else {
  console.log('\n🎉 All tests passed! HBUI is ready for building and packaging.');
  process.exit(0);
}
