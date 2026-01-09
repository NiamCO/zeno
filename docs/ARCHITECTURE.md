# Zeno Architecture

This document describes the technical architecture, design decisions, and system overview of the Zeno ecosystem.

## System Overview

Zeno is a **client-only web application** built with vanilla HTML, CSS, and JavaScript. It follows a **modular, component-based architecture** with a unified design system.

### Core Principles

1. **No Build Process**: Pure browser technologies, no compilation needed
2. **Progressive Enhancement**: Basic functionality works everywhere, enhanced where possible
3. **Privacy First**: Data stays in the browser by default
4. **Modular Design**: Apps can be developed independently
5. **Unified Experience**: Consistent design and behavior across all apps

## High-Level Architecture
┌─────────────────────────────────────────────────────┐
│ User Browser │
├─────────────────────────────────────────────────────┤
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│ │ Zeno │ │ Zeno │ │ Zeno │ │
│ │ Home │ │ Mail │ │ Calendar │ │
│ │ (Dashboard)│ │ │ │ │ │
│ └─────────────┘ └─────────────┘ └─────────────┘ │
│ │ │ │ │
│ ┌──────────────────────────────────────────────┐ │
│ │ Zeno Design System │ │
│ │ (theme.css, components, utilities) │ │
│ └──────────────────────────────────────────────┘ │
│ │ │ │ │
│ ┌──────────────────────────────────────────────┐ │
│ │ Zeno Core Services │ │
│ │ (storage.js, search.js, auth.js) │ │
│ └──────────────────────────────────────────────┘ │
│ │ │
│ ┌──────────────────────────────────────────────┐ │
│ │ Browser APIs │ │
│ │ • localStorage/IndexedDB │ │
│ │ • Service Workers (future) │ │
│ │ • Web APIs (Fetch, etc.) │ │
│ └──────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────┘

text

## Component Architecture

### 1. Design System Layer

**Location**: `packages/design-system/`

