// Zeno Mail Application

const ZenoMail = {
    // State
    state: {
        currentFolder: 'inbox',
        emails: [],
        selectedEmails: new Set(),
        currentEmail: null,
        folders: [
            { id: 'inbox', name: 'Inbox', icon: 'inbox', count: 3 },
            { id: 'sent', name: 'Sent', icon: 'send', count: 0 },
            { id: 'drafts', name: 'Drafts', icon: 'file-text', count: 0 },
            { id: 'archive', name: 'Archive', icon: 'archive', count: 0 },
            { id: 'trash', name: 'Trash', icon: 'trash-2', count: 0 }
        ],
        labels: [
            { id: 'personal', name: 'Personal', color: '#FF6B9D' },
            { id: 'work', name: 'Work', color: '#00F5FF' },
            { id: 'important', name: 'Important', color: '#FF9E00' }
        ]
    },

    // Initialize
    init() {
        console.log('📧 Zeno Mail Initializing...');
        
        // Load emails from localStorage or create mock data
        this.loadEmails();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial view
        this.render();
        
        console.log('✅ Zeno Mail Ready');
    },

    // Load emails from localStorage or create mock data
    loadEmails() {
        const savedEmails = localStorage.getItem('zeno-mail-emails');
        
        if (savedEmails) {
            this.state.emails = JSON.parse(savedEmails);
        } else {
            // Create mock emails
            this.state.emails = [
                {
                    id: '1',
                    folder: 'inbox',
                    from: { name: 'Team Zeno', email: 'team@zeno.com', avatar: 'T' },
                    to: 'user@zeno.com',
                    subject: 'Welcome to Zeno Mail!',
                    body: `Welcome to Zeno Mail!

This is your new email client. Features include:
• Compose and send emails (saved locally)
• Organize emails into folders
• Add labels to emails
• Search through your emails
• Responsive design for all devices

All emails are stored in your browser's localStorage.

Best regards,
The Zeno Team`,
                    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
                    read: false,
                    labels: ['important'],
                    attachments: []
                },
                {
                    id: '2',
                    folder: 'inbox',
                    from: { name: 'Calendar Alert', email: 'calendar@zeno.com', avatar: 'C' },
                    to: 'user@zeno.com',
                    subject: 'Meeting at 2:00 PM',
                    body: 'Reminder: Team planning session starts in 30 minutes.\n\nLocation: Conference Room A\nDuration: 1 hour\n\nPlease bring your project updates.',
                    timestamp: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                    read: true,
                    labels: ['work'],
                    attachments: []
                },
                {
                    id: '3',
                    folder: 'inbox',
                    from: { name: 'GitHub', email: 'noreply@github.com', avatar: 'G' },
                    to: 'user@zeno.com',
                    subject: 'Repository updated',
                    body: 'Your repository "zeno" has been updated.\n\nCommit: Added mail application\nAuthor: Zeno User\nTime: 1 day ago\n\nView changes: https://github.com/user/zeno',
                    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    read: true,
                    labels: [],
                    attachments: []
                }
            ];
            
            this.saveEmails();
        }
    },

    // Save emails to localStorage
    saveEmails() {
        localStorage.setItem('zeno-mail-emails', JSON.stringify(this.state.emails));
    },

    // Get emails for current folder
    getCurrentEmails() {
        return this.state.emails.filter(email => email.folder === this.state.currentFolder);
    },

    // Setup event listeners
    setupEventListeners() {
        // Folder clicks
        document.querySelectorAll('.folder').forEach(folder => {
            folder.addEventListener('click', (e) => {
                const folderId = folder.textContent.trim().toLowerCase().split(' ')[0];
                this.switchFolder(folderId);
            });
        });

        // Compose button
        document.querySelector('.compose-btn').addEventListener('click', () => {
            this.openCompose();
        });

        // Close compose modal
        document.querySelector('.close-compose').addEventListener('click', () => {
            this.closeCompose();
        });

        // Send email
        document.querySelector('.compose-footer .btn-primary').addEventListener('click', () => {
            this.sendEmail();
        });

        // Save draft
        document.querySelector('.compose-footer .btn-outline:nth-child(2)').addEventListener('click', () => {
            this.saveDraft();
        });

        // Discard email
        document.querySelector('.compose-footer .btn-outline:nth-child(3)').addEventListener('click', () => {
            this.discardEmail();
        });

        // Email selection checkboxes
        document.addEventListener('change', (e) => {
            if (e.target.type === 'checkbox' && e.target.closest('.email-checkbox')) {
                const emailId = e.target.closest('.email-item').dataset.id;
                if (e.target.checked) {
                    this.state.selectedEmails.add(emailId);
                } else {
                    this.state.selectedEmails.delete(emailId);
                }
                this.updateSelectionUI();
            }
        });

        // Email item clicks
        document.addEventListener('click', (e) => {
            const emailItem = e.target.closest('.email-item');
            if (emailItem && !e.target.type === 'checkbox') {
                const emailId = emailItem.dataset.id;
                this.openEmail(emailId);
            }

            // Email action buttons
            if (e.target.closest('.email-actions button')) {
                const button = e.target.closest('.email-actions button');
                const emailItem = button.closest('.email-item');
                const emailId = emailItem.dataset.id;
                
                if (button.querySelector('[data-lucide="archive"]')) {
                    this.moveToFolder(emailId, 'archive');
                } else if (button.querySelector('[data-lucide="trash-2"]')) {
                    this.moveToFolder(emailId, 'trash');
                }
            }
        });

        // Close email viewer
        document.querySelector('.close-viewer').addEventListener('click', () => {
            this.closeEmailViewer();
        });

        // Search input
        document.querySelector('.search-bar input').addEventListener('input', (e) => {
            this.searchEmails(e.target.value);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N for new email
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.openCompose();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeCompose();
                this.closeEmailViewer();
            }
        });
    },

    // Switch folder
    switchFolder(folderId) {
        this.state.currentFolder = folderId;
        this.state.selectedEmails.clear();
        
        // Update UI
        document.querySelectorAll('.folder').forEach(folder => {
            folder.classList.remove('active');
            if (folder.textContent.trim().toLowerCase().includes(folderId)) {
                folder.classList.add('active');
            }
        });
        
        this.renderEmailList();
    },

    // Open compose modal
    openCompose() {
        document.querySelector('.compose-modal').classList.add('active');
        document.querySelector('.compose-to').focus();
    },

    // Close compose modal
    closeCompose() {
        document.querySelector('.compose-modal').classList.remove('active');
        this.clearComposeForm();
    },

    // Clear compose form
    clearComposeForm() {
        document.querySelector('.compose-to').value = '';
        document.querySelector('.compose-subject').value = '';
        document.querySelector('.compose-body-text').value = '';
    },

    // Send email (saves locally)
    sendEmail() {
        const to = document.querySelector('.compose-to').value.trim();
        const subject = document.querySelector('.compose-subject').value.trim();
        const body = document.querySelector('.compose-body-text').value.trim();
        
        if (!to || !subject) {
            this.showToast('Please fill in To and Subject fields', 'warning');
            return;
        }
        
        const newEmail = {
            id: Date.now().toString(),
            folder: 'sent',
            from: { name: 'You', email: 'user@zeno.com', avatar: 'Y' },
            to: to,
            subject: subject,
            body: body,
            timestamp: new Date().toISOString(),
            read: true,
            labels: [],
            attachments: []
        };
        
        this.state.emails.push(newEmail);
        this.saveEmails();
        
        this.closeCompose();
        this.showToast('Email sent (saved locally)', 'success');
        
        // If we're in sent folder, refresh
        if (this.state.currentFolder === 'sent') {
            this.renderEmailList();
        }
    },

    // Save as draft
    saveDraft() {
        const to = document.querySelector('.compose-to').value.trim();
        const subject = document.querySelector('.compose-subject').value.trim();
        const body = document.querySelector('.compose-body-text').value.trim();
        
        const draft = {
            id: Date.now().toString(),
            folder: 'drafts',
            from: { name: 'You', email: 'user@zeno.com', avatar: 'Y' },
            to: to,
            subject: subject || '(No subject)',
            body: body,
            timestamp: new Date().toISOString(),
            read: true,
            labels: [],
            attachments: []
        };
        
        this.state.emails.push(draft);
        this.saveEmails();
        
        this.closeCompose();
        this.showToast('Draft saved', 'success');
    },

    // Discard email
    discardEmail() {
        if (confirm('Discard this email?')) {
            this.closeCompose();
            this.showToast('Email discarded', 'info');
        }
    },

    // Open email viewer
    openEmail(emailId) {
        const email = this.state.emails.find(e => e.id === emailId);
        if (!email) return;
        
        // Mark as read
        if (!email.read) {
            email.read = true;
            this.saveEmails();
        }
        
        this.state.currentEmail = email;
        
        // Update viewer
        const viewer = document.querySelector('.email-viewer');
        viewer.classList.add('active');
        
        const header = viewer.querySelector('.email-viewer-header h2');
        header.textContent = email.subject;
        
        const content = viewer.querySelector('.email-viewer-content');
        content.innerHTML = this.renderEmailContent(email);
        
        // Update email list UI
        const emailItem = document.querySelector(`.email-item[data-id="${emailId}"]`);
        if (emailItem) {
            emailItem.classList.remove('unread');
        }
    },

    // Close email viewer
    closeEmailViewer() {
        document.querySelector('.email-viewer').classList.remove('active');
        this.state.currentEmail = null;
    },

    // Move email to folder
    moveToFolder(emailId, folder) {
        const email = this.state.emails.find(e => e.id === emailId);
        if (email) {
            email.folder = folder;
            this.saveEmails();
            this.renderEmailList();
            
            const actions = {
                'archive': 'archived',
                'trash': 'moved to trash'
            };
            
            if (actions[folder]) {
                this.showToast(`Email ${actions[folder]}`, 'success');
            }
        }
    },

    // Search emails
    searchEmails(query) {
        const searchTerm = query.toLowerCase();
        const emails = this.getCurrentEmails();
        
        document.querySelectorAll('.email-item').forEach(item => {
            const emailId = item.dataset.id;
            const email = emails.find(e => e.id === emailId);
            
            if (email) {
                const matches = 
                    email.subject.toLowerCase().includes(searchTerm) ||
                    email.from.name.toLowerCase().includes(searchTerm) ||
                    email.body.toLowerCase().includes(searchTerm);
                
                item.style.display = matches ? '' : 'none';
            }
        });
    },

    // Update selection UI
    updateSelectionUI() {
        document.querySelectorAll('.email-item').forEach(item => {
            const emailId = item.dataset.id;
            const checkbox = item.querySelector('.email-checkbox input');
            if (checkbox) {
                checkbox.checked = this.state.selectedEmails.has(emailId);
            }
        });
    },

    // Render email list
    renderEmailList() {
        const emails = this.getCurrentEmails();
        const container = document.querySelector('.email-list');
        
        if (emails.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div style="text-align: center; padding: 48px; color: var(--zeno-text-secondary);">
                        <span data-lucide="inbox" style="width: 64px; height: 64px; margin-bottom: 16px;"></span>
                        <h3 style="margin-bottom: 8px;">No emails</h3>
                        <p>${this.getEmptyStateMessage()}</p>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = emails.map(email => this.renderEmailItem(email)).join('');
        }
        
        // Update folder counts
        this.updateFolderCounts();
        
        // Initialize icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    // Render email item
    renderEmailItem(email) {
        const time = this.formatTime(email.timestamp);
        const labels = email.labels.map(labelId => {
            const label = this.state.labels.find(l => l.id === labelId);
            return label ? `<span class="email-label" style="background: ${label.color}">${label.name}</span>` : '';
        }).join('');
        
        return `
            <div class="email-item ${email.read ? '' : 'unread'}" data-id="${email.id}">
                <div class="email-checkbox">
                    <input type="checkbox">
                </div>
                <div class="email-sender">
                    <div class="sender-avatar">${email.from.avatar}</div>
                    <span class="sender-name">${email.from.name}</span>
                </div>
                <div class="email-content">
                    <div class="email-subject">
                        ${email.subject}
                        ${labels}
                    </div>
                    <div class="email-preview">${this.truncateText(email.body, 60)}</div>
                </div>
                <div class="email-time">${time}</div>
                <div class="email-actions">
                    <button><span data-lucide="archive"></span></button>
                    <button><span data-lucide="trash-2"></span></button>
                </div>
            </div>
        `;
    },

    // Render email content
    renderEmailContent(email) {
        const time = new Date(email.timestamp).toLocaleString();
        const labels = email.labels.map(labelId => {
            const label = this.state.labels.find(l => l.id === labelId);
            return label ? `<span class="label-badge" style="background: ${label.color}20; color: ${label.color}; border: 1px solid ${label.color}40;">${label.name}</span>` : '';
        }).join('');
        
        return `
            <div class="email-header">
                <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px;">
                    <div class="sender-avatar-large">${email.from.avatar}</div>
                    <div>
                        <div style="font-weight: 600; font-size: 16px;">${email.from.name}</div>
                        <div style="color: var(--zeno-text-secondary); font-size: 14px;">${email.from.email}</div>
                    </div>
                </div>
                <div style="color: var(--zeno-text-tertiary); font-size: 14px; margin-bottom: 24px;">
                    To: ${email.to} • ${time}
                </div>
                ${labels ? `<div style="margin-bottom: 24px; display: flex; gap: 8px;">${labels}</div>` : ''}
            </div>
            <div class="email-body" style="line-height: 1.6; white-space: pre-wrap; font-size: 15px;">
                ${email.body}
            </div>
            ${email.attachments && email.attachments.length > 0 ? `
                <div class="email-attachments" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(0,0,0,0.1);">
                    <h4 style="margin-bottom: 12px;">Attachments</h4>
                    ${email.attachments.map(att => `
                        <div style="display: flex; align-items: center; gap: 12px; padding: 12px; background: var(--zeno-background); border-radius: 8px; margin-bottom: 8px;">
                            <span data-lucide="paperclip" style="color: var(--zeno-text-tertiary);"></span>
                            <span style="flex: 1;">${att.name}</span>
                            <button style="background: none; border: none; color: var(--zeno-accent); cursor: pointer;">Download</button>
                        </div>
                    `).join('')}
                </div>
            ` : ''}
            <div class="email-actions" style="margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(0,0,0,0.1); display: flex; gap: 12px;">
                <button class="btn-outline" style="display: flex; align-items: center; gap: 8px;">
                    <span data-lucide="reply"></span> Reply
                </button>
                <button class="btn-outline" style="display: flex; align-items: center; gap: 8px;">
                    <span data-lucide="forward"></span> Forward
                </button>
                <button class="btn-outline" style="display: flex; align-items: center; gap: 8px;">
                    <span data-lucide="archive"></span> Archive
                </button>
                <button class="btn-outline" style="display: flex; align-items: center; gap: 8px; color: var(--zeno-error);">
                    <span data-lucide="trash-2"></span> Delete
                </button>
            </div>
        `;
    },

    // Update folder counts
    updateFolderCounts() {
        this.state.folders.forEach(folder => {
            const count = this.state.emails.filter(e => e.folder === folder.id).length;
            folder.count = count;
            
            // Update UI if element exists
            const folderElement = Array.from(document.querySelectorAll('.folder')).find(el => 
                el.textContent.toLowerCase().includes(folder.id)
            );
            
            if (folderElement) {
                let countElement = folderElement.querySelector('.count');
                if (count > 0) {
                    if (!countElement) {
                        countElement = document.createElement('span');
                        countElement.className = 'count';
                        folderElement.appendChild(countElement);
                    }
                    countElement.textContent = count;
                } else if (countElement) {
                    countElement.remove();
                }
            }
        });
    },

    // Render everything
    render() {
        this.renderEmailList();
        this.updateFolderCounts();
    },

    // Utility functions
    formatTime(timestamp) {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return minutes < 1 ? 'Just now' : `${minutes}m ago`;
        } else if (diff < 86400000) { // Less than 24 hours
            return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        } else if (diff < 604800000) { // Less than 1 week
            return date.toLocaleDateString([], { weekday: 'short' });
        } else {
            return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
        }
    },

    truncateText(text, length) {
        if (text.length <= length) return text;
        return text.substring(0, length) + '...';
    },

    getEmptyStateMessage() {
        const messages = {
            'inbox': 'No new messages',
            'sent': 'No sent messages',
            'drafts': 'No drafts',
            'archive': 'No archived messages',
            'trash': 'Trash is empty'
        };
        return messages[this.state.currentFolder] || 'No emails';
    },

    showToast(message, type = 'info') {
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
        
        // Initialize icon
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
        
        // Add animation styles if not present
        if (!document.querySelector('#toast-animations')) {
            const style = document.createElement('style');
            style.id = 'toast-animations';
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
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ZenoMail.init());
} else {
    ZenoMail.init();
}

// Make available for debugging
window.ZenoMail = ZenoMail;