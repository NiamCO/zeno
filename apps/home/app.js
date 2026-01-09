// ZENO HOME DASHBOARD - APPLICATION LOGIC

// Global State
const ZenoState = {
    currentTheme: localStorage.getItem('zeno-theme') || 'light',
    sidebarCollapsed: localStorage.getItem('zeno-sidebar-collapsed') === 'true',
    widgetLayout: JSON.parse(localStorage.getItem('zeno-widget-layout') || 'null') || {
        mail: { order: 1, visible: true },
        calendar: { order: 2, visible: true },
        notes: { order: 3, visible: true },
        cloud: { order: 4, visible: true },
        activity: { order: 5, visible: true },
        weather: { order: 6, visible: true }
    },
    notifications: [],
    user: {
        name: 'User',
        email: 'user@zeno.com',
        avatarInitials: 'U'
    }
};

// DOM Elements
const DOM = {
    // Sidebar
    sidebar: document.getElementById('sidebar'),
    sidebarToggle: document.getElementById('sidebar-toggle'),
    
    // Theme
    themeLight: document.getElementById('theme-light'),
    themeDark: document.getElementById('theme-dark'),
    themeAuto: document.getElementById('theme-auto'),
    body: document.body,
    
    // Search
    globalSearch: document.getElementById('global-search'),
    
    // Header buttons
    notificationsBtn: document.getElementById('notifications-btn'),
    notificationsPanel: document.getElementById('notifications-panel'),
    closeNotifications: document.getElementById('close-notifications'),
    quickAddBtn: document.getElementById('quick-add-btn'),
    helpBtn: document.getElementById('help-btn'),
    
    // Welcome actions
    composeEmail: document.getElementById('compose-email'),
    createEvent: document.getElementById('create-event'),
    uploadFile: document.getElementById('upload-file'),
    
    // Widgets grid
    widgetsGrid: document.getElementById('widgets-grid'),
    
    // Notes widget
    quickNote: document.getElementById('quick-note'),
    
    // Other
    navLinks: document.querySelectorAll('.nav-link'),
    themeButtons: document.querySelectorAll('.theme-btn'),
    widgetActionBtns: document.querySelectorAll('.widget-action-btn'),
    widgetFooterBtns: document.querySelectorAll('.widget-footer-btn'),
    eventActions: document.querySelectorAll('.event-action'),
    fileActions: document.querySelectorAll('.file-action')
};

// Initialize the application
function initializeApp() {
    console.log('🚀 Zeno Home Dashboard Initializing...');
    
    // Set initial theme
    applyTheme(ZenoState.currentTheme);
    
    // Set sidebar state
    if (ZenoState.sidebarCollapsed) {
        DOM.sidebar.classList.add('collapsed');
    }
    
    // Load mock data
    loadMockData();
    
    // Initialize widgets
    initializeWidgets();
    
    // Set up event listeners
    setupEventListeners();
    
    // Set up keyboard shortcuts
    setupKeyboardShortcuts();
    
    // Update UI based on state
    updateUI();
    
    console.log('✅ Zeno Home Dashboard Ready');
}

// Theme Management
function applyTheme(theme) {
    if (theme === 'auto') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        DOM.body.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    } else {
        DOM.body.setAttribute('data-theme', theme);
    }
    
    // Update active theme button
    DOM.themeButtons.forEach(btn => {
        const themeType = btn.id.replace('theme-', '');
        if (themeType === theme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    ZenoState.currentTheme = theme;
    localStorage.setItem('zeno-theme', theme);
}

// Sidebar Management
function toggleSidebar() {
    ZenoState.sidebarCollapsed = !ZenoState.sidebarCollapsed;
    
    if (ZenoState.sidebarCollapsed) {
        DOM.sidebar.classList.add('collapsed');
    } else {
        DOM.sidebar.classList.remove('collapsed');
    }
    
    localStorage.setItem('zeno-sidebar-collapsed', ZenoState.sidebarCollapsed);
    
    // Dispatch custom event for other components
    const event = new CustomEvent('sidebarToggle', {
        detail: { collapsed: ZenoState.sidebarCollapsed }
    });
    window.dispatchEvent(event);
}

// Search Functionality
function initializeSearch() {
    DOM.globalSearch.addEventListener('input', debounce(function(e) {
        const query = e.target.value.trim();
        if (query.length > 0) {
            performSearch(query);
        }
    }, 300));
    
    DOM.globalSearch.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.value.trim()) {
            e.preventDefault();
            performSearch(e.target.value.trim());
        }
    });
}

