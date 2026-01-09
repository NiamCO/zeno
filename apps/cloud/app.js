// Zeno Cloud Application

const ZenoCloud = {
    // State
    state: {
        currentPath: '/',
        currentView: 'grid',
        files: [],
        selectedFiles: new Set(),
        uploadQueue: [],
        folders: [
            { id: 'root', name: 'My Files', path: '/', parent: null },
            { id: 'documents', name: 'Documents', path: '/documents', parent: 'root' },
            { id: 'images', name: 'Images', path: '/images', parent: 'root' },
            { id: 'videos', name: 'Videos', path: '/videos', parent: 'root' },
            { id: 'music', name: 'Music', path: '/music', parent: 'root' }
        ],
        storageUsed: 11.2, // GB
        storageTotal: 16, // GB
        contextMenuTarget: null
    },

    // File type icons mapping
    fileIcons: {
        // Documents
        'pdf': 'file-text',
        'doc': 'file-text',
        'docx': 'file-text',
        'txt': 'file-text',
        'rtf': 'file-text',
        
        // Spreadsheets
        'xls': 'file-spreadsheet',
        'xlsx': 'file-spreadsheet',
        'csv': 'file-spreadsheet',
        
        // Presentations
        'ppt': 'file-presentation',
        'pptx': 'file-presentation',
        
        // Images
        'jpg': 'image',
        'jpeg': 'image',
        'png': 'image',
        'gif': 'image',
        'bmp': 'image',
        'svg': 'image',
        'webp': 'image',
        
        // Videos
        'mp4': 'video',
        'avi': 'video',
        'mov': 'video',
        'wmv': 'video',
        'mkv': 'video',
        
        // Audio
        'mp3': 'music',
        'wav': 'music',
        'flac': 'music',
        'aac': 'music',
        
        // Archives
        'zip': 'archive',
        'rar': 'archive',
        '7z': 'archive',
        'tar': 'archive',
        'gz': 'archive',
        
        // Code
        'js': 'file-code',
        'html': 'file-code',
        'css': 'file-code',
        'json': 'file-code',
        'xml': 'file-code',
        
        // Default
        'default': 'file'
    },

    // Initialize
    init() {
        console.log('☁️ Zeno Cloud Initializing...');
        
        // Load files from localStorage
        this.loadFiles();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial view
        this.render();
        
        console.log('✅ Zeno Cloud Ready');
    },

    // Load files from localStorage
    loadFiles() {
        const savedFiles = localStorage.getItem('zeno-cloud-files');
        const savedFolders = localStorage.getItem('zeno-cloud-folders');
        
        if (savedFiles) {
            this.state.files = JSON.parse(savedFiles);
        } else {
            // Create mock files
            this.state.files = [
                {
                    id: '1',
                    name: 'Project_Plan.pdf',
                    type: 'pdf',
                    size: 2.1, // MB
                    path: '/documents',
                    modified: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
                    starred: true,
                    shared: false,
                    thumbnail: null
                },
                {
                    id: '2',
                    name: 'Design_Mockups.png',
                    type: 'png',
                    size: 4.7, // MB
                    path: '/images',
                    modified: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
                    starred: true,
                    shared: true,
                    thumbnail: null
                },
                {
                    id: '3',
                    name: 'Budget_2024.xlsx',
                    type: 'xlsx',
                    size: 1.8, // MB
                    path: '/documents',
                    modified: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                    starred: false,
                    shared: false,
                    thumbnail: null
                },
                {
                    id: '4',
                    name: 'Team_Meeting_Recording.mp4',
                    type: 'mp4',
                    size: 156.3, // MB
                    path: '/videos',
                    modified: new Date(Date.now() - 259200000).toISOString(), // 3 days ago
                    starred: false,
                    shared: true,
                    thumbnail: null
                },
                {
                    id: '5',
                    name: 'Presentation_Slides.pptx',
                    type: 'pptx',
                    size: 8.9, // MB
                    path: '/documents',
                    modified: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
                    starred: false,
                    shared: false,
                    thumbnail: null
                },
                {
                    id: '6',
                    name: 'Background_Music.mp3',
                    type: 'mp3',
                    size: 5.2, // MB
                    path: '/music',
                    modified: new Date(Date.now() - 432000000).toISOString(), // 5 days ago
                    starred: true,
                    shared: false,
                    thumbnail: null
                },
                {
                    id: '7',
                    name: 'Website_Backup.zip',
                    type: 'zip',
                    size: 42.7, // MB
                    path: '/',
                    modified: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
                    starred: false,
                    shared: false,
                    thumbnail: null
                }
            ];
            
            this.saveFiles();
        }
        
        if (savedFolders) {
            this.state.folders = JSON.parse(savedFolders);
        }
    },

    // Save files to localStorage
    saveFiles() {
        localStorage.setItem('zeno-cloud-files', JSON.stringify(this.state.files));
        localStorage.setItem('zeno-cloud-folders', JSON.stringify(this.state.folders));
        
        // Update storage usage
        this.updateStorageUsage();
    },

    // Update storage usage
    updateStorageUsage() {
        const totalSize = this.state.files.reduce((sum, file) => sum + file.size, 0) / 1024; // Convert MB to GB
        this.state.storageUsed = parseFloat(totalSize.toFixed(1));
        
        // Update progress circle
        const percent = (this.state.storageUsed / this.state.storageTotal) * 100;
        const circle = document.querySelector('.progress-circle circle:last-child');
        if (circle) {
            const circumference = 2 * Math.PI * 36;
            const offset = circumference - (percent / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        }
        
        // Update text
        const percentElement = document.querySelector('.progress-percent');
        const usedElement = document.querySelector('.storage-value');
        if (percentElement) {
            percentElement.textContent = `${Math.round(percent)}%`;
        }
        if (usedElement) {
            usedElement.textContent = `${this.state.storageUsed} GB`;
        }
    },

    // Get files for current path
    getCurrentFiles() {
        return this.state.files.filter(file => file.path === this.state.currentPath);
    },

    // Get folders for current path
    getCurrentFolders() {
        const currentFolder = this.state.folders.find(f => f.path === this.state.currentPath);
        if (!currentFolder) return [];
        
        return this.state.folders.filter(folder => 
            folder.parent === currentFolder.id && folder.id !== 'root'
        );
    },

    // Get icon for file type
    getFileIcon(filename) {
        const extension = filename.split('.').pop().toLowerCase();
        return this.fileIcons[extension] || this.fileIcons.default;
    },

    // Format file size
    formatFileSize(sizeInMB) {
        if (sizeInMB < 1) {
            return `${(sizeInMB * 1024).toFixed(0)} KB`;
        } else if (sizeInMB < 1024) {
            return `${sizeInMB.toFixed(1)} MB`;
        } else {
            return `${(sizeInMB / 1024).toFixed(1)} GB`;
        }
    },

    // Format date
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now - date;
        
        if (diff < 3600000) { // Less than 1 hour
            const minutes = Math.floor(diff / 60000);
            return `${minutes}m ago`;
        } else if (diff < 86400000) { // Less than 24 hours
            const hours = Math.floor(diff / 3600000);
            return `${hours}h ago`;
        } else if (diff < 604800000) { // Less than 1 week
            const days = Math.floor(diff / 86400000);
            return `${days}d ago`;
        } else {
            return date.toLocaleDateString();
        }
    },

    // Setup event listeners
    setupEventListeners() {
        // Upload button
        document.getElementById('upload-btn').addEventListener('click', () => {
            this.openUploadModal();
        });

        // New folder button
        document.getElementById('new-folder-btn').addEventListener('click', () => {
            this.openFolderModal();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.closest('.view-btn').dataset.view;
                this.switchView(view);
            });
        });

        // Search input
        document.getElementById('search-files').addEventListener('input', (e) => {
            this.searchFiles(e.target.value);
        });

        // Select all button
        document.getElementById('select-all-btn').addEventListener('click', () => {
            this.toggleSelectAll();
        });

        // Navigation items
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const text = e.currentTarget.textContent.trim();
                if (text === 'My Files') {
                    this.navigateTo('/');
                } else if (text === 'Starred') {
                    this.showStarred();
                } else if (text === 'Recent') {
                    this.showRecent();
                } else if (text === 'Trash') {
                    this.showTrash();
                } else if (text.includes('Documents')) {
                    this.navigateTo('/documents');
                } else if (text.includes('Images')) {
                    this.navigateTo('/images');
                } else if (text.includes('Videos')) {
                    this.navigateTo('/videos');
                } else if (text.includes('Music')) {
                    this.navigateTo('/music');
                }
            });
        });

        // Upload modal
        document.querySelector('.close-upload-modal').addEventListener('click', () => this.closeUploadModal());
        document.getElementById('cancel-upload').addEventListener('click', () => this.closeUploadModal());
        document.getElementById('start-upload').addEventListener('click', () => this.startUpload());
        document.getElementById('browse-btn').addEventListener('click', () => document.getElementById('file-input').click());
        document.getElementById('file-input').addEventListener('change', (e) => this.handleFileSelect(e.target.files));
        document.getElementById('upload-dropzone').addEventListener('click', () => document.getElementById('file-input').click());
        
        // Drag and drop
        const dropzone = document.getElementById('upload-dropzone');
        dropzone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = 'var(--zeno-accent)';
            dropzone.style.backgroundColor = 'rgba(255, 158, 0, 0.1)';
        });
        
        dropzone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = '';
            dropzone.style.backgroundColor = '';
        });
        
        dropzone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropzone.style.borderColor = '';
            dropzone.style.backgroundColor = '';
            this.handleFileSelect(e.dataTransfer.files);
        });

        // Folder modal
        document.querySelector('.close-folder-modal').addEventListener('click', () => this.closeFolderModal());
        document.getElementById('cancel-folder').addEventListener('click', () => this.closeFolderModal());
        document.getElementById('create-folder').addEventListener('click', () => this.createFolder());

        // Selection actions
        document.getElementById('download-selected').addEventListener('click', () => this.downloadSelected());
        document.getElementById('share-selected').addEventListener('click', () => this.shareSelected());
        document.getElementById('move-selected').addEventListener('click', () => this.moveSelected());
        document.getElementById('delete-selected').addEventListener('click', () => this.deleteSelected());

        // Empty state upload button
        document.getElementById('empty-upload-btn').addEventListener('click', () => this.openUploadModal());

        // File clicks (delegated)
        document.addEventListener('click', (e) => {
            // File item click
            const fileItem = e.target.closest('.file-item, .list-item');
            if (fileItem && !e.target.type === 'checkbox') {
                const fileId = fileItem.dataset.id;
                if (e.shiftKey || e.ctrlKey || e.metaKey) {
                    this.toggleFileSelection(fileId);
                } else {
                    this.openFile(fileId);
                }
            }

            // File checkbox click
            if (e.target.type === 'checkbox' && e.target.closest('.file-item-checkbox, .list-checkbox')) {
                const fileId = e.target.closest('.file-item, .list-item').dataset.id;
                this.toggleFileSelection(fileId);
            }

            // File action buttons
            if (e.target.closest('.file-action-btn')) {
                const button = e.target.closest('.file-action-btn');
                const fileItem = button.closest('.file-item, .list-item');
                const fileId = fileItem.dataset.id;
                const action = button.dataset.action;
                
                if (action === 'star') {
                    this.toggleStar(fileId);
                } else if (action === 'share') {
                    this.shareFile(fileId);
                } else if (action === 'more') {
                    this.showContextMenu(fileId, button);
                }
            }

            // Path breadcrumb click
            if (e.target.closest('.path-item')) {
                const path = e.target.closest('.path-item').textContent;
                if (path === 'Zeno Cloud') {
                    this.navigateTo('/');
                } else if (path === 'My Files') {
                    this.navigateTo('/');
                }
            }
        });

        // Context menu
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.context-menu')) {
                this.hideContextMenu();
            }
        });

        document.querySelectorAll('.context-menu-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const action = e.currentTarget.dataset.action;
                if (this.state.contextMenuTarget) {
                    this.handleContextAction(action, this.state.contextMenuTarget);
                }
                this.hideContextMenu();
            });
        });

        // Right-click for context menu
        document.addEventListener('contextmenu', (e) => {
            const fileItem = e.target.closest('.file-item, .list-item');
            if (fileItem) {
                e.preventDefault();
                const fileId = fileItem.dataset.id;
                this.showContextMenu(fileId, fileItem);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + U for upload
            if ((e.ctrlKey || e.metaKey) && e.key === 'u') {
                e.preventDefault();
                this.openUploadModal();
            }
            
            // Ctrl/Cmd + N for new folder
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.openFolderModal();
            }
            
            // Delete key
            if (e.key === 'Delete' && this.state.selectedFiles.size > 0) {
                e.preventDefault();
                this.deleteSelected();
            }
            
            // Escape key
            if (e.key === 'Escape') {
                this.clearSelection();
                this.closeUploadModal();
                this.closeFolderModal();
                this.hideContextMenu();
            }
            
            // Ctrl/Cmd + A to select all
            if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
                e.preventDefault();
                this.selectAllVisible();
            }
        });
    },

    // Switch view (grid/list)
    switchView(view) {
        this.state.currentView = view;
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });
        
        // Update view containers
        if (view === 'grid') {
            document.querySelector('.files-grid').style.display = 'grid';
            document.querySelector('.files-list').classList.remove('active');
        } else {
            document.querySelector('.files-grid').style.display = 'none';
            document.querySelector('.files-list').classList.add('active');
        }
    },

    // Navigate to path
    navigateTo(path) {
        this.state.currentPath = path;
        this.state.selectedFiles.clear();
        this.updateSelectionUI();
        this.render();
        
        // Update breadcrumb
        const breadcrumb = document.querySelector('.path-breadcrumb');
        if (path === '/') {
            breadcrumb.innerHTML = `
                <span class="path-item">Zeno Cloud</span>
                <span data-lucide="chevron-right" class="path-separator"></span>
                <span class="path-item active">My Files</span>
            `;
        } else {
            const folderName = path.substring(1);
            breadcrumb.innerHTML = `
                <span class="path-item">Zeno Cloud</span>
                <span data-lucide="chevron-right" class="path-separator"></span>
                <span class="path-item">My Files</span>
                <span data-lucide="chevron-right" class="path-separator"></span>
                <span class="path-item active">${folderName.charAt(0).toUpperCase() + folderName.slice(1)}</span>
            `;
        }
        
        // Initialize icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    // Show starred files
    showStarred() {
        // Implement starred view
        this.showToast('Starred view coming soon', 'info');
    },

    // Show recent files
    showRecent() {
        // Implement recent view
        this.showToast('Recent view coming soon', 'info');
    },

    // Show trash
    showTrash() {
        // Implement trash view
        this.showToast('Trash view coming soon', 'info');
    },

    // Search files
    searchFiles(query) {
        const searchTerm = query.toLowerCase();
        const files = this.getCurrentFiles();
        const folders = this.getCurrentFolders();
        
        // Hide/show grid items
        document.querySelectorAll('.file-item').forEach(item => {
            const fileId = item.dataset.id;
            const isFolder = item.classList.contains('folder');
            
            if (isFolder) {
                const folder = folders.find(f => f.id === fileId);
                item.style.display = folder && folder.name.toLowerCase().includes(searchTerm) ? '' : 'none';
            } else {
                const file = files.find(f => f.id === fileId);
                item.style.display = file && file.name.toLowerCase().includes(searchTerm) ? '' : 'none';
            }
        });
        
        // Hide/show list items
        document.querySelectorAll('.list-item').forEach(item => {
            const fileId = item.dataset.id;
            const isFolder = item.classList.contains('folder');
            
            if (isFolder) {
                const folder = folders.find(f => f.id === fileId);
                item.style.display = folder && folder.name.toLowerCase().includes(searchTerm) ? '' : 'none';
            } else {
                const file = files.find(f => f.id === fileId);
                item.style.display = file && file.name.toLowerCase().includes(searchTerm) ? '' : 'none';
            }
        });
        
        // Show empty state if nothing matches
        const visibleItems = document.querySelectorAll('.file-item[style*="display: none"], .list-item[style*="display: none"]');
        const totalItems = document.querySelectorAll('.file-item, .list-item').length;
        
        if (visibleItems.length === totalItems && query) {
            this.showEmptyState('No files match your search');
        } else {
            this.hideEmptyState();
        }
    },

    // Toggle file selection
    toggleFileSelection(fileId) {
        if (this.state.selectedFiles.has(fileId)) {
            this.state.selectedFiles.delete(fileId);
        } else {
            this.state.selectedFiles.add(fileId);
        }
        this.updateSelectionUI();
    },

    // Toggle select all
    toggleSelectAll() {
        const files = this.getCurrentFiles();
        const folders = this.getCurrentFolders();
        const allItems = [...files, ...folders];
        
        if (this.state.selectedFiles.size === allItems.length) {
            // Deselect all
            this.state.selectedFiles.clear();
        } else {
            // Select all
            allItems.forEach(item => this.state.selectedFiles.add(item.id));
        }
        this.updateSelectionUI();
    },

    // Select all visible items
    selectAllVisible() {
        const visibleFiles = Array.from(document.querySelectorAll('.file-item:not([style*="display: none"])')).map(el => el.dataset.id);
        const visibleListItems = Array.from(document.querySelectorAll('.list-item:not([style*="display: none"])')).map(el => el.dataset.id);
        const allVisible = [...new Set([...visibleFiles, ...visibleListItems])];
        
        allVisible.forEach(id => this.state.selectedFiles.add(id));
        this.updateSelectionUI();
    },

    // Clear selection
    clearSelection() {
        this.state.selectedFiles.clear();
        this.updateSelectionUI();
    },

    // Update selection UI
    updateSelectionUI() {
        // Update checkboxes
        document.querySelectorAll('.file-item, .list-item').forEach(item => {
            const checkbox = item.querySelector('.file-item-checkbox, .list-checkbox');
            if (checkbox) {
                checkbox.checked = this.state.selectedFiles.has(item.dataset.id);
            }
            
            // Update selected class
            if (this.state.selectedFiles.has(item.dataset.id)) {
                item.classList.add('selected');
            } else {
                item.classList.remove('selected');
            }
        });
        
        // Update selection actions
        const selectionActions = document.getElementById('selection-actions');
        const selectedCount = document.getElementById('selected-count');
        
        if (this.state.selectedFiles.size > 0) {
            selectionActions.classList.add('active');
            selectedCount.textContent = this.state.selectedFiles.size;
        } else {
            selectionActions.classList.remove('active');
        }
    },

    // Open file
    openFile(fileId) {
        const file = this.state.files.find(f => f.id === fileId);
        if (!file) return;
        
        // For now, just show a preview message
        // In a real app, this would open the file or show a preview
        this.showToast(`Opening: ${file.name}`, 'info');
    },

    // Toggle star
    toggleStar(fileId) {
        const file = this.state.files.find(f => f.id === fileId);
        if (file) {
            file.starred = !file.starred;
            this.saveFiles();
            this.render();
            
            const action = file.starred ? 'starred' : 'unstarred';
            this.showToast(`File ${action}`, 'success');
        }
    },

    // Share file
    shareFile(fileId) {
        const file = this.state.files.find(f => f.id === fileId);
        if (!file) return;
        
        file.shared = !file.shared;
        this.saveFiles();
        this.render();
        
        const action = file.shared ? 'shared' : 'unshared';
        this.showToast(`File ${action}`, 'success');
    },

    // Show context menu
    showContextMenu(fileId, targetElement) {
        this.state.contextMenuTarget = fileId;
        const menu = document.getElementById('context-menu');
        const rect = targetElement.getBoundingClientRect();
        
        menu.style.top = `${rect.bottom + 5}px`;
        menu.style.left = `${rect.left}px`;
        menu.classList.add('active');
        
        // Adjust if menu goes off screen
        setTimeout(() => {
            const menuRect = menu.getBoundingClientRect();
            if (menuRect.right > window.innerWidth) {
                menu.style.left = `${window.innerWidth - menuRect.width - 10}px`;
            }
            if (menuRect.bottom > window.innerHeight) {
                menu.style.top = `${rect.top - menuRect.height - 5}px`;
            }
        }, 0);
    },

    // Hide context menu
    hideContextMenu() {
        document.getElementById('context-menu').classList.remove('active');
        this.state.contextMenuTarget = null;
    },

    // Handle context menu action
    handleContextAction(action, fileId) {
        switch (action) {
            case 'open':
                this.openFile(fileId);
                break;
            case 'download':
                this.downloadFile(fileId);
                break;
            case 'rename':
                this.renameFile(fileId);
                break;
            case 'share':
                this.shareFile(fileId);
                break;
            case 'star':
                this.toggleStar(fileId);
                break;
            case 'move':
                this.moveFile(fileId);
                break;
            case 'delete':
                this.deleteFile(fileId);
                break;
        }
    },

    // Download file
    downloadFile(fileId) {
        const file = this.state.files.find(f => f.id === fileId);
        if (!file) return;
        
        // In a real app, this would trigger an actual download
        // For now, simulate download
        this.showToast(`Downloading: ${file.name}`, 'info');
        
        // Simulate download progress
        setTimeout(() => {
            this.showToast(`${file.name} downloaded`, 'success');
        }, 1500);
    },

    // Rename file
    renameFile(fileId) {
        const file = this.state.files.find(f => f.id === fileId);
        if (!file) return;
        
        const newName = prompt('Enter new name:', file.name);
        if (newName && newName !== file.name) {
            const existingFile = this.state.files.find(f => 
                f.name === newName && f.path === file.path && f.id !== fileId
            );
            
            if (existingFile) {
                this.showToast('A file with that name already exists', 'error');
                return;
            }
            
            file.name = newName;
            file.modified = new Date().toISOString();
            this.saveFiles();
            this.render();
            this.showToast('File renamed', 'success');
        }
    },

    // Move file
    moveFile(fileId) {
        // Implement file move functionality
        this.showToast('Move functionality coming soon', 'info');
    },

    // Delete file
    deleteFile(fileId) {
        if (confirm('Move this file to trash?')) {
            const file = this.state.files.find(f => f.id === fileId);
            if (file) {
                // In a real app, this would move to trash first
                // For now, delete immediately
                this.state.files = this.state.files.filter(f => f.id !== fileId);
                this.state.selectedFiles.delete(fileId);
                this.saveFiles();
                this.render();
                this.showToast('File moved to trash', 'success');
            }
        }
    },

    // Open upload modal
    openUploadModal() {
        document.getElementById('upload-modal').classList.add('active');
    },

    // Close upload modal
    closeUploadModal() {
        document.getElementById('upload-modal').classList.remove('active');
        this.state.uploadQueue = [];
        this.renderUploadQueue();
    },

    // Handle file selection
    handleFileSelect(fileList) {
        for (let i = 0; i < fileList.length; i++) {
            const file = fileList[i];
            
            // Check if file already exists
            const existingFile = this.state.files.find(f => 
                f.name === file.name && f.path === this.state.currentPath
            );
            
            if (existingFile) {
                if (!confirm(`"${file.name}" already exists. Replace it?`)) {
                    continue;
                }
                // Remove existing file
                this.state.files = this.state.files.filter(f => f.id !== existingFile.id);
            }
            
            // Add to upload queue
            this.state.uploadQueue.push({
                id: Date.now() + i,
                file: file,
                name: file.name,
                size: file.size / (1024 * 1024), // Convert to MB
                progress: 0,
                status: 'pending'
            });
        }
        
        this.renderUploadQueue();
    },

    // Render upload queue
    renderUploadQueue() {
        const queueList = document.getElementById('queue-list');
        
        if (this.state.uploadQueue.length === 0) {
            queueList.innerHTML = `
                <div style="text-align: center; padding: 20px; color: var(--zeno-text-tertiary);">
                    No files in queue
                </div>
            `;
            return;
        }
        
        let queueHTML = '';
        this.state.uploadQueue.forEach(item => {
            const icon = this.getFileIcon(item.name);
            const sizeFormatted = this.formatFileSize(item.size);
            
            queueHTML += `
                <div class="queue-item" data-id="${item.id}">
                    <span class="queue-icon" data-lucide="${icon}"></span>
                    <div class="queue-info">
                        <div class="queue-name">${item.name}</div>
                        <div class="queue-progress">
                            <div class="queue-progress-fill" style="width: ${item.progress}%"></div>
                        </div>
                    </div>
                    <div class="queue-size">${sizeFormatted}</div>
                    <div class="queue-actions">
                        ${item.status === 'uploading' ? `
                            <button class="queue-action-btn" data-action="pause" title="Pause">
                                <span data-lucide="pause"></span>
                            </button>
                        ` : item.status === 'paused' ? `
                            <button class="queue-action-btn" data-action="resume" title="Resume">
                                <span data-lucide="play"></span>
                            </button>
                        ` : ''}
                        <button class="queue-action-btn" data-action="remove" title="Remove">
                            <span data-lucide="x"></span>
                        </button>
                    </div>
                </div>
            `;
        });
        
        queueList.innerHTML = queueHTML;
        
        // Initialize icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Add event listeners to queue buttons
        queueList.querySelectorAll('.queue-action-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const itemId = parseInt(e.target.closest('.queue-item').dataset.id);
                const action = e.currentTarget.dataset.action;
                this.handleQueueAction(itemId, action);
            });
        });
    },

    // Handle queue action
    handleQueueAction(itemId, action) {
        const itemIndex = this.state.uploadQueue.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        switch (action) {
            case 'pause':
                this.state.uploadQueue[itemIndex].status = 'paused';
                break;
            case 'resume':
                this.state.uploadQueue[itemIndex].status = 'uploading';
                this.simulateUpload(itemId);
                break;
            case 'remove':
                this.state.uploadQueue.splice(itemIndex, 1);
                break;
        }
        
        this.renderUploadQueue();
    },

    // Start upload
    startUpload() {
        if (this.state.uploadQueue.length === 0) {
            this.showToast('No files to upload', 'warning');
            return;
        }
        
        // Start uploading each file
        this.state.uploadQueue.forEach(item => {
            if (item.status === 'pending') {
                item.status = 'uploading';
                this.simulateUpload(item.id);
            }
        });
        
        this.renderUploadQueue();
    },

    // Simulate upload (in real app, this would be actual upload)
    simulateUpload(itemId) {
        const itemIndex = this.state.uploadQueue.findIndex(item => item.id === itemId);
        if (itemIndex === -1) return;
        
        const item = this.state.uploadQueue[itemIndex];
        
        const simulateProgress = () => {
            if (item.status !== 'uploading') return;
            
            item.progress += Math.random() * 10 + 5; // Random progress increment
            
            if (item.progress >= 100) {
                item.progress = 100;
                item.status = 'completed';
                
                // Add file to files list
                const newFile = {
                    id: `uploaded_${Date.now()}`,
                    name: item.name,
                    type: item.name.split('.').pop().toLowerCase(),
                    size: item.size,
                    path: this.state.currentPath,
                    modified: new Date().toISOString(),
                    starred: false,
                    shared: false,
                    thumbnail: null
                };
                
                this.state.files.push(newFile);
                this.saveFiles();
                this.render();
                
                // Remove from queue after delay
                setTimeout(() => {
                    this.state.uploadQueue.splice(itemIndex, 1);
                    this.renderUploadQueue();
                    
                    if (this.state.uploadQueue.length === 0) {
                        this.showToast('All files uploaded successfully', 'success');
                        this.closeUploadModal();
                    }
                }, 1000);
            } else {
                // Continue simulation
                setTimeout(simulateProgress, 200);
            }
            
            this.renderUploadQueue();
        };
        
        simulateProgress();
    },

    // Open folder modal
    openFolderModal() {
        document.getElementById('folder-modal').classList.add('active');
        document.getElementById('folder-name').focus();
        document.getElementById('folder-name').select();
    },

    // Close folder modal
    closeFolderModal() {
        document.getElementById('folder-modal').classList.remove('active');
    },

    // Create folder
    createFolder() {
        const nameInput = document.getElementById('folder-name');
        const locationSelect = document.getElementById('folder-location');
        
        const name = nameInput.value.trim();
        const location = locationSelect.value;
        
        if (!name) {
            this.showToast('Please enter a folder name', 'warning');
            return;
        }
        
        // Check if folder already exists
        const existingFolder = this.state.folders.find(f => 
            f.name === name && f.parent === location
        );
        
        if (existingFolder) {
            this.showToast('A folder with that name already exists', 'error');
            return;
        }
        
        // Create new folder
        const newFolder = {
            id: `folder_${Date.now()}`,
            name: name,
            path: location === 'root' ? `/${name.toLowerCase()}` : `${location}/${name.toLowerCase()}`,
            parent: location
        };
        
        this.state.folders.push(newFolder);
        this.saveFiles();
        this.closeFolderModal();
        this.render();
        this.showToast('Folder created', 'success');
    },

    // Download selected files
    downloadSelected() {
        if (this.state.selectedFiles.size === 0) return;
        
        const fileCount = this.state.selectedFiles.size;
        this.showToast(`Downloading ${fileCount} file(s)...`, 'info');
        
        // Simulate download
        setTimeout(() => {
            this.showToast(`${fileCount} file(s) downloaded`, 'success');
            this.clearSelection();
        }, 2000);
    },

    // Share selected files
    shareSelected() {
        if (this.state.selectedFiles.size === 0) return;
        
        // Toggle shared status for selected files
        this.state.files.forEach(file => {
            if (this.state.selectedFiles.has(file.id)) {
                file.shared = !file.shared;
            }
        });
        
        this.saveFiles();
        this.render();
        
        const fileCount = this.state.selectedFiles.size;
        const action = this.state.files.some(f => this.state.selectedFiles.has(f.id) && f.shared) ? 'shared' : 'unshared';
        this.showToast(`${fileCount} file(s) ${action}`, 'success');
        this.clearSelection();
    },

    // Move selected files
    moveSelected() {
        if (this.state.selectedFiles.size === 0) return;
        
        // Implement move functionality
        this.showToast('Move functionality coming soon', 'info');
    },

    // Delete selected files
    deleteSelected() {
        if (this.state.selectedFiles.size === 0) return;
        
        const fileCount = this.state.selectedFiles.size;
        if (confirm(`Move ${fileCount} file(s) to trash?`)) {
            // Remove selected files
            this.state.files = this.state.files.filter(file => !this.state.selectedFiles.has(file.id));
            this.saveFiles();
            this.render();
            
            this.showToast(`${fileCount} file(s) moved to trash`, 'success');
            this.clearSelection();
        }
    },

    // Show empty state
    showEmptyState(message = 'Your cloud is empty') {
        const emptyState = document.getElementById('empty-state');
        emptyState.style.display = 'block';
        emptyState.querySelector('h3').textContent = message;
        
        if (message.includes('search')) {
            emptyState.querySelector('p').textContent = 'Try a different search term';
            emptyState.querySelector('button').style.display = 'none';
        } else {
            emptyState.querySelector('p').textContent = 'Upload files or create folders to get started';
            emptyState.querySelector('button').style.display = 'block';
        }
    },

    // Hide empty state
    hideEmptyState() {
        document.getElementById('empty-state').style.display = 'none';
    },

    // Render everything
    render() {
        this.renderFiles();
        this.updateStorageUsage();
        this.updateSelectionUI();
    },

    // Render files
    renderFiles() {
        const files = this.getCurrentFiles();
        const folders = this.getCurrentFolders();
        const allItems = [...folders, ...files];
        
        // Hide empty state if there are items
        if (allItems.length > 0) {
            this.hideEmptyState();
        } else {
            this.showEmptyState();
        }
        
        // Render grid view
        this.renderGridView(allItems);
        
        // Render list view
        this.renderListView(allItems);
    },

    // Render grid view
    renderGridView(items) {
        const container = document.querySelector('.files-grid');
        
        if (items.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'grid';
        
        let gridHTML = '';
        items.forEach(item => {
            const isFolder = item.hasOwnProperty('parent');
            
            if (isFolder) {
                // Render folder
                gridHTML += this.renderFolderGrid(item);
            } else {
                // Render file
                gridHTML += this.renderFileGrid(item);
            }
        });
        
        container.innerHTML = gridHTML;
        
        // Initialize icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    // Render folder for grid view
    renderFolderGrid(folder) {
        const isSelected = this.state.selectedFiles.has(folder.id);
        
        return `
            <div class="file-item folder ${isSelected ? 'selected' : ''}" data-id="${folder.id}">
                <input type="checkbox" class="file-item-checkbox" ${isSelected ? 'checked' : ''}>
                <div class="file-icon">
                    <span data-lucide="folder"></span>
                    <span class="file-badge">${this.countItemsInFolder(folder.id)}</span>
                </div>
                <div class="file-info">
                    <span class="file-name">${folder.name}</span>
                    <span class="file-meta">Folder</span>
                </div>
                <div class="file-actions">
                    <button class="file-action-btn" data-action="star" title="Star">
                        <span data-lucide="star"></span>
                    </button>
                    <button class="file-action-btn" data-action="share" title="Share">
                        <span data-lucide="share-2"></span>
                    </button>
                    <button class="file-action-btn" data-action="more" title="More">
                        <span data-lucide="more-vertical"></span>
                    </button>
                </div>
            </div>
        `;
    },

    // Render file for grid view
    renderFileGrid(file) {
        const isSelected = this.state.selectedFiles.has(file.id);
        const icon = this.getFileIcon(file.name);
        const sizeFormatted = this.formatFileSize(file.size);
        const modifiedFormatted = this.formatDate(file.modified);
        
        return `
            <div class="file-item ${isSelected ? 'selected' : ''}" data-id="${file.id}">
                <input type="checkbox" class="file-item-checkbox" ${isSelected ? 'checked' : ''}>
                <div class="file-icon">
                    <span data-lucide="${icon}"></span>
                    ${file.starred ? `<span class="file-badge" title="Starred">★</span>` : ''}
                </div>
                <div class="file-info">
                    <span class="file-name">${file.name}</span>
                    <span class="file-meta">${sizeFormatted} • ${modifiedFormatted}</span>
                </div>
                <div class="file-actions">
                    <button class="file-action-btn" data-action="star" title="${file.starred ? 'Unstar' : 'Star'}">
                        <span data-lucide="${file.starred ? 'star' : 'star'}"></span>
                    </button>
                    <button class="file-action-btn" data-action="share" title="${file.shared ? 'Unshare' : 'Share'}">
                        <span data-lucide="share-2"></span>
                    </button>
                    <button class="file-action-btn" data-action="more" title="More">
                        <span data-lucide="more-vertical"></span>
                    </button>
                </div>
            </div>
        `;
    },

    // Render list view
    renderListView(items) {
        const container = document.querySelector('.files-list');
        
        if (items.length === 0) {
            container.style.display = 'none';
            return;
        }
        
        container.style.display = 'flex';
        
        // Render header
        let listHTML = `
            <div class="list-header">
                <div></div>
                <div>Name</div>
                <div>Size</div>
                <div>Modified</div>
                <div>Type</div>
            </div>
        `;
        
        // Render items
        items.forEach(item => {
            const isFolder = item.hasOwnProperty('parent');
            
            if (isFolder) {
                listHTML += this.renderFolderList(item);
            } else {
                listHTML += this.renderFileList(item);
            }
        });
        
        container.innerHTML = listHTML;
        
        // Initialize icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    // Render folder for list view
    renderFolderList(folder) {
        const isSelected = this.state.selectedFiles.has(folder.id);
        const itemCount = this.countItemsInFolder(folder.id);
        
        return `
            <div class="list-item folder ${isSelected ? 'selected' : ''}" data-id="${folder.id}">
                <input type="checkbox" class="list-checkbox" ${isSelected ? 'checked' : ''}>
                <div class="list-icon">
                    <span data-lucide="folder"></span>
                </div>
                <div class="list-name">${folder.name}</div>
                <div class="list-size">${itemCount} items</div>
                <div class="list-modified">Folder</div>
                <div class="list-type">Folder</div>
            </div>
        `;
    },

    // Render file for list view
    renderFileList(file) {
        const isSelected = this.state.selectedFiles.has(file.id);
        const icon = this.getFileIcon(file.name);
        const sizeFormatted = this.formatFileSize(file.size);
        const modifiedFormatted = this.formatDate(file.modified);
        const type = file.type.toUpperCase();
        
        return `
            <div class="list-item ${isSelected ? 'selected' : ''}" data-id="${file.id}">
                <input type="checkbox" class="list-checkbox" ${isSelected ? 'checked' : ''}>
                <div class="list-icon">
                    <span data-lucide="${icon}"></span>
                </div>
                <div class="list-name">
                    ${file.name}
                    ${file.starred ? ' ★' : ''}
                    ${file.shared ? ' 🔗' : ''}
                </div>
                <div class="list-size">${sizeFormatted}</div>
                <div class="list-modified">${modifiedFormatted}</div>
                <div class="list-type">${type}</div>
            </div>
        `;
    },

    // Count items in folder
    countItemsInFolder(folderId) {
        const folder = this.state.folders.find(f => f.id === folderId);
        if (!folder) return 0;
        
        const filesInFolder = this.state.files.filter(f => f.path === folder.path);
        const subfolders = this.state.folders.filter(f => f.parent === folderId);
        
        return filesInFolder.length + subfolders.length;
    },

    // Show toast notification
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
    }
};

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => ZenoCloud.init());
} else {
    ZenoCloud.init();
}

// Make available for debugging
window.ZenoCloud = ZenoCloud;