# Zeno API Documentation

This document covers the public APIs, methods, and patterns used throughout the Zeno ecosystem.

## Table of Contents

- [Global State](#global-state)
- [Core Functions](#core-functions)
- [Widget API](#widget-api)
- [Storage API](#storage-api)
- [Theme API](#theme-api)
- [Event System](#event-system)
- [Utility Functions](#utility-functions)
- [Development API](#development-api)

## Global State

### `ZenoState`
The central state object that tracks the application's current state.

**Location**: `apps/home/app.js`

```javascript
const ZenoState = {
  // Current theme: 'light', 'dark', or 'auto'
  currentTheme: 'light',
  
  // Sidebar collapsed state
  sidebarCollapsed: false,
  
  // Widget layout configuration
  widgetLayout: {
    mail: { order: 1, visible: true },
    calendar: { order: 2, visible: true },
    // ... other widgets
  },
  
  // User notifications
  notifications: [],
  
  // Current user information
  user: {
    name: 'User',
    email: 'user@zeno.com',
    avatarInitials: 'U'
  },
  
  // Application-specific state
  apps: {
    mail: { unreadCount: 3 },
    calendar: { upcomingEvents: [] },
    // ... other app states
  }
};
Accessing State:

javascript
// Read state
const theme = ZenoState.currentTheme;
const userName = ZenoState.user.name;

// Update state (use helper functions when available)
ZenoState.currentTheme = 'dark';
Core Functions
initializeApp()
Initializes the entire Zeno application.

Parameters: None

Returns: void

Usage:

javascript
// Automatically called on DOMContentLoaded
// Can be called manually if needed
initializeApp();
Effects:

Loads saved theme preference

Sets up sidebar state

Initializes all widgets

Sets up event listeners

Loads mock data

setupEventListeners()
Sets up all global event listeners.

Parameters: None

Returns: void

Events Handled:

Sidebar toggle

Theme switching

Global search

Notifications

Keyboard shortcuts

setupKeyboardShortcuts()
Configures keyboard shortcuts for the application.

Shortcuts:

Ctrl/Cmd + K: Focus search bar

Ctrl/Cmd + /: Show help

Ctrl/Cmd + B: Toggle sidebar

Escape: Close panels/modals

Widget API
Widget Lifecycle
Each widget follows this lifecycle:

Initialization: initialize[Name]Widget()

Data Loading: load[Name]Data()

Event Handling: Set up listeners

Cleanup: Remove listeners on removal

Base Widget Pattern
javascript
function initializeWidgetName() {
  const widget = document.querySelector('.widget-widgetname');
  
  // Setup
  widget.dataset.initialized = 'true';
  
  // Load data
  loadWidgetData();
  
  // Event listeners
  widget.querySelector('.refresh-btn').addEventListener('click', refreshData);
  
  // Register with widget manager
  ZenoState.widgets.widgetname = {
    refresh: refreshData,
    destroy: cleanupWidget
  };
}

function loadWidgetData() {
  // Load from localStorage or API
  const data = localStorage.getItem('zeno-widgetname-data');
  renderWidget(data);
}

function renderWidget(data) {
  // Update DOM with data
}

function cleanupWidget() {
  // Remove event listeners
  // Clear intervals/timeouts
}
Available Widgets
Mail Widget
Selector: .widget-mail

Methods: initializeMailWidget(), loadMailData()

Events: click on email items, refresh button

Calendar Widget
Selector: .widget-calendar

Methods: initializeCalendarWidget(), loadCalendarData()

Events: click on events, add event button

Notes Widget
Selector: .widget-notes

Methods: initializeNotesWidget(), saveNote()

Events: input on textarea, save button

Cloud Widget
Selector: .widget-cloud

Methods: initializeCloudWidget(), uploadFile()

Events: click on file items, upload button

Widget Management
javascript
// Refresh all widgets
function refreshAllWidgets() {
  Object.values(ZenoState.widgets).forEach(widget => {
    if (widget.refresh) widget.refresh();
  });
}

// Destroy widget
function destroyWidget(widgetName) {
  if (ZenoState.widgets[widgetName]?.destroy) {
    ZenoState.widgets[widgetName].destroy();
    delete ZenoState.widgets[widgetName];
  }
}
Storage API
LocalStorage Helpers
saveData(key, data)
Saves data to localStorage with error handling.

Parameters:

key (String): Storage key (will be prefixed with 'zeno-')

data (Any): Data to save (will be JSON.stringified)

Returns: Boolean - Success status

Usage:

javascript
const success = saveData('user-settings', { theme: 'dark' });
if (success) {
  showToast('Settings saved', 'success');
}
loadData(key, defaultValue)
Loads data from localStorage with error handling.

Parameters:

key (String): Storage key (will be prefixed with 'zeno-')

defaultValue (Any): Value to return if key doesn't exist

Returns: Any - Parsed data or defaultValue

Usage:

javascript
const settings = loadData('user-settings', { theme: 'light' });
applyTheme(settings.theme);
removeData(key)
Removes data from localStorage.

Parameters:

key (String): Storage key to remove

Returns: Boolean - Success status

Data Structure
javascript
// Example: Saving complex data
const widgetData = {
  mail: {
    emails: [...],
    lastUpdated: new Date().toISOString(),
    version: '1.0'
  }
};

saveData('widget-data', widgetData);
Storage Quota Management
javascript
function getStorageUsage() {
  let total = 0;
  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      total += localStorage[key].length * 2; // UTF-16
    }
  }
  return (total / 1024 / 1024).toFixed(2); // MB
}

function clearOldData() {
  // Implement data cleanup based on age or size
}
Theme API
applyTheme(theme)
Applies a theme to the application.

Parameters:

theme (String): 'light', 'dark', or 'auto'

Returns: void

Usage:

javascript
applyTheme('dark'); // Switch to dark theme
applyTheme('auto'); // Follow system preference
Effects:

Updates data-theme attribute on body

Saves preference to localStorage

Updates theme switcher UI

Triggers theme change event

toggleTheme()
Toggles between light and dark themes.

Parameters: None

Returns: void

Usage:

javascript
// Called by theme toggle button
toggleTheme();
Theme Detection
javascript
// Check system preference
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
  if (ZenoState.currentTheme === 'auto') {
    applyTheme('auto');
  }
});
Event System
Custom Events
Zeno uses Custom Events for component communication.

Event Types
javascript
// Theme events
const themeEvent = new CustomEvent('zeno:theme-change', {
  detail: { theme: 'dark', previous: 'light' }
});

// Widget events
const widgetEvent = new CustomEvent('zeno:widget-updated', {
  detail: { widget: 'mail', data: { unreadCount: 5 } }
});

// Notification events
const notificationEvent = new CustomEvent('zeno:notification', {
  detail: { 
    title: 'New Email', 
    message: 'You have a new message',
    type: 'info'
  }
});
Dispatching Events
javascript
// Dispatch from anywhere
window.dispatchEvent(themeEvent);

// Dispatch with specific target
document.querySelector('.widget-mail').dispatchEvent(widgetEvent);
Listening to Events
javascript
// Global event listener
window.addEventListener('zeno:theme-change', (event) => {
  console.log('Theme changed to:', event.detail.theme);
  updateThemeDependentComponents(event.detail.theme);
});

// Widget-specific listener
document.querySelector('.widget-mail').addEventListener('zeno:widget-updated', (event) => {
  if (event.detail.widget === 'mail') {
    updateMailBadge(event.detail.data.unreadCount);
  }
});
Event Helpers
javascript
function emitEvent(name, detail = {}) {
  const event = new CustomEvent(`zeno:${name}`, { detail });
  window.dispatchEvent(event);
}

function onEvent(name, handler) {
  window.addEventListener(`zeno:${name}`, handler);
  return () => window.removeEventListener(`zeno:${name}`, handler);
}

// Usage
const unsubscribe = onEvent('theme-change', (event) => {
  console.log('Theme changed:', event.detail);
});

// Later, to clean up
unsubscribe();
Utility Functions
debounce(func, wait)
Creates a debounced function that delays execution.

Parameters:

func (Function): Function to debounce

wait (Number): Wait time in milliseconds

Returns: Function - Debounced function

Usage:

javascript
const searchHandler = debounce((query) => {
  performSearch(query);
}, 300);

searchInput.addEventListener('input', (e) => {
  searchHandler(e.target.value);
});
formatDate(date)
Formats a date for display.

Parameters:

date (Date): Date object to format

Returns: String - Formatted date string

Usage:

javascript
const now = new Date();
console.log(formatDate(now)); // "Today"

const yesterday = new Date(Date.now() - 86400000);
console.log(formatDate(yesterday)); // "Yesterday"
showToast(message, type)
Displays a toast notification.

Parameters:

message (String): Message to display

type (String): 'info', 'success', 'warning', or 'error'

Returns: void

Usage:

javascript
showToast('Settings saved successfully', 'success');
showToast('Failed to save data', 'error');
getNotificationIcon(type)
Gets the appropriate icon name for a notification type.

Parameters:

type (String): Notification type

Returns: String - Lucide icon name

Usage:

javascript
const icon = getNotificationIcon('warning'); // Returns 'alert-triangle'
DOM Helpers
javascript
// Toggle element visibility
function toggleElement(element, show) {
  element.classList.toggle('hidden', !show);
}

// Create element with attributes
function createElement(tag, attributes = {}, children = []) {
  const element = document.createElement(tag);
  Object.entries(attributes).forEach(([key, value]) => {
    if (key === 'class') {
      element.className = value;
    } else if (key === 'text') {
      element.textContent = value;
    } else {
      element.setAttribute(key, value);
    }
  });
  
  children.forEach(child => {
    if (typeof child === 'string') {
      element.appendChild(document.createTextNode(child));
    } else {
      element.appendChild(child);
    }
  });
  
  return element;
}

// Usage
const button = createElement('button', {
  class: 'btn btn-primary',
  'aria-label': 'Submit',
  text: 'Submit'
});
Development API
Debug Mode
Access development tools through window.ZenoDebug:

javascript
// Available in browser console
ZenoDebug.state          // View current state
ZenoDebug.showToast()    // Show test toast
ZenoDebug.toggleSidebar() // Toggle sidebar
ZenoDebug.applyTheme()   // Change theme
Error Tracking
javascript
// Log errors to localStorage for debugging
function logError(error, context = {}) {
  const errors = loadData('errors', []);
  errors.push({
    message: error.message,
    stack: error.stack,
    context,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 50 errors
  saveData('errors', errors.slice(-50));
  
  console.error('Zeno Error:', error, context);
}

// Global error handler
window.addEventListener('error', (event) => {
  logError(event.error, { type: 'global' });
});

// Promise rejections
window.addEventListener('unhandledrejection', (event) => {
  logError(event.reason, { type: 'promise' });
});
Performance Monitoring
javascript
function measurePerformance(name, fn) {
  const start = performance.now();
  const result = fn();
  const duration = performance.now() - start;
  
  if (duration > 100) {
    console.warn(`Performance: ${name} took ${duration.toFixed(2)}ms`);
  }
  
  return result;
}

// Usage
const data = measurePerformance('loadUserData', () => {
  return loadData('user-data');
});
Plugin API (Future)
Widget Registration
javascript
// Future API for third-party widgets
Zeno.registerWidget('custom-widget', {
  name: 'Custom Widget',
  version: '1.0.0',
  
  init: function(element) {
    // Initialize widget
    this.element = element;
    this.loadData();
  },
  
  loadData: function() {
    // Load widget data
  },
  
  render: function() {
    // Return HTML string
    return `
      <div class="widget-custom">
        <h3>Custom Widget</h3>
        <p>Custom content here</p>
      </div>
    `;
  },
  
  destroy: function() {
    // Cleanup
  }
});
App Integration
javascript
// Future API for app communication
Zeno.registerApp('custom-app', {
  name: 'Custom App',
  
  // App lifecycle
  mount: function(container) {},
  unmount: function() {},
  
  // Cross-app communication
  onMessage: function(message) {},
  sendMessage: function(app, message) {}
});
Configuration API
App Configuration
javascript
const ZenoConfig = {
  // Storage configuration
  storage: {
    prefix: 'zeno-',
    quotaWarning: 4.5, // MB
    backupInterval: 3600000 // 1 hour
  },
  
  // API endpoints (future)
  api: {
    baseUrl: null,
    timeout: 30000
  },
  
  // Feature flags
  features: {
    offlineMode: true,
    syncEnabled: false,
    experimental: []
  },
  
  // UI configuration
  ui: {
    animations: true,
    reducedMotion: false,
    highContrast: false
  }
};
Updating Configuration
javascript
function updateConfig(newConfig) {
  Object.assign(ZenoConfig, newConfig);
  saveData('config', ZenoConfig);
  
  // Notify components of config change
  emitEvent('config-updated', { config: ZenoConfig });
}
Migration API (Future)
Version Management
javascript
const ZenoVersion = {
  current: '1.0.0',
  migrations: {
    '1.0.0': function() {
      // Migration logic for version 1.0.0
      console.log('Migrating to 1.0.0');
    },
    '1.1.0': function() {
      // Migration logic for version 1.1.0
    }
  }
};

function migrateData() {
  const savedVersion = localStorage.getItem('zeno-version') || '0.0.0';
  
  if (savedVersion !== ZenoVersion.current) {
    // Run migrations
    Object.entries(ZenoVersion.migrations).forEach(([version, migrate]) => {
      if (compareVersions(version, savedVersion) > 0) {
        migrate();
      }
    });
    
    localStorage.setItem('zeno-version', ZenoVersion.current);
  }
}
Error Codes
Common Error Codes
javascript
const ErrorCodes = {
  // Storage errors
  STORAGE_QUOTA_EXCEEDED: 'ZENO_001',
  STORAGE_NOT_AVAILABLE: 'ZENO_002',
  
  // Network errors (future)
  NETWORK_OFFLINE: 'ZENO_101',
  NETWORK_TIMEOUT: 'ZENO_102',
  
  // Widget errors
  WIDGET_INIT_FAILED: 'ZENO_201',
  WIDGET_DATA_INVALID: 'ZENO_202',
  
  // User errors
  USER_NOT_AUTHENTICATED: 'ZENO_301',
  USER_PERMISSION_DENIED: 'ZENO_302'
};

function handleError(code, details = {}) {
  console.error(`Error ${code}:`, details);
  
  switch(code) {
    case ErrorCodes.STORAGE_QUOTA_EXCEEDED:
      showToast('Storage limit reached. Please clear some data.', 'warning');
      break;
    // ... other error handling
  }
}
Type Definitions (JSDoc)
For better IDE support, use JSDoc comments:

javascript
/**
 * Applies a theme to the Zeno application
 * @param {string} theme - Theme to apply: 'light', 'dark', or 'auto'
 * @returns {void}
 * @throws {Error} If theme is invalid
 */
function applyTheme(theme) {
  if (!['light', 'dark', 'auto'].includes(theme)) {
    throw new Error(`Invalid theme: ${theme}`);
  }
  // ... implementation
}

/**
 * Widget configuration object
 * @typedef {Object} WidgetConfig
 * @property {string} name - Display name of the widget
 * @property {number} order - Display order in dashboard
 * @property {boolean} visible - Whether widget is visible
 */

/**
 * Application state object
 * @typedef {Object} AppState
 * @property {string} currentTheme - Current theme
 * @property {Object.<string, WidgetConfig>} widgetLayout - Widget configurations
 * @property {Array} notifications - User notifications
 */
Testing Utilities
Mock Data Generation
javascript
function generateMockData(type, count = 5) {
  const generators = {
    emails: () => ({
      id: Date.now() + Math.random(),
      from: `sender${Math.floor(Math.random() * 100)}@example.com`,
      subject: `Test Email ${Math.floor(Math.random() * 1000)}`,
      body: 'This is a test email body.',
      timestamp: new Date().toISOString(),
      read: Math.random() > 0.5
    }),
    
    events: () => ({
      id: Date.now() + Math.random(),
      title: `Meeting ${Math.floor(Math.random() * 100)}`,
      start: new Date(Date.now() + Math.random() * 86400000).toISOString(),
      end: new Date(Date.now() + Math.random() * 86400000 + 3600000).toISOString(),
      location: ['Room A', 'Room B', 'Zoom'][Math.floor(Math.random() * 3)]
    })
  };
  
  const generator = generators[type];
  if (!generator) return [];
  
  return Array.from({ length: count }, generator);
}
Browser Compatibility
Feature Detection
javascript
const BrowserFeatures = {
  localStorage: 'localStorage' in window,
  serviceWorker: 'serviceWorker' in navigator,
  indexedDB: 'indexedDB' in window,
  matchMedia: 'matchMedia' in window,
  cssVariables: CSS.supports('(--test: 0)')
};

function checkCompatibility() {
  const missing = Object.entries(BrowserFeatures)
    .filter(([feature, supported]) => !supported)
    .map(([feature]) => feature);
    
  if (missing.length > 0) {
    console.warn('Missing browser features:', missing);
    showToast('Some features may not work in your browser', 'warning');
  }
}
Appendix
Quick Reference
javascript
// Most commonly used APIs

// Theme
applyTheme('dark');
toggleTheme();

// Storage
saveData('key', value);
const data = loadData('key', defaultValue);

// UI
showToast('Message', 'success');
toggleElement(element, true);

// Widgets
refreshAllWidgets();

// Events
emitEvent('data-updated', { data: newData });
const unsubscribe = onEvent('theme-change', handler);

// Debugging
console.log('State:', ZenoDebug.state);
Common Patterns
javascript
// Pattern: Initialize on DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeComponent);
} else {
  initializeComponent();
}

// Pattern: Clean up event listeners
function createComponent() {
  const cleanupFns = [];
  
  const button = document.querySelector('.btn');
  const handler = () => console.log('clicked');
  button.addEventListener('click', handler);
  cleanupFns.push(() => button.removeEventListener('click', handler));
  
  // Return cleanup function
  return () => cleanupFns.forEach(fn => fn());
}

// Pattern: Debounced search
const search = debounce((query) => {
  if (query.length > 2) {
    performSearch(query);
  }
}, 300);
Last Updated: January 15, 2024
API Version: 1.0.0

Note: This API is evolving. Check for updates in the docs/ directory and follow semantic versioning for breaking changes.