function performSearch(query) {
    console.log(`Searching for: ${query}`);
    // In a real app, this would search across all applications
    // For now, we'll just show a notification
    showToast(`Searching for "${query}" across Zeno...`, 'info');
    
    // Clear search after a delay
    setTimeout(() => {
        DOM.globalSearch.value = '';
    }, 1500);
}

// Widget Management
function initializeWidgets() {
    // Set up widget drag and drop
    if (typeof Sortable !== 'undefined') {
        new Sortable(DOM.widgetsGrid, {
            animation: 150,
            ghostClass: 'widget-ghost',
            chosenClass: 'widget-chosen',
            dragClass: 'widget-drag',
            onEnd: function(evt) {
                saveWidgetLayout();
            }
        });
    }
    
    // Initialize each widget type
    initializeMailWidget();
    initializeCalendarWidget();
    initializeNotesWidget();
    initializeCloudWidget();
    initializeActivityWidget();
    initializeWeatherWidget();
}

function initializeMailWidget() {
    const mailWidget = document.querySelector('.widget-mail');
    const refreshBtn = mailWidget.querySelector('.widget-action-btn[aria-label="Refresh"]');
    const emailItems = mailWidget.querySelectorAll('.email-item');
    
    refreshBtn.addEventListener('click', function() {
        this.classList.add('loading');
        showToast('Refreshing mail...', 'info');
        
        setTimeout(() => {
            this.classList.remove('loading');
            showToast('Mail refreshed', 'success');
        }, 1000);
    });
    
    emailItems.forEach(item => {
        item.addEventListener('click', function() {
            const sender = this.querySelector('.sender-name').textContent;
            const subject = this.querySelector('.email-subject').textContent;
            
            if (this.classList.contains('unread')) {
                this.classList.remove('unread');
                updateUnreadCount('mail', -1);
            }
            
            showToast(`Opening: ${subject}`, 'info');
        });
    });
}

function initializeCalendarWidget() {
    const calendarWidget = document.querySelector('.widget-calendar');
    const addEventBtn = calendarWidget.querySelector('.widget-action-btn[aria-label="Add event"]');
    const eventItems = calendarWidget.querySelectorAll('.event-item');
    
    addEventBtn.addEventListener('click', function() {
        showQuickAddModal('event');
    });
    
    eventItems.forEach(item => {
        const joinBtn = item.querySelector('.event-action');
        const eventTitle = item.querySelector('.event-title').textContent;
        
        joinBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showToast(`Joining: ${eventTitle}`, 'info');
        });
        
        item.addEventListener('click', function() {
            showToast(`Viewing: ${eventTitle}`, 'info');
        });
    });
}

function initializeNotesWidget() {
    const notesWidget = document.querySelector('.widget-notes');
    const saveBtn = notesWidget.querySelector('.widget-action-btn[aria-label="Save note"]');
    const noteInput = notesWidget.querySelector('.note-input');
    
    // Load saved note
    const savedNote = localStorage.getItem('zeno-quick-note');
    if (savedNote) {
        noteInput.value = savedNote;
    }
    
    // Auto-save note
    noteInput.addEventListener('input', debounce(function() {
        localStorage.setItem('zeno-quick-note', this.value);
        showToast('Note autosaved', 'success');
    }, 1000));
    
    saveBtn.addEventListener('click', function() {
        if (noteInput.value.trim()) {
            saveNoteToStorage(noteInput.value);
            showToast('Note saved successfully', 'success');
        } else {
            showToast('Note is empty', 'warning');
        }
    });
    
    // Recent notes click
    const recentNotes = notesWidget.querySelectorAll('.note-item');
    recentNotes.forEach(note => {
        note.addEventListener('click', function() {
            const title = this.querySelector('.note-title').textContent;
            showToast(`Opening note: ${title}`, 'info');
        });
    });
}

