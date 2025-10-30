// ScheduleFlow Dashboard Application

function toggleChatbot() {
    let chatbot = document.getElementById("chatbot-container");
    chatbot.style.display = chatbot.style.display === "none" || chatbot.style.display === "" ? "block" : "none";
}
function toggleChatbot() {
    let chatbot = document.getElementById("chatbot-container");
    chatbot.style.display = chatbot.style.display === "none" || chatbot.style.display === "" ? "block" : "none";
}

function closeChatbot() {
    document.getElementById("chatbot-container").style.display = "none";
}
class ScheduleFlowApp {
    constructor() {
        this.currentSection = 'dashboard';
        this.currentUser = {
            firstName: 'Admin',
            fullName: 'Admin User',
            email: 'admin@scheduleflow.com'
        };
        this.events = [
            {
                id: 'evt001',
                title: 'Annual Tech Symposium',
                startDate: '2024-02-15',
                endDate: '2024-02-17',
                startTime: '09:00',
                endTime: '17:00',
                venue: 'Main Auditorium',
                organizer: 'Tech Club',
                president: { name: 'John Smith', contact: '+1234567890' },
                vicePresident: { name: 'Sarah Johnson', contact: '+1234567891' },
                description: 'Annual technology symposium featuring latest innovations',
                registrationFee: 50,
                credentials: 'TECH2024SYM',
                status: 'active'
            }
        ];
        this.init();
    }

