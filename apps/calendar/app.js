// Zeno Calendar Application

const ZenoCalendar = {
    // State
    state: {
        currentDate: new Date(),
        currentView: 'week',
        events: [],
        calendars: [
            { id: 'personal', name: 'Personal', color: '#FF6B9D', visible: true },
            { id: 'work', name: 'Work', color: '#00F5FF', visible: true },
            { id: 'family', name: 'Family', color: '#FF9E00', visible: true }
        ],
        editingEvent: null,
        selectedDate: null
    },

    // Initialize
    init() {
        console.log('📅 Zeno Calendar Initializing...');
        
        // Load events from localStorage
        this.loadEvents();
        
        // Setup event listeners
        this.setupEventListeners();
        
        // Render initial view
        this.render();
        
        // Update current time indicator
        this.updateCurrentTime();
        setInterval(() => this.updateCurrentTime(), 60000); // Update every minute
        
        console.log('✅ Zeno Calendar Ready');
    },

    // Load events from localStorage
    loadEvents() {
        const savedEvents = localStorage.getItem('zeno-calendar-events');
        
        if (savedEvents) {
            this.state.events = JSON.parse(savedEvents);
        } else {
            // Create mock events
            this.state.events = [
                {
                    id: '1',
                    title: 'Team Planning',
                    description: 'Weekly team planning session',
                    start: this.getDateString(new Date().setHours(14, 0, 0, 0)), // Today 2:00 PM
                    end: this.getDateString(new Date().setHours(15, 0, 0, 0)),   // Today 3:00 PM
                    location: 'Conference Room A',
                    calendar: 'work',
                    color: '#00F5FF'
                },
                {
                    id: '2',
                    title: 'Lunch with Alex',
                    description: 'Catch up over lunch',
                    start: this.getDateString(new Date().setHours(12, 30, 0, 0)), // Today 12:30 PM
                    end: this.getDateString(new Date().setHours(13, 30, 0, 0)),   // Today 1:30 PM
                    location: 'Downtown Cafe',
                    calendar: 'personal',
                    color: '#FF6B9D'
                },
                {
                    id: '3',
                    title: 'Design Review',
                    description: 'Review new dashboard designs',
                    start: this.getDateString(new Date(Date.now() + 86400000).setHours(16, 30, 0, 0)), // Tomorrow 4:30 PM
                    end: this.getDateString(new Date(Date.now() + 86400000).setHours(17, 30, 0, 0)),   // Tomorrow 5:30 PM
                    location: 'Zoom Meeting',
                    calendar: 'work',
                    color: '#00F5FF'
                },
                {
                    id: '4',
                    title: 'Family Dinner',
                    description: 'Weekly family dinner',
                    start: this.getDateString(new Date(Date.now() + 86400000).setHours(19, 0, 0, 0)), // Tomorrow 7:00 PM
                    end: this.getDateString(new Date(Date.now() + 86400000).setHours(21, 0, 0, 0)),   // Tomorrow 9:00 PM
                    location: 'Home',
                    calendar: 'family',
                    color: '#FF9E00'
                }
            ];
            
            this.saveEvents();
        }
    },

    // Save events to localStorage
    saveEvents() {
        localStorage.setItem('zeno-calendar-events', JSON.stringify(this.state.events));
    },

    // Get date string in YYYY-MM-DDTHH:mm format
    getDateString(date) {
        const d = new Date(date);
        return d.toISOString().slice(0, 16);
    },

    // Setup event listeners
    setupEventListeners() {
        // Navigation buttons
        document.getElementById('prev-week').addEventListener('click', () => this.navigate(-1));
        document.getElementById('next-week').addEventListener('click', () => this.navigate(1));
        
        // Today button
        document.querySelector('.today-btn').addEventListener('click', () => this.goToToday());
        
        // View switcher
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const view = e.target.dataset.view;
                this.switchView(view);
            });
        });
        
        // New event button
        document.querySelector('.new-event-btn').addEventListener('click', () => {
            this.openEventModal();
        });
        
        // Mini calendar navigation
        document.querySelector('.mini-prev').addEventListener('click', () => this.navigateMiniCalendar(-1));
        document.querySelector('.mini-next').addEventListener('click', () => this.navigateMiniCalendar(1));
        
        // Mini calendar day clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.mini-day')) {
                const day = parseInt(e.target.closest('.mini-day').textContent);
                this.selectMiniCalendarDay(day);
            }
        });
        
        // Calendar visibility toggles
        document.querySelectorAll('.calendar-item input').forEach((checkbox, index) => {
            checkbox.addEventListener('change', (e) => {
                this.state.calendars[index].visible = e.target.checked;
                this.render();
            });
        });
        
        // Event modal
        document.querySelector('.close-event-modal').addEventListener('click', () => this.closeEventModal());
        document.querySelector('.cancel-event').addEventListener('click', () => this.closeEventModal());
        document.querySelector('.save-event').addEventListener('click', () => this.saveEvent());
        document.querySelector('.delete-event').addEventListener('click', () => this.deleteEvent());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + N for new event
            if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
                e.preventDefault();
                this.openEventModal();
            }
            
            // Escape to close modals
            if (e.key === 'Escape') {
                this.closeEventModal();
                this.closeEventDetail();
            }
            
            // Arrow keys for navigation
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.navigate(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.navigate(1);
            } else if (e.key === 't') {
                e.preventDefault();
                this.goToToday();
            }
        });
        
        // Event clicks (delegated)
        document.addEventListener('click', (e) => {
            const eventElement = e.target.closest('.week-event, .month-event, .day-event, .agenda-event, .upcoming-event');
            if (eventElement) {
                const eventId = eventElement.dataset.id;
                this.openEventDetail(eventId);
            }
            
            // Day slot clicks for quick event creation
            const daySlot = e.target.closest('.day-slot');
            if (daySlot && this.state.currentView === 'week') {
                const dayIndex = parseInt(daySlot.parentElement.dataset.dayIndex);
                const hourIndex = parseInt(daySlot.dataset.hourIndex);
                this.quickCreateEvent(dayIndex, hourIndex);
            }
        });
    },

    // Navigate calendar
    navigate(direction) {
        const amount = this.getNavigationAmount();
        const newDate = new Date(this.state.currentDate);
        
        switch (this.state.currentView) {
            case 'week':
                newDate.setDate(newDate.getDate() + (direction * 7));
                break;
            case 'month':
                newDate.setMonth(newDate.getMonth() + direction);
                break;
            case 'day':
                newDate.setDate(newDate.getDate() + direction);
                break;
        }
        
        this.state.currentDate = newDate;
        this.render();
    },

    // Get navigation amount based on current view
    getNavigationAmount() {
        switch (this.state.currentView) {
            case 'week': return 7;
            case 'month': return 1;
            case 'day': return 1;
            default: return 7;
        }
    },

    // Go to today
    goToToday() {
        this.state.currentDate = new Date();
        this.render();
        this.showToast('Jumped to today', 'success');
    },

    // Switch view
    switchView(view) {
        this.state.currentView = view;
        
        // Update active button
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === view) {
                btn.classList.add('active');
            }
        });
        
        // Update active view
        document.querySelectorAll('.calendar-view').forEach(viewEl => {
            viewEl.classList.remove('active');
            if (viewEl.classList.contains(`${view}-view`)) {
                viewEl.classList.add('active');
            }
        });
        
        this.render();
    },

    // Navigate mini calendar
    navigateMiniCalendar(direction) {
        const newDate = new Date(this.state.currentDate);
        newDate.setMonth(newDate.getMonth() + direction);
        this.state.currentDate = newDate;
        this.renderMiniCalendar();
    },

    // Select mini calendar day
    selectMiniCalendarDay(day) {
        const newDate = new Date(this.state.currentDate);
        newDate.setDate(day);
        this.state.currentDate = newDate;
        this.state.currentView = 'day';
        this.switchView('day');
    },

    // Open event modal
    openEventModal(event = null) {
        this.state.editingEvent = event;
        const modal = document.querySelector('.event-modal');
        const form = modal.querySelector('.event-modal-content');
        
        if (event) {
            // Edit existing event
            form.querySelector('.event-modal-header h3').textContent = 'Edit Event';
            form.querySelector('.event-title').value = event.title;
            form.querySelector('.event-date').value = event.start.slice(0, 10);
            form.querySelector('.event-start-time').value = event.start.slice(11, 16);
            form.querySelector('.event-end-time').value = event.end.slice(11, 16);
            form.querySelector('.event-location').value = event.location || '';
            form.querySelector('.event-description').value = event.description || '';
            form.querySelector('.event-calendar').value = event.calendar || 'personal';
            form.querySelector('.delete-event').style.display = 'block';
        } else {
            // Create new event
            form.querySelector('.event-modal-header h3').textContent = 'New Event';
            form.querySelector('.event-title').value = '';
            form.querySelector('.event-date').value = this.state.currentDate.toISOString().slice(0, 10);
            form.querySelector('.event-start-time').value = '14:00';
            form.querySelector('.event-end-time').value = '15:00';
            form.querySelector('.event-location').value = '';
            form.querySelector('.event-description').value = '';
            form.querySelector('.event-calendar').value = 'personal';
            form.querySelector('.delete-event').style.display = 'none';
        }
        
        modal.classList.add('active');
        form.querySelector('.event-title').focus();
    },

    // Close event modal
    closeEventModal() {
        document.querySelector('.event-modal').classList.remove('active');
        this.state.editingEvent = null;
    },

    // Save event
    saveEvent() {
        const form = document.querySelector('.event-modal-content');
        const title = form.querySelector('.event-title').value.trim();
        const date = form.querySelector('.event-date').value;
        const startTime = form.querySelector('.event-start-time').value;
        const endTime = form.querySelector('.event-end-time').value;
        const location = form.querySelector('.event-location').value.trim();
        const description = form.querySelector('.event-description').value.trim();
        const calendar = form.querySelector('.event-calendar').value;
        
        if (!title) {
            this.showToast('Please enter a title', 'warning');
            return;
        }
        
        const calendarObj = this.state.calendars.find(c => c.id === calendar);
        
        const eventData = {
            id: this.state.editingEvent ? this.state.editingEvent.id : Date.now().toString(),
            title: title,
            description: description,
            start: `${date}T${startTime}`,
            end: `${date}T${endTime}`,
            location: location,
            calendar: calendar,
            color: calendarObj ? calendarObj.color : '#FF6B9D'
        };
        
        if (this.state.editingEvent) {
            // Update existing event
            const index = this.state.events.findIndex(e => e.id === this.state.editingEvent.id);
            if (index !== -1) {
                this.state.events[index] = eventData;
            }
            this.showToast('Event updated', 'success');
        } else {
            // Add new event
            this.state.events.push(eventData);
            this.showToast('Event created', 'success');
        }
        
        this.saveEvents();
        this.closeEventModal();
        this.render();
    },

    // Delete event
    deleteEvent() {
        if (!this.state.editingEvent) return;
        
        if (confirm('Delete this event?')) {
            this.state.events = this.state.events.filter(e => e.id !== this.state.editingEvent.id);
            this.saveEvents();
            this.closeEventModal();
            this.render();
            this.showToast('Event deleted', 'success');
        }
    },

    // Open event detail
    openEventDetail(eventId) {
        const event = this.state.events.find(e => e.id === eventId);
        if (!event) return;
        
        const modal = document.querySelector('.event-detail-modal');
        const content = modal.querySelector('.event-detail-content');
        
        const startDate = new Date(event.start);
        const endDate = new Date(event.end);
        const calendar = this.state.calendars.find(c => c.id === event.calendar);
        
        content.innerHTML = `
            <div style="margin-bottom: 24px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
                    <h3 style="margin: 0; font-size: 20px; color: var(--zeno-text-primary);">${event.title}</h3>
                    <button class="close-event-detail" style="background: none; border: none; color: var(--zeno-text-tertiary); cursor: pointer; width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; transition: all 0.2s;">
                        <span data-lucide="x"></span>
                    </button>
                </div>
                <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                    <span class="calendar-color" style="width: 12px; height: 12px; border-radius: 50%; background: ${event.color};"></span>
                    <span style="color: var(--zeno-text-secondary); font-size: 14px;">${calendar ? calendar.name : 'Calendar'}</span>
                </div>
            </div>
            
            <div style="display: flex; flex-direction: column; gap: 16px;">
                <div>
                    <div style="font-size: 12px; color: var(--zeno-text-tertiary); margin-bottom: 4px;">Time</div>
                    <div style="color: var(--zeno-text-primary);">
                        ${startDate.toLocaleDateString()} 
                        ${startDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                        ${endDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                </div>
                
                ${event.location ? `
                <div>
                    <div style="font-size: 12px; color: var(--zeno-text-tertiary); margin-bottom: 4px;">Location</div>
                    <div style="color: var(--zeno-text-primary);">${event.location}</div>
                </div>
                ` : ''}
                
                ${event.description ? `
                <div>
                    <div style="font-size: 12px; color: var(--zeno-text-tertiary); margin-bottom: 4px;">Description</div>
                    <div style="color: var(--zeno-text-primary); white-space: pre-wrap;">${event.description}</div>
                </div>
                ` : ''}
            </div>
            
            <div style="margin-top: 32px; display: flex; gap: 12px;">
                <button class="btn-outline edit-event" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;">
                    <span data-lucide="edit-2"></span> Edit
                </button>
                <button class="btn-outline delete-event-detail" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px; color: var(--zeno-error); border-color: var(--zeno-error);">
                    <span data-lucide="trash-2"></span> Delete
                </button>
            </div>
        `;
        
        // Initialize icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
        
        // Add event listeners
        content.querySelector('.close-event-detail').addEventListener('click', () => this.closeEventDetail());
        content.querySelector('.edit-event').addEventListener('click', () => {
            this.closeEventDetail();
            this.openEventModal(event);
        });
        content.querySelector('.delete-event-detail').addEventListener('click', () => {
            if (confirm('Delete this event?')) {
                this.state.events = this.state.events.filter(e => e.id !== eventId);
                this.saveEvents();
                this.closeEventDetail();
                this.render();
                this.showToast('Event deleted', 'success');
            }
        });
        
        modal.classList.add('active');
    },

    // Close event detail
    closeEventDetail() {
        document.querySelector('.event-detail-modal').classList.remove('active');
    },

    // Quick create event from day slot click
    quickCreateEvent(dayIndex, hourIndex) {
        const date = new Date(this.state.currentDate);
        date.setDate(date.getDate() + dayIndex);
        date.setHours(hourIndex, 0, 0, 0);
        
        const event = {
            start: this.getDateString(date),
            end: this.getDateString(date.getTime() + 3600000) // +1 hour
        };
        
        this.openEventModal(event);
    },

    // Update current time indicator
    updateCurrentTime() {
        if (this.state.currentView === 'week') {
            this.updateWeekViewCurrentTime();
        }
    },

    updateWeekViewCurrentTime() {
        // Remove existing current time indicators
        document.querySelectorAll('.current-time-indicator').forEach(el => el.remove());
        
        const now = new Date();
        const currentDay = now.getDay();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Check if current day is in visible week
        const weekStart = new Date(this.state.currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        
        if (now >= weekStart && now <= weekEnd) {
            const dayColumn = document.querySelector(`.day-column[data-day-index="${currentDay}"]`);
            if (dayColumn) {
                const timePosition = (currentHour * 60 + currentMinute) / 1440 * 100; // Percentage of day
                const indicator = document.createElement('div');
                indicator.className = 'current-time-indicator';
                indicator.style.cssText = `
                    position: absolute;
                    top: ${timePosition}%;
                    left: 0;
                    right: 0;
                    height: 2px;
                    background-color: var(--zeno-error);
                    z-index: 10;
                `;
                
                const dot = document.createElement('div');
                dot.style.cssText = `
                    position: absolute;
                    left: -4px;
                    top: -3px;
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background-color: var(--zeno-error);
                `;
                indicator.appendChild(dot);
                
                dayColumn.querySelector('.day-slots').appendChild(indicator);
            }
        }
    },

    // Render everything
    render() {
        this.updateHeader();
        this.renderCurrentView();
        this.renderMiniCalendar();
        this.renderUpcomingEvents();
        this.updateCurrentTime();
    },

    // Update header with current date info
    updateHeader() {
        const date = this.state.currentDate;
        const monthYear = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const weekNumber = this.getWeekNumber(date);
        
        document.getElementById('current-month').textContent = monthYear;
        document.getElementById('current-week').textContent = `Week ${weekNumber}`;
    },

    // Get week number
    getWeekNumber(date) {
        const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
        const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
        return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    },

    // Render current view
    renderCurrentView() {
        switch (this.state.currentView) {
            case 'week':
                this.renderWeekView();
                break;
            case 'month':
                this.renderMonthView();
                break;
            case 'day':
                this.renderDayView();
                break;
            case 'agenda':
                this.renderAgendaView();
                break;
        }
    },

    // Render week view
    renderWeekView() {
        const container = document.querySelector('.week-view');
        const timeSlots = container.querySelector('.time-slots');
        const daysGrid = container.querySelector('.days-grid');
        
        // Generate time slots
        let timeSlotsHTML = '';
        for (let hour = 0; hour < 24; hour++) {
            timeSlotsHTML += `
                <div class="time-slot ${hour % 2 === 0 ? 'hour' : ''}">
                    ${hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
                </div>
            `;
        }
        timeSlots.innerHTML = timeSlotsHTML;
        
        // Generate days
        const weekStart = new Date(this.state.currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        
        let daysHTML = '';
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(day.getDate() + i);
            
            const isToday = this.isSameDay(day, new Date());
            const dayName = day.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNumber = day.getDate();
            
            daysHTML += `
                <div class="day-column ${isToday ? 'today' : ''}" data-day-index="${i}">
                    <div class="day-header">
                        <div class="day-name">${dayName}</div>
                        <div class="day-number">${dayNumber}</div>
                    </div>
                    <div class="day-slots">
                        ${Array.from({ length: 24 }, (_, hour) => `
                            <div class="day-slot" data-hour-index="${hour}"></div>
                        `).join('')}
                    </div>
                </div>
            `;
        }
        daysGrid.innerHTML = daysHTML;
        
        // Render events
        this.renderWeekEvents();
    },

    // Render week events
    renderWeekEvents() {
        const weekStart = new Date(this.state.currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        weekStart.setHours(0, 0, 0, 0);
        
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 7);
        
        const visibleEvents = this.getVisibleEvents().filter(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            return eventStart < weekEnd && eventEnd > weekStart;
        });
        
        visibleEvents.forEach(event => {
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            
            const dayIndex = (eventStart.getDay() + 7 - weekStart.getDay()) % 7;
            const startMinutes = eventStart.getHours() * 60 + eventStart.getMinutes();
            const endMinutes = eventEnd.getHours() * 60 + eventEnd.getMinutes();
            const durationMinutes = endMinutes - startMinutes;
            
            const top = (startMinutes / 1440) * 100;
            const height = (durationMinutes / 1440) * 100;
            
            const dayColumn = document.querySelector(`.day-column[data-day-index="${dayIndex}"] .day-slots`);
            if (dayColumn) {
                const eventElement = document.createElement('div');
                eventElement.className = `week-event ${event.calendar}`;
                eventElement.dataset.id = event.id;
                eventElement.style.cssText = `
                    top: ${top}%;
                    height: ${height}%;
                    background-color: ${event.color}20;
                    border-left-color: ${event.color};
                `;
                
                eventElement.innerHTML = `
                    <div class="event-title">${event.title}</div>
                    <div class="event-time">
                        ${eventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                `;
                
                dayColumn.appendChild(eventElement);
            }
        });
    },

    // Render month view
    renderMonthView() {
        const container = document.querySelector('.month-view');
        const monthHeader = container.querySelector('.month-header');
        const monthGrid = container.querySelector('.month-grid');
        
        const date = new Date(this.state.currentDate);
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Update mini calendar month
        document.querySelector('.mini-month').textContent = 
            date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        // Generate weekday headers
        const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        let headerHTML = weekdays.map(day => `<div class="weekday-header">${day}</div>`).join('');
        monthHeader.innerHTML = headerHTML;
        
        // Generate month grid
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDay = firstDay.getDay();
        
        let gridHTML = '';
        let dayCount = 0;
        
        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            gridHTML += `<div class="month-day other-month">${day}</div>`;
            dayCount++;
        }
        
        // Current month days
        const today = new Date();
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isToday = this.isSameDay(currentDate, today);
            
            // Get events for this day
            const dayEvents = this.getVisibleEvents().filter(event => {
                const eventDate = new Date(event.start);
                return this.isSameDay(eventDate, currentDate);
            });
            
            let eventsHTML = dayEvents.slice(0, 3).map(event => `
                <div class="month-event" data-id="${event.id}" 
                     style="background-color: ${event.color}20; color: ${event.color};">
                    ${event.title}
                </div>
            `).join('');
            
            if (dayEvents.length > 3) {
                eventsHTML += `<div class="more-events">+${dayEvents.length - 3} more</div>`;
            }
            
            gridHTML += `
                <div class="month-day ${isToday ? 'today' : ''}">
                    <div class="day-number">${day}</div>
                    ${eventsHTML}
                </div>
            `;
            dayCount++;
        }
        
        // Next month days
        const nextMonthDays = 42 - dayCount; // 6 rows * 7 days
        for (let day = 1; day <= nextMonthDays; day++) {
            gridHTML += `<div class="month-day other-month">${day}</div>`;
        }
        
        monthGrid.innerHTML = gridHTML;
    },

    // Render day view
    renderDayView() {
        const container = document.querySelector('.day-view');
        const dayHeader = container.querySelector('.day-header');
        const dayTimeSlots = container.querySelector('.day-time-slots');
        
        const date = this.state.currentDate;
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' });
        const monthDay = date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
        
        dayHeader.innerHTML = `
            <h2>${dayName}</h2>
            <div class="day-name">${monthDay}</div>
        `;
        
        // Generate time slots
        let timeSlotsHTML = '';
        const dayEvents = this.getVisibleEvents().filter(event => {
            const eventDate = new Date(event.start);
            return this.isSameDay(eventDate, date);
        });
        
        // Sort events by start time
        dayEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
        
        for (let hour = 0; hour < 24; hour++) {
            const hourEvents = dayEvents.filter(event => {
                const eventHour = new Date(event.start).getHours();
                return eventHour === hour;
            });
            
            let eventsHTML = '';
            hourEvents.forEach(event => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                const startMinutes = eventStart.getMinutes();
                const duration = (eventEnd - eventStart) / 60000; // minutes
                
                eventsHTML += `
                    <div class="day-event" data-id="${event.id}"
                         style="top: ${(startMinutes / 60) * 80}px; height: ${(duration / 60) * 80}px;
                                background-color: ${event.color}20; border-left-color: ${event.color};">
                        <strong>${event.title}</strong><br>
                        <small>${eventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</small>
                    </div>
                `;
            });
            
            const timeLabel = hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`;
            
            timeSlotsHTML += `
                <div class="day-time-slot">
                    <div class="day-time">${timeLabel}</div>
                    <div class="day-events">${eventsHTML}</div>
                </div>
            `;
        }
        
        dayTimeSlots.innerHTML = timeSlotsHTML;
    },

    // Render agenda view
    renderAgendaView() {
        const container = document.querySelector('.agenda-view');
        const agendaList = container.querySelector('.agenda-list');
        
        // Get events for next 7 days
        const startDate = new Date(this.state.currentDate);
        startDate.setHours(0, 0, 0, 0);
        
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7);
        
        const visibleEvents = this.getVisibleEvents().filter(event => {
            const eventDate = new Date(event.start);
            return eventDate >= startDate && eventDate < endDate;
        });
        
        // Group events by date
        const eventsByDate = {};
        visibleEvents.forEach(event => {
            const eventDate = new Date(event.start);
            const dateKey = eventDate.toDateString();
            
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            eventsByDate[dateKey].push(event);
        });
        
        // Sort dates
        const sortedDates = Object.keys(eventsByDate).sort((a, b) => new Date(a) - new Date(b));
        
        let agendaHTML = '';
        sortedDates.forEach(dateKey => {
            const date = new Date(dateKey);
            const dateFormatted = date.toLocaleDateString('en-US', { 
                weekday: 'long', 
                month: 'long', 
                day: 'numeric' 
            });
            
            // Sort events by time
            const dayEvents = eventsByDate[dateKey].sort((a, b) => 
                new Date(a.start) - new Date(b.start)
            );
            
            let eventsHTML = dayEvents.map(event => {
                const eventStart = new Date(event.start);
                const eventEnd = new Date(event.end);
                const timeString = eventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                
                return `
                    <div class="agenda-event" data-id="${event.id}">
                        <div class="agenda-time">${timeString}</div>
                        <div class="agenda-event-content">
                            <div class="agenda-event-title">${event.title}</div>
                            ${event.location ? `<div class="agenda-event-location">${event.location}</div>` : ''}
                        </div>
                    </div>
                `;
            }).join('');
            
            agendaHTML += `
                <div class="agenda-day">
                    <div class="agenda-date">${dateFormatted}</div>
                    ${eventsHTML}
                </div>
            `;
        });
        
        if (!sortedDates.length) {
            agendaHTML = `
                <div style="text-align: center; padding: 48px; color: var(--zeno-text-secondary);">
                    <span data-lucide="calendar" style="width: 64px; height: 64px; margin-bottom: 16px;"></span>
                    <h3 style="margin-bottom: 8px;">No upcoming events</h3>
                    <p>Create an event to get started</p>
                </div>
            `;
        }
        
        agendaList.innerHTML = agendaHTML;
        
        // Initialize icons
        if (window.lucide) {
            window.lucide.createIcons();
        }
    },

    // Render mini calendar
    renderMiniCalendar() {
        const container = document.querySelector('.mini-calendar-grid');
        const date = this.state.currentDate;
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Update month display
        document.querySelector('.mini-month').textContent = 
            date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        
        // Generate weekday headers
        const weekdays = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
        let calendarHTML = weekdays.map(day => `<div class="mini-day-header">${day}</div>`).join('');
        
        // Get first day of month and starting day
        const firstDay = new Date(year, month, 1);
        const startingDay = firstDay.getDay();
        
        // Previous month days
        const prevMonthLastDay = new Date(year, month, 0).getDate();
        for (let i = startingDay - 1; i >= 0; i--) {
            const day = prevMonthLastDay - i;
            calendarHTML += `<div class="mini-day other-month">${day}</div>`;
        }
        
        // Current month days
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();
        
        for (let day = 1; day <= daysInMonth; day++) {
            const currentDate = new Date(year, month, day);
            const isToday = this.isSameDay(currentDate, today);
            const isSelected = this.isSameDay(currentDate, this.state.currentDate);
            
            let className = 'mini-day';
            if (isToday) className += ' today';
            if (isSelected) className += ' selected';
            
            calendarHTML += `<div class="${className}">${day}</div>`;
        }
        
        // Next month days
        const totalCells = 42; // 6 rows * 7 days
        const remainingCells = totalCells - (startingDay + daysInMonth);
        for (let day = 1; day <= remainingCells; day++) {
            calendarHTML += `<div class="mini-day other-month">${day}</div>`;
        }
        
        container.innerHTML = calendarHTML;
    },

    // Render upcoming events
    renderUpcomingEvents() {
        const container = document.querySelector('.events-list');
        const now = new Date();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        tomorrow.setHours(0, 0, 0, 0);
        
        // Get events for today and tomorrow
        const upcomingEvents = this.getVisibleEvents()
            .filter(event => {
                const eventDate = new Date(event.start);
                return eventDate >= now && eventDate < new Date(tomorrow.getTime() + 86400000 * 2); // Next 2 days
            })
            .sort((a, b) => new Date(a.start) - new Date(b.start))
            .slice(0, 5); // Limit to 5 events
        
        if (upcomingEvents.length === 0) {
            container.innerHTML = `
                <div style="text-align: center; padding: 16px; color: var(--zeno-text-tertiary); font-size: 14px;">
                    No upcoming events
                </div>
            `;
            return;
        }
        
        let eventsHTML = upcomingEvents.map(event => {
            const eventStart = new Date(event.start);
            const timeString = eventStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const isToday = this.isSameDay(eventStart, now);
            
            return `
                <div class="upcoming-event ${event.calendar}" data-id="${event.id}"
                     style="border-left-color: ${event.color}">
                    <div class="upcoming-event-time">
                        ${isToday ? 'Today' : 'Tomorrow'} • ${timeString}
                    </div>
                    <div class="upcoming-event-title">${event.title}</div>
                </div>
            `;
        }).join('');
        
        container.innerHTML = eventsHTML;
    },

    // Get visible events based on calendar visibility
    getVisibleEvents() {
        const visibleCalendars = this.state.calendars.filter(cal => cal.visible).map(cal => cal.id);
        return this.state.events.filter(event => visibleCalendars.includes(event.calendar));
    },

    // Check if two dates are the same day
    isSameDay(date1, date2) {
        return date1.getDate() === date2.getDate() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getFullYear() === date2.getFullYear();
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
    document.addEventListener('DOMContentLoaded', () => ZenoCalendar.init());
} else {
    ZenoCalendar.init();
}

// Make available for debugging
window.ZenoCalendar = ZenoCalendar;