function saveNoteToStorage(content) {
    const notes = JSON.parse(localStorage.getItem('zeno-notes') || '[]');
    const newNote = {
        id: Date.now(),
        title: content.substring(0, 30) + (content.length > 30 ? '...' : ''),
        content: content,
        created: new Date().toISOString(),
        updated: new Date().toISOString()
    };
    
    notes.unshift(newNote);
    localStorage.setItem('zeno-notes', JSON.stringify(notes.slice(0, 10))); // Keep only 10 latest
    
    updateRecentNotesList();
}

function updateRecentNotesList() {
    const notes = JSON.parse(localStorage.getItem('zeno-notes') || '[]');
    const recentNotesContainer = document.querySelector('.recent-notes');
    
    if (notes.length > 0) {
        const notesList = notes.map(note => `
            <div class="note-item">
                <span class="note-title">${note.title}</span>
                <span class="note-date">${formatDate(new Date(note.created))}</span>
            </div>
        `).join('');
        
        recentNotesContainer.innerHTML = `
            <h4>Recent Notes</h4>
            ${notesList}
        `;
    }
}

function initializeCloudWidget() {
    const cloudWidget = document.querySelector('.widget-cloud');
    const uploadBtn = cloudWidget.querySelector('.widget-action-btn[aria-label="Upload file"]');
    const fileItems = cloudWidget.querySelectorAll('.file-item');
    
    uploadBtn.addEventListener('click', function() {
        showQuickAddModal('file');
    });
    
    fileItems.forEach(item => {
        const moreBtn = item.querySelector('.file-action');
        const fileName = item.querySelector('.file-name').textContent;
        
        moreBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            showFileContextMenu(fileName, this);
        });
        
        item.addEventListener('click', function() {
            showToast(`Opening: ${fileName}`, 'info');
        });
    });
}

function initializeActivityWidget() {
    const activityWidget = document.querySelector('.widget-activity');
    const markReadBtn = activityWidget.querySelector('.widget-action-btn[aria-label="Mark all as read"]');
    
    markReadBtn.addEventListener('click', function() {
        const activityItems = activityWidget.querySelectorAll('.activity-item');
        activityItems.forEach(item => {
            item.style.opacity = '0.6';
        });
        
        showToast('All activities marked as read', 'success');
        
        // Update notification badge
        updateNotificationBadge(0);
    });
}

function initializeWeatherWidget() {
    // This would fetch real weather data in a production app
    const weatherWidget = document.querySelector('.widget-weather');
    const refreshBtn = weatherWidget.querySelector('.widget-action-btn');
    
    if (refreshBtn) {
        refreshBtn.addEventListener('click', function() {
            this.classList.add('loading');
            showToast('Refreshing weather...', 'info');
            
            setTimeout(() => {
                this.classList.remove('loading');
                showToast('Weather updated', 'success');
            }, 1500);
        });
    }
}

function saveWidgetLayout() {
    const widgets = Array.from(document.querySelectorAll('.widget'));
    const layout = {};
    
    widgets.forEach((widget, index) => {
        const widgetType = widget.getAttribute('data-widget');
        layout[widgetType] = {
            order: index + 1,
            visible: true
        };
    });
    
    ZenoState.widgetLayout = layout;
    localStorage.setItem('zeno-widget-layout', JSON.stringify(layout));
}

