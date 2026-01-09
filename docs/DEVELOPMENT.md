# Zeno Development Guide

This guide covers how to set up your development environment, work on Zeno, and contribute to the project.

## Quick Start

### Using GitHub Codespaces (Recommended)

1. **Open Codespaces**:
   - Navigate to the Zeno repository on GitHub
   - Click the green "Code" button
   - Select the "Codespaces" tab
   - Click "Create codespace on main"

2. **Start Development Server**:
   ```bash
   # The environment is already set up
   # Open apps/home/index.html and use Live Server
Preview Changes:

Right-click apps/home/index.html

Select "Open with Live Server"

Your dashboard opens at http://localhost:5500

Manual Setup (Alternative)
Clone the repository:

bash
git clone https://github.com/yourusername/zeno.git
cd zeno
Open in any code editor (VS Code, Sublime, etc.)

Use a local server:

Install VS Code Live Server extension, OR

Use Python's simple HTTP server:

bash
python3 -m http.server 8000
Visit http://localhost:8000/apps/home/

Project Structure
text
zeno/
├── apps/                    # Individual applications
│   ├── home/               # Dashboard (START HERE)
│   │   ├── index.html      # Main dashboard page
│   │   ├── styles.css      # Home-specific styles
│   │   ├── app.js          # Home application logic
│   │   └── widgets/        # Widget components
│   ├── mail/               # Email app (future)
│   ├── calendar/           # Calendar app (future)
│   └── ...                 # Other apps
│
├── packages/               # Shared code
│   ├── design-system/      # Colors, typography, components
│   │   └── theme.css      # Design tokens
│   ├── core/              # Auth, search, storage (future)
│   └── components/        # Reusable UI components (future)
│
├── public/                # Static assets
│   ├── favicon.svg        # App icon
│   ├── manifest.json      # PWA manifest
│   └── robots.txt         # Search engine instructions
│
├── scripts/               # Build/deployment scripts
├── docs/                  # Documentation (you are here!)
└── .github/               # GitHub workflows and templates
Design System
Zeno uses a consistent design system defined in packages/design-system/theme.css.

Using Design Tokens
Always use CSS custom properties (variables) instead of hard-coded values:

css
/* ✅ CORRECT - Uses design tokens */
.button {
  background-color: var(--zeno-accent);
  color: var(--zeno-primary);
  padding: var(--zeno-space-4);
  border-radius: var(--zeno-radius-md);
}

/* ❌ INCORRECT - Hard-coded values */
.button {
  background-color: #FF9E00;
  color: #0D1B2A;
  padding: 16px;
  border-radius: 8px;
}
Available Tokens
Colors
css
--zeno-primary: #0D1B2A;      /* Deep Space Blue */
--zeno-secondary: #415A77;    /* Slate Blue */
--zeno-accent: #FF9E00;       /* Amber Gold */
--zeno-background: #F8F9FA;   /* Light Gray */
--zeno-surface: #FFFFFF;      /* White */
--zeno-text-primary: #212529; /* Charcoal */
Spacing
css
--zeno-space-1: 4px;   /* 0.25rem */
--zeno-space-2: 8px;   /* 0.5rem */
--zeno-space-3: 12px;  /* 0.75rem */
--zeno-space-4: 16px;  /* 1rem */
--zeno-space-6: 24px;  /* 1.5rem */
Typography
css
--zeno-font-xs: 0.75rem;   /* 12px */
--zeno-font-sm: 0.875rem;  /* 14px */
--zeno-font-base: 1rem;    /* 16px */
--zeno-font-lg: 1.125rem;  /* 18px */
--zeno-font-xl: 1.25rem;   /* 20px */
Creating a New Widget
Step 1: Add HTML Structure
Create a new widget in apps/home/index.html within the .widgets-grid:

html
<div class="widget widget-[name]" data-widget="[name]">
  <div class="widget-header">
    <div class="widget-title">
      <span data-lucide="icon-name"></span>
      <h3>Widget Title</h3>
    </div>
    <div class="widget-actions">
      <button class="widget-action-btn" aria-label="Action">
        <span data-lucide="icon"></span>
      </button>
    </div>
  </div>
  <div class="widget-content">
    <!-- Widget content here -->
  </div>
</div>
Step 2: Add CSS Styles
Add widget-specific styles in apps/home/styles.css:

css
/* [Name] Widget */
.widget-[name] .widget-content {
  /* Custom styles */
}

.widget-[name] .custom-element {
  /* Component styles */
}
Step 3: Add JavaScript Functionality
Add initialization code in apps/home/app.js:

javascript
function initialize[name]Widget() {
  const widget = document.querySelector('.widget-[name]');
  
  // Add event listeners
  widget.querySelector('.widget-action-btn').addEventListener('click', () => {
    // Handle action
  });
  
  // Initialize widget data
  load[name]Data();
}

function load[name]Data() {
  // Load data from localStorage or API
}
Step 4: Register the Widget
Add to the widget initialization in apps/home/app.js:

javascript
function initializeWidgets() {
  // Existing widgets...
  initialize[name]Widget();  // Add this line
}
Creating a New App
Step 1: Create App Structure
bash
mkdir -p apps/[app-name]
cd apps/[app-name]
touch index.html styles.css app.js
Step 2: Basic App Template
index.html:

html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Zeno [App Name]</title>
    <link rel="stylesheet" href="../../packages/design-system/theme.css">
    <link rel="stylesheet" href="styles.css">
    <script src="https://unpkg.com/lucide@latest" defer></script>
</head>
<body data-theme="light">
    <div class="zeno-app">
        <!-- App content -->
    </div>
    <script src="app.js"></script>
</body>
</html>
Step 3: Link from Home Dashboard
Add navigation in apps/home/index.html:

html
<li class="nav-item">
  <a href="../[app-name]/index.html" class="nav-link" data-app="[app-name]">
    <span class="nav-icon" data-lucide="icon"></span>
    <span class="nav-text">[App Name]</span>
  </a>
</li>
JavaScript Architecture
State Management
Zeno uses a simple state pattern in apps/home/app.js:

javascript
const ZenoState = {
  currentTheme: 'light',
  sidebarCollapsed: false,
  widgetLayout: {},
  // Add app-specific state here
};
Event Handling
Use event delegation for dynamic elements:

javascript
// ✅ Good - Event delegation
document.addEventListener('click', (e) => {
  if (e.target.closest('.widget-action-btn')) {
    handleWidgetAction(e.target);
  }
});

// ❌ Avoid - Individual listeners on many elements
document.querySelectorAll('.widget-action-btn').forEach(btn => {
  btn.addEventListener('click', handleWidgetAction);
});
LocalStorage Pattern
javascript
// Save data
function saveData(key, data) {
  try {
    localStorage.setItem(`zeno-${key}`, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error('Failed to save data:', error);
    return false;
  }
}

// Load data
function loadData(key, defaultValue = null) {
  try {
    const data = localStorage.getItem(`zeno-${key}`);
    return data ? JSON.parse(data) : defaultValue;
  } catch (error) {
    console.error('Failed to load data:', error);
    return defaultValue;
  }
}
Testing Your Changes
Manual Testing Checklist
Functionality:

All buttons work

Forms submit correctly

Data persists (theme, notes, etc.)

Search functions

Responsive Design:

Desktop (1200px+)

Tablet (768px-1199px)

Mobile (<768px)

Sidebar collapses on mobile

Accessibility:

Keyboard navigation works

Screen reader labels present

Color contrast sufficient

Focus indicators visible

Performance:

No JavaScript errors in console

Page loads quickly

Smooth animations

Browser Testing
Test in at least:

Chrome/Edge (latest)

Firefox (latest)

Safari (if available)

Code Quality
HTML Guidelines
Use semantic elements (<header>, <nav>, <main>, <section>)

Add ARIA attributes for accessibility

Include alt text for images

Use aria-label for icon buttons

CSS Guidelines
Use BEM-like naming: .widget, .widget-header, .widget--collapsed

Organize styles: Layout → Typography → Components → Utilities

Use mobile-first responsive design

Keep specificity low (avoid !important)

JavaScript Guidelines
Use const for variables that don't change

Use let for variables that change

Avoid var

Use template literals for strings with variables

Add JSDoc comments for functions

Deployment
Manual Deployment
bash
# Run the deployment script
node scripts/deploy.js

# Or use the simplified script
./deploy.sh
Automatic Deployment
GitHub Actions automatically deploys when you push to main:

Push your changes: git push origin main

Check the Actions tab for progress

Visit: https://yourusername.github.io/zeno

Testing Deployment Locally
Before deploying, test the built version:

bash
# Create a local test server for the build
cd _deploy  # or dist folder
python3 -m http.server 8080
# Visit http://localhost:8080
Troubleshooting
Common Issues
Widgets not loading:

Check JavaScript console for errors

Verify widget initialization is called

Check if data exists in localStorage

Styles not applying:

Verify CSS file is linked correctly

Check for CSS specificity issues

Ensure design system is loaded first

GitHub Pages not updating:

Check GitHub Actions for failures

Verify gh-pages branch exists

Check repo Settings > Pages configuration

LocalStorage not working:

Check if browser allows localStorage

Try incognito mode (no extensions)

Check for quota exceeded errors

Debugging Tips
Use browser DevTools:

Elements tab: Inspect HTML/CSS

Console tab: JavaScript errors

Network tab: File loading issues

Application tab: localStorage data

Add console logs:

javascript
console.log('Function called with:', data);
console.group('Widget Initialization');
console.log('State:', ZenoState);
console.groupEnd();
Use debugger statements:

javascript
function problematicFunction() {
  debugger; // Execution pauses here
  // Rest of function
}
Getting Help
Check documentation: Review this guide and README.md

Search issues: Look for similar problems in GitHub Issues

Ask for help: Create a new issue with:

What you're trying to do

What you expected to happen

What actually happened

Screenshots or error messages

Next Steps
After mastering the Home Dashboard, consider:

Build Zeno Mail: Email client with inbox, compose, and contacts

Build Zeno Calendar: Event scheduling with reminders

Build Zeno Cloud: File storage with upload/download

Add user authentication: Login system with profiles

Create mobile apps: Using Capacitor or similar tools

Happy coding! Remember to commit often and write descriptive commit messages. 🚀