#!/usr/bin/env node

/**
 * Zeno Deployment Script
 * 
 * This script prepares and deploys Zeno to GitHub Pages.
 * Run from GitHub Codespaces or any environment with Node.js.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Configuration
const CONFIG = {
  sourceDir: path.join(__dirname, '..'),
  buildDir: path.join(__dirname, '../dist'),
  publicDir: path.join(__dirname, '../public'),
  homePage: 'apps/home/index.html'
};

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m'
};

// Helper functions
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logStep(step) {
  log(`\n${colors.bright}${colors.cyan}▶ ${step}${colors.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, 'green');
}

function logError(message) {
  log(`✗ ${message}`, 'red');
}

function logWarning(message) {
  log(`⚠ ${message}`, 'yellow');
}

function createReadlineInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

function askQuestion(query) {
  const rl = createReadlineInterface();
  return new Promise(resolve => {
    rl.question(query, answer => {
      rl.close();
      resolve(answer);
    });
  });
}

// Main deployment functions
function validateEnvironment() {
  logStep('Validating environment');
  
  // Check if we're in a git repository
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'pipe' });
    logSuccess('Git repository found');
  } catch (error) {
    logError('Not a git repository');
    process.exit(1);
  }
  
  // Check if we're on main branch
  const currentBranch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
  if (currentBranch !== 'main') {
    logWarning(`Not on main branch (currently on ${currentBranch})`);
    const response = await askQuestion('Continue anyway? (y/n): ');
    if (response.toLowerCase() !== 'y') {
      process.exit(0);
    }
  }
  
  // Check for uncommitted changes
  const status = execSync('git status --porcelain', { encoding: 'utf8' });
  if (status.trim()) {
    logWarning('There are uncommitted changes:');
    console.log(status);
    const response = await askQuestion('Continue with uncommitted changes? (y/n): ');
    if (response.toLowerCase() !== 'y') {
      process.exit(0);
    }
  }
}

function createBuildDirectory() {
  logStep('Creating build directory');
  
  // Clean or create dist directory
  if (fs.existsSync(CONFIG.buildDir)) {
    log('Cleaning existing build directory...', 'dim');
    fs.rmSync(CONFIG.buildDir, { recursive: true, force: true });
  }
  
  fs.mkdirSync(CONFIG.buildDir, { recursive: true });
  logSuccess('Build directory created');
}

function copyStaticAssets() {
  logStep('Copying static assets');
  
  // Copy public directory
  if (fs.existsSync(CONFIG.publicDir)) {
    copyRecursiveSync(CONFIG.publicDir, CONFIG.buildDir);
    logSuccess('Public assets copied');
  } else {
    logWarning('Public directory not found');
  }
  
  // Copy design system
  const designSystemDir = path.join(CONFIG.sourceDir, 'packages/design-system');
  const destDesignSystemDir = path.join(CONFIG.buildDir, 'packages/design-system');
  
  if (fs.existsSync(designSystemDir)) {
    fs.mkdirSync(path.dirname(destDesignSystemDir), { recursive: true });
    copyRecursiveSync(designSystemDir, destDesignSystemDir);
    logSuccess('Design system copied');
  }
}

function processHtmlFiles() {
  logStep('Processing HTML files');
  
  // Process home page
  const homePagePath = path.join(CONFIG.sourceDir, CONFIG.homePage);
  if (fs.existsSync(homePagePath)) {
    let content = fs.readFileSync(homePagePath, 'utf8');
    
    // Update relative paths for deployment
    content = content.replace(
      /href="\.\.\/\.\.\/packages\/design-system\//g,
      'href="packages/design-system/'
    );
    
    content = content.replace(
      /src="\.\.\/\.\.\/packages\//g,
      'src="packages/'
    );
    
    content = content.replace(
      /href="\.\.\/\.\.\/public\//g,
      'href="'
    );
    
    content = content.replace(
      /src="\.\.\/\.\.\/public\//g,
      'src="'
    );
    
    // Write processed file
    const destPath = path.join(CONFIG.buildDir, 'index.html');
    fs.mkdirSync(path.dirname(destPath), { recursive: true });
    fs.writeFileSync(destPath, content);
    
    logSuccess('Home page processed and optimized');
  } else {
    logError(`Home page not found at ${CONFIG.homePage}`);
    process.exit(1);
  }
  
  // Create a simple 404 page
  const notFoundPage = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Page Not Found - Zeno</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #0D1B2A 0%, #415A77 100%);
            color: white;
            text-align: center;
            padding: 20px;
        }
        .container {
            max-width: 500px;
        }
        h1 {
            font-size: 4rem;
            margin: 0;
            color: #FF9E00;
        }
        p {
            font-size: 1.2rem;
            opacity: 0.9;
            margin: 20px 0;
        }
        a {
            color: #FF9E00;
            text-decoration: none;
            font-weight: bold;
        }
        a:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>404</h1>
        <p>The page you're looking for doesn't exist.</p>
        <p><a href="/">Return to Zeno Dashboard</a></p>
    </div>
</body>
</html>`;
  
  fs.writeFileSync(path.join(CONFIG.buildDir, '404.html'), notFoundPage);
  logSuccess('404 page created');
}

function createCNAME() {
  logStep('Configuring custom domain (optional)');
  
  const hasCustomDomain = await askQuestion('Do you want to use a custom domain? (y/n): ');
  if (hasCustomDomain.toLowerCase() === 'y') {
    const domain = await askQuestion('Enter your domain (e.g., zeno.example.com): ');
    
    if (domain) {
      fs.writeFileSync(path.join(CONFIG.buildDir, 'CNAME'), domain.trim());
      logSuccess(`Custom domain configured: ${domain}`);
    } else {
      logWarning('No domain provided, skipping CNAME');
    }
  } else {
    log('Skipping custom domain configuration', 'dim');
  }
}

function createNojekyll() {
  // Create .nojekyll file to disable Jekyll on GitHub Pages
  fs.writeFileSync(path.join(CONFIG.buildDir, '.nojekyll'), '');
  log('Created .nojekyll file', 'dim');
}

function generateSitemap() {
  logStep('Generating sitemap');
  
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://yourusername.github.io/zeno/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;
  
  fs.writeFileSync(path.join(CONFIG.buildDir, 'sitemap.xml'), sitemap);
  logSuccess('Sitemap generated');
}

async function deployToGitHubPages() {
  logStep('Deploying to GitHub Pages');
  
  // Check if gh-pages branch exists locally
  try {
    execSync('git show-ref --verify --quiet refs/heads/gh-pages', { stdio: 'pipe' });
    log('gh-pages branch exists locally', 'dim');
  } catch (error) {
    log('Creating orphan gh-pages branch...', 'dim');
    execSync('git checkout --orphan gh-pages', { stdio: 'pipe' });
    execSync('git reset --hard', { stdio: 'pipe' });
    execSync('git commit --allow-empty -m "Initial gh-pages commit"', { stdio: 'pipe' });
    execSync('git push origin gh-pages', { stdio: 'pipe' });
    execSync('git checkout main', { stdio: 'pipe' });
  }
  
  // Deploy using gh-pages package if available, otherwise use git subtree
  try {
    // Try using gh-pages package
    require('gh-pages');
    log('Using gh-pages npm package...', 'dim');
    
    const ghpages = require('gh-pages');
    await new Promise((resolve, reject) => {
      ghpages.publish(CONFIG.buildDir, {
        branch: 'gh-pages',
        dotfiles: true,
        message: `Deploy: ${new Date().toISOString()}`
      }, (error) => {
        if (error) reject(error);
        else resolve();
      });
    });
    
    logSuccess('Deployed using gh-pages package');
  } catch (error) {
    // Fallback to git subtree
    log('Falling back to git subtree...', 'dim');
    
    // Switch to gh-pages branch
    execSync('git checkout gh-pages', { stdio: 'pipe' });
    
    // Remove existing files except .git
    const files = fs.readdirSync('.');
    files.forEach(file => {
      if (file !== '.git') {
        fs.rmSync(file, { recursive: true, force: true });
      }
    });
    
    // Copy built files
    copyRecursiveSync(CONFIG.buildDir, '.');
    
    // Commit and push
    execSync('git add .', { stdio: 'pipe' });
    execSync(`git commit -m "Deploy: ${new Date().toISOString()}"`, { stdio: 'pipe' });
    execSync('git push origin gh-pages', { stdio: 'pipe' });
    
    // Switch back to main
    execSync('git checkout main', { stdio: 'pipe' });
    
    logSuccess('Deployed using git subtree');
  }
}

function postDeploymentInstructions() {
  logStep('Deployment Complete!');
  
  const repoUrl = execSync('git remote get-url origin', { encoding: 'utf8' }).trim();
  const match = repoUrl.match(/github\.com[:/](.+?)(\.git)?$/);
  
  if (match) {
    const repoPath = match[1];
    const githubPagesUrl = `https://${repoPath.split('/')[0].toLowerCase()}.github.io/${repoPath.split('/')[1]}/`;
    
    log('\n' + '='.repeat(50), 'bright');
    log('🚀 Zeno has been deployed!', 'green');
    log('='.repeat(50), 'bright');
    log('\nYour Zeno dashboard is now available at:', 'white');
    log(githubPagesUrl, 'cyan');
    log('\nNext steps:', 'white');
    log('1. Visit the URL above to see your deployed dashboard', 'dim');
    log('2. It may take 1-2 minutes for GitHub Pages to update', 'dim');
    log('3. Configure GitHub Pages in repository settings if needed:', 'dim');
    log(`   https://github.com/${repoPath}/settings/pages`, 'blue');
    log('\nTo update your deployment:', 'white');
    log('1. Make your changes in the main branch', 'dim');
    log('2. Run this script again: npm run deploy', 'dim');
    log('='.repeat(50), 'bright');
  }
}

// Utility function to copy directories recursively
function copyRecursiveSync(src, dest) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

// Main deployment process
async function main() {
  try {
    log(`${colors.bright}${colors.magenta}🚀 Zeno Deployment Script${colors.reset}\n`);
    
    // Step 1: Validate environment
    await validateEnvironment();
    
    // Step 2: Prepare build directory
    createBuildDirectory();
    
    // Step 3: Copy assets
    copyStaticAssets();
    
    // Step 4: Process files
    processHtmlFiles();
    
    // Step 5: Optional configurations
    await createCNAME();
    createNojekyll();
    generateSitemap();
    
    // Step 6: Deploy
    await deployToGitHubPages();
    
    // Step 7: Show instructions
    postDeploymentInstructions();
    
  } catch (error) {
    logError(`Deployment failed: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

// Add a simple package.json script entry
function updatePackageJson() {
  const packageJsonPath = path.join(CONFIG.sourceDir, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      if (!packageJson.scripts) {
        packageJson.scripts = {};
      }
      
      packageJson.scripts.deploy = 'node scripts/deploy.js';
      
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
      logSuccess('Added deploy script to package.json');
    } catch (error) {
      logWarning('Could not update package.json');
    }
  } else {
    log('No package.json found, creating minimal one...', 'dim');
    
    const minimalPackageJson = {
      name: "zeno",
      version: "1.0.0",
      description: "Unified digital ecosystem",
      scripts: {
        "deploy": "node scripts/deploy.js"
      },
      keywords: ["productivity", "dashboard", "web-app"],
      author: "Zeno Project",
      license: "MIT"
    };
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(minimalPackageJson, null, 2));
    logSuccess('Created package.json with deploy script');
  }
}

// Run the deployment
if (require.main === module) {
  // First, ensure package.json has the deploy script
  updatePackageJson();
  
  // Then run the main deployment
  main().catch(console.error);
}

// Export functions for testing
module.exports = {
  validateEnvironment,
  createBuildDirectory,
  copyStaticAssets,
  processHtmlFiles,
  deployToGitHubPages
};