// Notifications Management
function initializeNotifications() {
    // Mock notifications for demo
    ZenoState.notifications = [
        {
            id: 1,
            title: 'Welcome to Zeno!',
            message: 'Your dashboard is now ready to use.',
            time: '10:30 AM',
            read: false,
            type: 'info'
        },
        {
            id: 2,
            title: 'Meeting Reminder',
            message: 'Team Planning starts in 30 minutes',
            time: '1:30 PM',
            read: false,
            type: 'calendar'
        },
        {
            id: 3,
            title: 'Storage Warning',
            message: 'Cloud storage is 87% full',
            time: 'Yesterday',
            read: true,
            type: 'warning'
        }
    ];
    
    updateNotificationBadge(ZenoState.notifications.filter(n => !n.read).length);
}

function toggleNotificationsPanel() {
    DOM.notificationsPanel.classList.toggle('open');
    
    if (DOM.notificationsPanel.classList.contains('open')) {
        renderNotifications();
        markNotificationsAsRead();
    }
}

function renderNotifications() {
    const container = DOM.notificationsPanel.querySelector('.notifications-list');
    
    if (ZenoState.notifications.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon" data-lucide="bell-off"></div>
                <div class="empty-state-title">No notifications</div>
                <div class="empty-state-description">You're all caught up!</div>
            </div>
        `;
        return;
    }
    
    const notificationsHTML = ZenoState.notifications.map(notification => `
        <div class="activity-item ${notification.read ? 'read' : 'unread'}">
            <div class="activity-icon">
                <span data-lucide="${getNotificationIcon(notification.type)}"></span>
            </div>
            <div class="activity-content">
                <p><strong>${notification.title}</strong><br>${notification.message}</p>
                <span class="activity-time">${notification.time}</span>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = notificationsHTML;
    
    // Re-initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function markNotificationsAsRead() {
    ZenoState.notifications.forEach(notification => {
        notification.read = true;
    });
    
    updateNotificationBadge(0);
}

function updateNotificationBadge(count) {
    const badge = DOM.notificationsBtn.querySelector('.notification-badge');
    if (count > 0) {
        badge.textContent = count;
        badge.style.display = 'flex';
    } else {
        badge.style.display = 'none';
    }
}

function getNotificationIcon(type) {
    const icons = {
        info: 'info',
        calendar: 'calendar',
        warning: 'alert-triangle',
        mail: 'mail',
        success: 'check-circle',
        error: 'alert-circle'
    };
    
    return icons[type] || 'bell';
}

// Quick Actions
function setupQuickActions() {
    DOM.composeEmail.addEventListener('click', () => showQuickAddModal('email'));
    DOM.createEvent.addEventListener('click', () => showQuickAddModal('event'));
    DOM.uploadFile.addEventListener('click', () => showQuickAddModal('file'));
    DOM.quickAddBtn.addEventListener('click', () => showQuickAddModal('menu'));
}

function showQuickAddModal(type) {
    const actions = {
        email: () => {
            showToast('Opening email composer...', 'info');
            // In a real app, this would open the mail app
        },
        event: () => {
            showToast('Creating new event...', 'info');
            // In a real app, this would open the calendar app
        },
        file: () => {
            // Simulate file upload
            const input = document.createElement('input');
            input.type = 'file';
            input.multiple = false;
            input.accept = '*/*';
            
            input.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    showToast(`Uploading: ${file.name}`, 'info');
                    
                    // Simulate upload
                    setTimeout(() => {
                        showToast(`${file.name} uploaded successfully`, 'success');
                    }, 1500);
                }
            };
            
            input.click();
        },
        menu: () => {
            // Show a menu of options
            showToast('Quick add menu opened', 'info');
        }
    };
    
    if (actions[type]) {
        actions[type]();
    }
}