```css
/* theme.css - Central source of truth for design tokens */
:root {
  --zeno-primary: #0D1B2A;
  --zeno-accent: #FF9E00;
  /* ... all design tokens */
}
Purpose:

Provides consistent colors, spacing, typography

Enables theme switching (light/dark/high-contrast)

Centralizes design decisions

Usage:

html
<link rel="stylesheet" href="../../packages/design-system/theme.css">
2. Application Layer
Location: apps/[app-name]/

text
apps/home/
├── index.html      # HTML structure
├── styles.css      # App-specific styles
├── app.js          # App logic and state
└── widgets/        # Widget components (optional)
Key Patterns:

Each app is self-contained

Shared dependencies via design system

Communication through events and localStorage

3. Core Services Layer
Planned Location: packages/core/

javascript
// Future core services
packages/core/
├── storage.js      # Unified data storage
├── search.js       # Cross-app search
├── auth.js         # Authentication
├── sync.js         # Cloud sync
└── api.js          # External API communication
Current Implementation: Core services are embedded in apps/home/app.js but will be extracted as the project grows.

Data Flow
Client-Side Data Management
text
┌─────────┐    ┌─────────────┐    ┌──────────────┐
│  User   │───▶│   UI Event  │───▶│   Handler    │
│  Action │    │  (click,    │    │  (function)  │
└─────────┘    │   input)    │    └──────┬───────┘
               └─────────────┘           │
                                         ▼
                               ┌──────────────────┐
                               │  State Update    │
                               │  (ZenoState)     │
                               └─────────┬────────┘
                                         │
               ┌─────────────┐           ▼           ┌─────────────┐
               │   UI Update │◀──────────┼──────────▶│  Persist    │
               │  (re-render)│           │           │  (Storage)  │
               └─────────────┘           │           └─────────────┘
                                         ▼
                               ┌──────────────────┐
                               │  Side Effects    │
                               │  (toast, API)    │
                               └──────────────────┘
State Management Pattern
javascript
// apps/home/app.js - Current implementation
const ZenoState = {
  currentTheme: localStorage.getItem('zeno-theme') || 'light',
  sidebarCollapsed: localStorage.getItem('zeno-sidebar-collapsed') === 'true',
  widgetLayout: JSON.parse(localStorage.getItem('zeno-widget-layout') || 'null'),
  notifications: [],
  user: { name: 'User', avatarInitials: 'U' }
};

// State updates follow this pattern:
function updateTheme(newTheme) {
  // 1. Update state
  ZenoState.currentTheme = newTheme;
  
  // 2. Persist to storage
  localStorage.setItem('zeno-theme', newTheme);
  
  // 3. Update UI
  document.body.setAttribute('data-theme', newTheme);
  
  // 4. Trigger side effects
  showToast(`Theme changed to ${newTheme}`, 'success');
}
Data Storage Strategy
Data Type	Storage Method	Purpose
User Preferences	localStorage	Fast, synchronous access
Notes, Emails, Events	IndexedDB (future)	Larger datasets, async
Files	IndexedDB + GitHub Backup (future)	Binary data storage
Cache	localStorage	API responses, widget data
Communication Patterns
1. Inter-App Communication (Future)
javascript
// Using Custom Events
window.addEventListener('zeno:mail-received', (event) => {
  updateNotificationBadge('mail', event.detail.count);
});

// Dispatching events from Mail app
const event = new CustomEvent('zeno:mail-received', {
  detail: { count: 5 }
});
window.dispatchEvent(event);
2. Widget Communication
javascript
// Widgets communicate through the parent dashboard
class WidgetManager {
  constructor() {
    this.widgets = new Map();
  }
  
  registerWidget(name, widget) {
    this.widgets.set(name, widget);
  }
  
  broadcast(event, data) {
    this.widgets.forEach(widget => {
      if (widget.onBroadcast) {
        widget.onBroadcast(event, data);
      }
    });
  }
}
3. Parent-Child Component Communication
javascript
// Widget pattern
class BaseWidget {
  constructor(element) {
    this.element = element;
    this.id = element.dataset.widget;
    this.init();
  }
  
  init() {
    // Setup event listeners
    // Load data
    // Render initial state
  }
  
  update(data) {
    // Update widget with new data
  }
  
  destroy() {
    // Cleanup event listeners
  }
}
Performance Considerations
1. Bundle Size
Current: Zero bundle - all files loaded separately

Future: Could implement simple concatenation for production

2. Loading Strategy
html
<!-- Critical CSS in head -->
<link rel="stylesheet" href="design-system/theme.css">

<!-- Deferred JavaScript -->
<script src="app.js" defer></script>

<!-- Lazy-loaded components -->
<template id="complex-widget">
  <!-- Heavy markup -->
</template>
3. Caching Strategy
Design system: Long cache (never changes)

App logic: Medium cache (versioned)

User data: No cache, real-time

4. Memory Management
Clean up event listeners on widget removal

Limit localStorage usage (5MB max)

Implement virtual scrolling for large lists

Security Architecture
1. Client-Side Security
No sensitive data in client-side code

Input validation for all user data

XSS prevention via textContent (not innerHTML)

CSRF tokens for future API calls

2. Data Protection
LocalStorage encryption for sensitive data (future)

Data sanitization before storage

Regular backups to user-controlled locations

3. Privacy Features
No tracking by default

Clear data controls in settings

Export/delete all data functionality

Deployment Architecture
1. GitHub Pages Deployment
text
Developer ───push───▶ GitHub ──Actions──▶ Build ──deploy──▶ GitHub Pages
                    (main branch)       (Node.js)         (gh-pages branch)
2. File Structure for Deployment
text
gh-pages branch/
├── index.html          # Home dashboard
├── 404.html           # Error page
├── .nojekyll          # Disable Jekyll processing
├── packages/          # Design system
│   └── design-system/
│       └── theme.css
├── styles.css         # Home app styles
├── app.js            # Home app logic
└── [other-apps]/     # Future apps
3. CDN Strategy
Static assets: Served from GitHub Pages (fast, global)

Dynamic data: Client-side storage only (no server)

Third-party libs: CDN with SRI (Subresource Integrity)

Scalability Considerations
1. Current Limitations
5MB localStorage limit per domain

No real-time collaboration

No offline sync across devices

Limited by browser memory

2. Future Scaling Paths
Phase 1: Enhanced Client

javascript
// Add IndexedDB for larger storage
const db = await openDB('ZenoDB', 1, {
  upgrade(db) {
    db.createObjectStore('emails');
    db.createObjectStore('events');
    db.createObjectStore('files');
  }
});
Phase 2: Optional Backend Sync

javascript
// Optional GitHub backend
async function syncToGitHub() {
  const data = exportAllData();
  const token = await getGitHubToken();
  await github.save('data/backup.json', data, token);
}
Phase 3: Full Backend (Optional)

Self-hosted sync server

Real-time collaboration

Cross-device sync

Advanced features

Monitoring and Debugging
1. Built-in Debug Tools
javascript
// Access debug mode
window.ZenoDebug = {
  state: ZenoState,
  showToast,
  toggleSidebar,
  applyTheme
};

// Console commands
console.log('Zeno State:', ZenoState);
console.log('Storage usage:', getStorageUsage());
2. Error Tracking
javascript
// Global error handler
window.addEventListener('error', (event) => {
  console.error('Zeno Error:', event.error);
  showToast('An error occurred', 'error');
  
  // Log to localStorage for debugging
  const errors = JSON.parse(localStorage.getItem('zeno-errors') || '[]');
  errors.push({
    message: event.error.message,
    timestamp: new Date().toISOString(),
    stack: event.error.stack
  });
  localStorage.setItem('zeno-errors', JSON.stringify(errors.slice(-10)));
});
3. Performance Monitoring
javascript
// Measure widget load times
const startTime = performance.now();
initializeWidget();
const loadTime = performance.now() - startTime;

if (loadTime > 100) {
  console.warn(`Widget load slow: ${loadTime}ms`);
}
Technology Decisions
Why Vanilla JavaScript?
No build toolchain needed

Immediate browser compatibility

Simpler debugging with source maps

Lower barrier to entry for contributors

Why No Framework?
Bundle size: Zero framework overhead

Learning curve: HTML/CSS/JS are universal

Control: Direct DOM manipulation when needed

Longevity: No framework deprecation risk

Why GitHub Pages?
Free hosting with SSL

Simple deployment via git

Global CDN for fast delivery

Integrated with GitHub workflow

Future Architecture Plans
Phase 2: Micro-App Architecture
text
apps/
├── home/           # Dashboard (orchestrator)
├── mail/           # Standalone mail app
├── calendar/       # Standalone calendar
└── shared/         # Shared utilities
Phase 3: Plugin System
javascript
// Third-party widget support
Zeno.registerWidget('weather', {
  name: 'Weather Widget',
  version: '1.0.0',
  init: function() { /* setup */ },
  render: function() { /* return HTML */ }
});
Phase 4: Service Worker
javascript
// Offline functionality
const CACHE_NAME = 'zeno-v1';
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        '/packages/design-system/theme.css',
        '/styles.css',
        '/app.js'
      ]);
    })
  );
});
Key Takeaways
Simplicity First: Start with basic, then enhance

Progressive Enhancement: Core functions work everywhere

Modular Design: Independent, testable components

Privacy by Default: User data stays local

Zero Infrastructure: No servers to maintain (initially)

This architecture allows Zeno to start simple while providing clear paths for future growth and scalability.