    init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setup();
            });
        } else {
            this.setup();
        }
    }

    setup() {
        this.bindEvents();
        this.updateWelcomeMessage();
        this.renderEvents();
        this.initAnimations();
        console.log('ScheduleFlow Dashboard initialized successfully');
    }

    bindEvents() {
        // Navigation events
        this.bindNavigation();
        
        // Action card events
        this.bindActionCards();
        
        // Modal events
        this.bindModalEvents();
        
        // Mobile events
        this.bindMobileEvents();
        
        // Form events
        this.bindFormEvents();
        
        // Button events
        this.bindButtonEvents();

        // Window events
        window.addEventListener('resize', () => {
            this.handleResize();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    bindNavigation() {
        const navLinks = document.querySelectorAll('.nav-link[data-section]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                if (!link.classList.contains('disabled')) {
                    const section = link.getAttribute('data-section');
                    this.navigateToSection(section);
                }
            });
        });

        // Logout button - Line 87
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                // TODO: Replace with actual logout URL
                window.open('https://scheduleflow.com', '_blank');
                // Please provide the logout redirect URL for line 87
            });
        }
    }

    bindActionCards() {
        // New Time Table card - Line 103
        const newTimetableCard = document.getElementById('new-timetable-card');
        if (newTimetableCard) {
            newTimetableCard.addEventListener('click', () => {
                // TODO: Replace with actual new timetable URL
                window.open('/create-timetable', '_blank');
                // Please provide the new timetable redirect URL for line 103
            });
        }

        // Manage Events card
        const manageEventsCard = document.getElementById('manage-events-card');
        if (manageEventsCard) {
            manageEventsCard.addEventListener('click', () => {
                this.showManageEventsModal();
            });
        }

        // Create timetable button
        const createTimetableBtn = document.getElementById('create-timetable-btn');
        if (createTimetableBtn) {
            createTimetableBtn.addEventListener('click', () => {
                // TODO: Replace with actual new timetable URL
                window.open('/create-timetable', '_blank');
                // Please provide the new timetable redirect URL for line 122
            });
        }
    }

    bindModalEvents() {
        // Manage Events Modal
        const manageEventsModal = document.getElementById('manage-events-modal');
        const closeEventsModal = document.getElementById('modal-close-events');
        const cancelEventsModal = document.getElementById('modal-cancel-events');

        if (closeEventsModal) {
            closeEventsModal.addEventListener('click', () => {
                this.hideModal('manage-events-modal');
            });
        }

        if (cancelEventsModal) {
            cancelEventsModal.addEventListener('click', () => {
                this.hideModal('manage-events-modal');
            });
        }

        // QR Modal
        const qrModal = document.getElementById('qr-modal');
        const closeQrModal = document.getElementById('modal-close-qr');
        const backToDashboard = document.getElementById('back-to-dashboard');
        const downloadQr = document.getElementById('download-qr');

        if (closeQrModal) {
            closeQrModal.addEventListener('click', () => {
                this.hideModal('qr-modal');
            });
        }

        if (backToDashboard) {
            backToDashboard.addEventListener('click', () => {
                this.hideModal('qr-modal');
                this.navigateToSection('dashboard');
            });
        }

        if (downloadQr) {
            downloadQr.addEventListener('click', () => {
                this.downloadQRCode();
            });
        }

        // Click outside to close
        if (manageEventsModal) {
            manageEventsModal.addEventListener('click', (e) => {
                if (e.target === manageEventsModal || e.target.classList.contains('modal-overlay')) {
                    this.hideModal('manage-events-modal');
                }
            });
        }

        if (qrModal) {
            qrModal.addEventListener('click', (e) => {
                if (e.target === qrModal || e.target.classList.contains('modal-overlay')) {
                    this.hideModal('qr-modal');
                }
            });
        }
    }

    bindMobileEvents() {
        const mobileToggle = document.getElementById('mobile-toggle');
        const sidebar = document.getElementById('sidebar');

        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', () => {
                sidebar.classList.toggle('active');
                document.body.style.overflow = sidebar.classList.contains('active') ? 'hidden' : '';
            });

            // Close sidebar on nav link click (mobile)
            const navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768) {
                        sidebar.classList.remove('active');
                        document.body.style.overflow = '';
                    }
                });
            });
        }
    }

    bindFormEvents() {
        const eventForm = document.getElementById('event-form');
        if (eventForm) {
            eventForm.addEventListener('submit', (e) => {
                this.handleEventFormSubmit(e);
            });

            // Auto-generate credentials
            const titleField = eventForm.querySelector('[name="eventTitle"]');
            const credentialsField = eventForm.querySelector('[name="credentials"]');
            
            if (titleField && credentialsField) {
                titleField.addEventListener('input', () => {
                    const title = titleField.value.trim();
                    if (title) {
                        const credentials = this.generateEventCredentials(title);
                        credentialsField.value = credentials;
                    } else {
                        credentialsField.value = '';
                    }
                });
            }
        }
    }

    bindButtonEvents() {
        // Add user button
        const addUserBtn = document.getElementById('add-user-btn');
        if (addUserBtn) {
            addUserBtn.addEventListener('click', () => {
                this.showNotification('User management functionality coming soon!', 'info');
            });
        }

        // Settings buttons
        const settingsButtons = document.querySelectorAll('.settings-grid .btn');
        settingsButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (btn.textContent.includes('Copy')) {
                    this.copyToClipboard('https://scheduleflow.com/ref/admin');
                } else {
                    this.showNotification('Settings updated successfully!', 'success');
                }
            });
        });
    }

    navigateToSection(section) {
        // Update active states
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === section) {
                link.classList.add('active');
            }
        });

        // Hide all sections
        const sections = document.querySelectorAll('.content-section');
        sections.forEach(sec => {
            sec.classList.remove('active');
        });

        // Show target section
        const targetSection = document.getElementById(`${section}-section`);
        if (targetSection) {
            targetSection.classList.add('active');
            this.currentSection = section;
        }

        // Close mobile sidebar
        const sidebar = document.getElementById('sidebar');
        if (sidebar && window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    updateWelcomeMessage() {
        const welcomeTitle = document.querySelector('.welcome-title');
        if (welcomeTitle) {
            welcomeTitle.textContent = `Welcome ${this.currentUser.firstName}`;
        }
    }

    showManageEventsModal() {
        const modal = document.getElementById('manage-events-modal');
        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
            
            // Reset form
            const form = document.getElementById('event-form');
            if (form) {
                form.reset();
            }

            // Focus first input
            const firstInput = modal.querySelector('input, select, textarea');
            if (firstInput) {
                setTimeout(() => firstInput.focus(), 100);
            }
        }
    }

    hideModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = '';
        }
    }

    handleEventFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const eventData = this.extractEventData(formData);
        
        // Validate form
        if (!this.validateEventForm(eventData)) {
            return;
        }

        // Show loading state
        const submitBtn = e.target.querySelector('[type="submit"]');
        if (submitBtn) {
            submitBtn.classList.add('btn--loading');
            submitBtn.disabled = true;
            submitBtn.textContent = 'Creating Event...';
        }

        // Simulate processing
        setTimeout(() => {
            // Create event
            const newEvent = {
                id: this.generateEventId(),
                ...eventData,
                status: 'active',
                createdAt: new Date()
            };

            this.events.push(newEvent);
            this.renderEvents();
            
            // Hide events modal and show QR modal
            this.hideModal('manage-events-modal');
            this.showQRModal(newEvent);

            // Remove loading state
            if (submitBtn) {
                submitBtn.classList.remove('btn--loading');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Create Event & Generate QR';
            }

            this.showNotification('Event created successfully!', 'success');
        }, 1500);
    }

    extractEventData(formData) {
        return {
            title: formData.get('eventTitle'),
            type: formData.get('eventType'),
            startDate: formData.get('startDate'),
            endDate: formData.get('endDate'),
            startTime: formData.get('startTime'),
            endTime: formData.get('endTime'),
            venue: formData.get('venue'),
            organizer: formData.get('organizer'),
            president: {
                name: formData.get('presidentName') || '',
                contact: formData.get('presidentContact') || ''
            },
            vicePresident: {
                name: formData.get('vicePresidentName') || '',
                contact: formData.get('vicePresidentContact') || ''
            },
            description: formData.get('description') || '',
            registrationFee: parseFloat(formData.get('registrationFee')) || 0,
            credentials: formData.get('credentials') || this.generateEventCredentials(formData.get('eventTitle'))
        };
    }

    validateEventForm(eventData) {
        const required = ['title', 'startDate', 'endDate', 'startTime', 'endTime', 'venue', 'organizer'];
        
        for (const field of required) {
            if (!eventData[field] || eventData[field].trim() === '') {
                this.showNotification(`Please fill in the ${field.replace(/([A-Z])/g, ' $1').toLowerCase()} field.`, 'error');
                return false;
            }
        }

        // Validate date range
        const startDate = new Date(eventData.startDate);
        const endDate = new Date(eventData.endDate);
        
        if (startDate > endDate) {
            this.showNotification('End date must be after start date.', 'error');
            return false;
        }

        // Validate time range for same day events
        if (eventData.startDate === eventData.endDate) {
            const startTime = eventData.startTime;
            const endTime = eventData.endTime;
            
            if (startTime >= endTime) {
                this.showNotification('End time must be after start time.', 'error');
                return false;
            }
        }

        return true;
    }

    generateEventCredentials(title) {
        if (!title) return '';
        
        const cleaned = title.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
        
        return `${cleaned.substring(0, 4)}${year}${random}`;
    }

    generateEventId() {
        return 'evt' + Date.now().toString().substring(-6);
    }

    showQRModal(eventData) {
        const modal = document.getElementById('qr-modal');
        const canvas = document.getElementById('qr-canvas');
        const title = document.getElementById('qr-event-title');
        const details = document.getElementById('qr-event-details');

        if (!modal || !canvas) return;

        // Update content
        if (title) {
            title.textContent = eventData.title;
        }

        if (details) {
            details.innerHTML = `
                <strong>Date:</strong> ${this.formatDateRange(eventData.startDate, eventData.endDate)}<br>
                <strong>Time:</strong> ${eventData.startTime} - ${eventData.endTime}<br>
                <strong>Venue:</strong> ${eventData.venue}<br>
                <strong>Organizer:</strong> ${eventData.organizer}<br>
                <strong>Credentials:</strong> ${eventData.credentials}
            `;
        }

        // Generate QR Code
        const qrData = this.generateQRData(eventData);
        
        // Set canvas size
        canvas.width = 300;
        canvas.height = 300;
        
        if (typeof QRCode !== 'undefined' && QRCode.toCanvas) {
            QRCode.toCanvas(canvas, qrData, {
                width: 300,
                height: 300,
                colorDark: '#1D3B3F',
                colorLight: '#FFFFFF',
                correctLevel: QRCode.CorrectLevel.H,
                margin: 2
            }, (error) => {
                if (error) {
                    console.error('QR Code generation failed:', error);
                    this.showFallbackQR(canvas, eventData);
                }
                modal.classList.remove('hidden');
                document.body.style.overflow = 'hidden';
            });
        } else {
            // Fallback QR generation
            this.showFallbackQR(canvas, eventData);
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    showFallbackQR(canvas, eventData) {
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create a visual QR-like pattern
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 300, 300);
        
        // Add border
        ctx.strokeStyle = '#1D3B3F';
        ctx.lineWidth = 2;
        ctx.strokeRect(1, 1, 298, 298);
        
        // Create pattern blocks
        ctx.fillStyle = '#1D3B3F';
        
        // Corner markers
        this.drawQRCornerMarker(ctx, 20, 20);
        this.drawQRCornerMarker(ctx, 220, 20);
        this.drawQRCornerMarker(ctx, 20, 220);
        
        // Random pattern to simulate QR code
        for (let i = 0; i < 15; i++) {
            for (let j = 0; j < 15; j++) {
                if (Math.random() > 0.5) {
                    const x = 60 + (i * 12);
                    const y = 60 + (j * 12);
                    ctx.fillRect(x, y, 10, 10);
                }
            }
        }
        
        // Add event info in center
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(120, 120, 60, 60);
        ctx.fillStyle = '#1D3B3F';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SF', 150, 140);
        ctx.fillText('EVENT', 150, 155);
        ctx.fillText(eventData.credentials.substring(0, 4), 150, 170);
        
        console.log('Generated fallback QR code pattern');
    }

    drawQRCornerMarker(ctx, x, y) {
        // Outer square
        ctx.fillRect(x, y, 50, 50);
        // Inner white square
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(x + 10, y + 10, 30, 30);
        // Center black square
        ctx.fillStyle = '#1D3B3F';
        ctx.fillRect(x + 20, y + 20, 10, 10);
    }

    generateQRData(eventData) {
        const eventInfo = {
            title: eventData.title,
            date: this.formatDateRange(eventData.startDate, eventData.endDate),
            time: `${eventData.startTime} - ${eventData.endTime}`,
            venue: eventData.venue,
            organizer: eventData.organizer,
            credentials: eventData.credentials,
            website: 'https://scheduleflow.com',
            registrationFee: eventData.registrationFee
        };

        // Create JSON format for better QR code scanning
        const qrData = {
            event: eventInfo.title,
            date: eventInfo.date,
            time: eventInfo.time,
            venue: eventInfo.venue,
            organizer: eventInfo.organizer,
            id: eventInfo.credentials,
            website: eventInfo.website
        };

        if (eventInfo.registrationFee > 0) {
            qrData.fee = `$${eventInfo.registrationFee}`;
        }

        return JSON.stringify(qrData, null, 2);
    }

    formatDateRange(startDate, endDate) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        const options = { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        };
        
        if (startDate === endDate) {
            return start.toLocaleDateString('en-US', options);
        } else {
            return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
        }
    }

    downloadQRCode() {
        const canvas = document.getElementById('qr-canvas');
        if (!canvas) {
            this.showNotification('QR code not found', 'error');
            return;
        }

        try {
            // Create download link
            const link = document.createElement('a');
            const eventTitle = document.getElementById('qr-event-title').textContent || 'event';
            const timestamp = new Date().toISOString().slice(0, 10);
            
            link.download = `${eventTitle.replace(/\s+/g, '-').toLowerCase()}-qr-${timestamp}.png`;
            link.href = canvas.toDataURL('image/png', 1.0);
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            this.showNotification('QR Code downloaded successfully!', 'success');
        } catch (error) {
            console.error('Download failed:', error);
            this.showNotification('Failed to download QR code', 'error');
        }
    }

    renderEvents() {
        const eventsList = document.getElementById('events-list');
        if (!eventsList) return;

        if (this.events.length === 0) {
            eventsList.innerHTML = `
                <div class="empty-state">
                    <p>No events created yet. Create your first event to get started!</p>
                </div>
            `;
            return;
        }

        eventsList.innerHTML = this.events.map(event => `
            <div class="event-item" data-event-id="${event.id}">
                <div class="event-info">
                    <h4>${this.escapeHtml(event.title)}</h4>
                    <p>${this.formatDateRange(event.startDate, event.endDate)} • ${this.escapeHtml(event.venue)}</p>
                    <span class="event-status ${event.status}">${this.capitalizeFirst(event.status)}</span>
                </div>
                <div class="event-actions">
                    <button class="btn btn--sm btn--outline" onclick="app.editEvent('${event.id}')">Edit</button>
                    <button class="btn btn--sm btn--primary" onclick="app.viewEventQR('${event.id}')">View QR</button>
                </div>
            </div>
        `).join('');
    }

    editEvent(eventId) {
        this.showNotification('Event editing functionality coming soon!', 'info');
    }

    viewEventQR(eventId) {
        const event = this.events.find(e => e.id === eventId);
        if (event) {
            this.showQRModal(event);
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                this.showNotification('Copied to clipboard!', 'success');
            }).catch(() => {
                this.fallbackCopyTextToClipboard(text);
            });
        } else {
            this.fallbackCopyTextToClipboard(text);
        }
    }

    fallbackCopyTextToClipboard(text) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            document.execCommand('copy');
            this.showNotification('Copied to clipboard!', 'success');
        } catch (err) {
            this.showNotification('Failed to copy to clipboard', 'error');
        }
        
        document.body.removeChild(textArea);
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notif => notif.remove());

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification--${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">
                    ${this.getNotificationIcon(type)}
                </div>
                <span class="notification-message">${this.escapeHtml(message)}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" x2="6" y1="6" y2="18"/>
                        <line x1="6" x2="18" y1="6" y2="18"/>
                    </svg>
                </button>
            </div>
        `;

        // Add styles if not exist
        if (!document.querySelector('#notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'notification-styles';
            styles.textContent = `
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 1002;
                    max-width: 400px;
                    background: rgba(255, 255, 255, 0.95);
                    backdrop-filter: blur(10px);
                    border-radius: var(--radius-base);
                    box-shadow: var(--shadow-lg);
                    animation: slideInRight 0.3s ease-out;
                    border-left: 4px solid var(--color-primary);
                }
                .notification--success { border-left-color: var(--color-success); }
                .notification--error { border-left-color: var(--color-error); }
                .notification--warning { border-left-color: var(--color-warning); }
                .notification--info { border-left-color: var(--color-info); }
                .notification-content {
                    display: flex;
                    align-items: center;
                    gap: var(--space-12);
                    padding: var(--space-16);
                }
                .notification-icon {
                    flex-shrink: 0;
                    color: var(--color-primary);
                }
                .notification--success .notification-icon { color: var(--color-success); }
                .notification--error .notification-icon { color: var(--color-error); }
                .notification--warning .notification-icon { color: var(--color-warning); }
                .notification--info .notification-icon { color: var(--color-info); }
                .notification-message {
                    flex: 1;
                    color: var(--color-text);
                    font-weight: var(--font-weight-medium);
                }
                .notification-close {
                    background: none;
                    border: none;
                    color: var(--color-text-secondary);
                    cursor: pointer;
                    padding: var(--space-4);
                    border-radius: var(--radius-sm);
                    transition: all var(--duration-fast) var(--ease-standard);
                }
                .notification-close:hover {
                    background: var(--color-bg-2);
                    color: var(--color-text);
                }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @media (max-width: 480px) {
                    .notification { 
                        top: 10px; 
                        right: 10px; 
                        left: 10px; 
                        max-width: none; 
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22,4 12,14.01 9,11.01"/></svg>',
            error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" x2="9" y1="9" y2="15"/><line x1="9" x2="15" y1="9" y2="15"/></svg>',
            warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" x2="12" y1="9" y2="13"/><line x1="12" x2="12.01" y1="17" y2="17"/></svg>',
            info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>'
        };
        return icons[type] || icons.info;
    }

    handleKeyboardShortcuts(e) {
        // Escape key - close modals
        if (e.key === 'Escape') {
            this.hideModal('manage-events-modal');
            this.hideModal('qr-modal');
        }

        // Ctrl/Cmd + K - Quick navigation (future feature)
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            this.showNotification('Quick navigation coming soon!', 'info');
        }
    }

    handleResize() {
        // Close mobile sidebar on resize to desktop
        if (window.innerWidth > 768) {
            const sidebar = document.getElementById('sidebar');
            if (sidebar) {
                sidebar.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    }

    initAnimations() {
        // Initialize intersection observer for animations
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('animate-in');
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });

            // Observe elements for animation
            const animatableElements = document.querySelectorAll('.action-card, .card, .event-item');
            animatableElements.forEach(el => {
                observer.observe(el);
            });
        }
    }

    // Utility functions
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text || '';
        return div.innerHTML;
    }

    capitalizeFirst(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // Public methods for global access
    static getInstance() {
        if (!window.scheduleFlowApp) {
            window.scheduleFlowApp = new ScheduleFlowApp();
        }
        return window.scheduleFlowApp;
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    window.app = ScheduleFlowApp.getInstance();
});

// Export for global access
window.ScheduleFlowApp = ScheduleFlowApp;