// File Context Menu
function showFileContextMenu(fileName, button) {
    const menu = document.createElement('div');
    menu.className = 'context-menu';
    menu.style.cssText = `
        position: absolute;
        background: var(--zeno-surface);
        border-radius: var(--zeno-radius-md);
        box-shadow: var(--zeno-shadow-xl);
        padding: var(--zeno-space-2);
        min-width: 160px;
        z-index: 10000;
    `;
    
    menu.innerHTML = `
        <button class="context-menu-item" data-action="download">
            <span data-lucide="download"></span>
            Download
        </button>
        <button class="context-menu-item" data-action="share">
            <span data-lucide="share-2"></span>
            Share
        </button>
        <button class="context-menu-item" data-action="rename">
            <span data-lucide="edit-2"></span>
            Rename
        </button>
        <hr style="margin: var(--zeno-space-1) 0; border-color: rgba(0,0,0,0.1)">
        <button class="context-menu-item text-danger" data-action="delete">
            <span data-lucide="trash-2"></span>
            Delete
        </button>
    `;
    
    const rect = button.getBoundingClientRect();
    menu.style.top = `${rect.bottom + 5}px`;
    menu.style.left = `${rect.left}px`;
    
    document.body.appendChild(menu);
    
    // Position adjustment if menu goes off screen
    const menuRect = menu.getBoundingClientRect();
    if (menuRect.right > window.innerWidth) {
        menu.style.left = `${rect.right - menuRect.width}px`;
    }
    
    // Add event listeners to menu items
    menu.querySelectorAll('.context-menu-item').forEach(item => {
        item.addEventListener('click', function() {
            const action = this.getAttribute('data-action');
            handleFileAction(fileName, action);
            document.body.removeChild(menu);
        });
    });
    
    // Close menu when clicking elsewhere
    const closeMenu = (e) => {
        if (!menu.contains(e.target) && e.target !== button) {
            document.body.removeChild(menu);
            document.removeEventListener('click', closeMenu);
        }
    };
    
    setTimeout(() => {
        document.addEventListener('click', closeMenu);
    }, 0);
    
    // Re-initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

function handleFileAction(fileName, action) {
    const actions = {
        download: () => showToast(`Downloading: ${fileName}`, 'info'),
        share: () => showToast(`Sharing: ${fileName}`, 'info'),
        rename: () => {
            const newName = prompt('Enter new name for file:', fileName);
            if (newName && newName !== fileName) {
                showToast(`Renamed to: ${newName}`, 'success');
            }
        },
        delete: () => {
            if (confirm(`Are you sure you want to delete "${fileName}"?`)) {
                showToast(`Deleted: ${fileName}`, 'success');
            }
        }
    };
    
    if (actions[action]) {
        actions[action]();
    }
}

// Navigation
function setupNavigation() {
    DOM.navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const app = this.getAttribute('data-app');
            
            if (app === 'home') {
                // Already on home
                return;
            }
            
            // Update active nav item
            DOM.navLinks.forEach(l => l.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');
            
            // Show loading state
            showToast(`Opening ${app.charAt(0).toUpperCase() + app.slice(1)}...`, 'info');
            
            // In a real app, this would load the actual app
            // For now, we'll just simulate navigation
            setTimeout(() => {
                showToast(`${app.charAt(0).toUpperCase() + app.slice(1)} app is not implemented yet`, 'warning');
            }, 500);
        });
    });
}

// Toast Notifications
function showToast(message, type = 'info') {
    // Remove existing toast
    const existingToast = document.querySelector('.zeno-toast');
    if (existingToast) {
        existingToast.remove();
    }
    
    // Create toast
    const toast = document.createElement('div');
    toast.className = `zeno-toast zeno-toast-${type}`;
    toast.style.cssText = `
        position: fixed;
        bottom: 24px;
        right: 24px;
        background: var(--zeno-surface);
        color: var(--zeno-text-primary);
        padding: var(--zeno-space-4) var(--zeno-space-6);
        border-radius: var(--zeno-radius-lg);
        box-shadow: var(--zeno-shadow-xl);
        display: flex;
        align-items: center;
        gap: var(--zeno-space-3);
        z-index: var(--zeno-z-toast);
        animation: slideIn 0.3s ease;
        max-width: 400px;
        border-left: 4px solid var(--zeno-${type});
    `;
    
    const icons = {
        info: 'info',
        success: 'check-circle',
        warning: 'alert-triangle',
        error: 'alert-circle'
    };
    
    toast.innerHTML = `
        <span data-lucide="${icons[type] || 'info'}"></span>
        <span>${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    // Re-initialize Lucide icon
    if (window.lucide) {
        window.lucide.createIcons();
    }
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.remove();
            }
        }, 300);
    }, 3000);
    
    // Add styles for animation
    if (!document.querySelector('#toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOut {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Event Listeners
function setupEventListeners() {
    // Sidebar toggle
    DOM.sidebarToggle.addEventListener('click', toggleSidebar);
    
    // Theme switcher
    DOM.themeLight.addEventListener('click', () => applyTheme('light'));
    DOM.themeDark.addEventListener('click', () => applyTheme('dark'));
    DOM.themeAuto.addEventListener('click', () => applyTheme('auto'));
    
    // Search
    initializeSearch();
    
    // Notifications
    DOM.notificationsBtn.addEventListener('click', toggleNotificationsPanel);
    DOM.closeNotifications.addEventListener('click', () => {
        DOM.notificationsPanel.classList.remove('open');
    });
    
    // Quick actions
    setupQuickActions();
    
    // Navigation
    setupNavigation();
    
    // Help button
    DOM.helpBtn.addEventListener('click', () => {
        showToast('Opening help documentation...', 'info');
    });
    
    // System theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (ZenoState.currentTheme === 'auto') {
            applyTheme('auto');
        }
    });
    
    // Resize handling
    window.addEventListener('resize', debounce(handleResize, 250));
    
    // Before unload - save state
    window.addEventListener('beforeunload', () => {
        localStorage.setItem('zeno-state-last-saved', new Date().toISOString());
    });
}

// Keyboard Shortcuts
function setupKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K for search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            DOM.globalSearch.focus();
        }
        
        // Ctrl/Cmd + / for help
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            showToast('Keyboard shortcuts: ⌘K = Search, ⌘/ = Help, ⌘B = Toggle sidebar', 'info');
        }
        
        // Ctrl/Cmd + B for sidebar toggle
        if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
            e.preventDefault();
            toggleSidebar();
        }
        
        // Escape key closes panels
        if (e.key === 'Escape') {
            DOM.notificationsPanel.classList.remove('open');
        }
    });
}

// Helper Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function formatDate(date) {
    const now = new Date();
    const diff = now - date;
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else {
        return date.toLocaleDateString();
    }
}

function loadMockData() {
    // Load notifications
    initializeNotifications();
    
    // Load recent notes
    updateRecentNotesList();
    
    // Simulate loading delay
    setTimeout(() => {
        showToast('Dashboard data loaded', 'success');
    }, 500);
}

function handleResize() {
    // Auto-collapse sidebar on mobile
    if (window.innerWidth < 768 && !ZenoState.sidebarCollapsed) {
        ZenoState.sidebarCollapsed = true;
        DOM.sidebar.classList.add('collapsed');
        localStorage.setItem('zeno-sidebar-collapsed', 'true');
    }
}

function updateUI() {
    // Update any UI elements based on state
    updateNotificationBadge(ZenoState.notifications.filter(n => !n.read).length);
    
    // Update welcome message with user's name
    const welcomeTitle = document.querySelector('.welcome-title');
    if (welcomeTitle) {
        welcomeTitle.textContent = `Welcome back, ${ZenoState.user.name}`;
    }
    
    // Update user avatar initials
    const avatarInitials = document.querySelector('.avatar-initials');
    if (avatarInitials) {
        avatarInitials.textContent = ZenoState.user.avatarInitials;
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}

// Make some functions available globally for debugging
window.ZenoDebug = {
    state: ZenoState,
    showToast,
    toggleSidebar,
    applyTheme
};

// Export for potential module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeApp,
        ZenoState,
        DOM
    };
}
