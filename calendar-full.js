document.addEventListener('DOMContentLoaded', function() {
    // Initialize FullCalendar
    const calendarEl = document.getElementById('full-calendar');
    const calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: 'dayGridMonth',
        headerToolbar: false, // Using our custom controls
        events: [
            // Sample events - replace with real data from your API
            {
                title: 'Broadway Night',
                start: '2023-05-15',
                end: '2023-05-15',
                extendedProps: {
                    category: 'theater',
                    location: 'Times Square'
                }
            },
            {
                title: 'Met Museum Tour',
                start: '2023-05-18',
                end: '2023-05-18',
                extendedProps: {
                    category: 'art',
                    location: 'The Met'
                }
            },

        ],
        eventContent: function(arg) {
            // Custom event rendering
            return {
                html: `<div class="fc-event-title">${arg.event.title}</div>
                       <div class="fc-event-location">${arg.event.extendedProps.location}</div>`
            };
        },
        eventDidMount: function(arg) {
            // Add category class for filtering
            if (arg.event.extendedProps.category) {
                arg.el.classList.add(arg.event.extendedProps.category);
            }
        }
    });
    
    calendar.render();
    
    // Custom view toggle
    const viewButtons = document.querySelectorAll('.view-btn');
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            switch(this.dataset.view) {
                case 'month':
                    calendar.changeView('dayGridMonth');
                    break;
                case 'week':
                    calendar.changeView('timeGridWeek');
                    break;
                case 'day':
                    calendar.changeView('timeGridDay');
                    break;
                case 'list':
                    calendar.changeView('listMonth');
                    break;
            }
        });
    });
    
    // Date navigation
    document.getElementById('calendar-prev').addEventListener('click', function() {
        calendar.prev();
        updateCalendarTitle();
    });
    
    document.getElementById('calendar-next').addEventListener('click', function() {
        calendar.next();
        updateCalendarTitle();
    });
    
    // Update calendar title based on current view
    function updateCalendarTitle() {
        const view = calendar.view;
        let title = '';
        
        if (view.type.includes('month')) {
            title = view.currentStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        } else if (view.type.includes('week')) {
            const start = view.currentStart;
            const end = new Date(start);
            end.setDate(end.getDate() + 6);
            
            title = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - 
                    ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`;
        } else if (view.type.includes('day')) {
            title = view.currentStart.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });
        } else {
            title = view.currentStart.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        }
        
        document.getElementById('calendar-title').textContent = title;
    }
    
    // Category filtering
    document.getElementById('category-filter').addEventListener('change', function() {
        const category = this.value;
        
        calendar.getEvents().forEach(event => {
            if (category === 'all' || !event.extendedProps.category || event.extendedProps.category === category) {
                event.setProp('display', 'auto');
            } else {
                event.setProp('display', 'none');
            }
        });
    });
    
    // Event submission
    document.getElementById('submit-event-btn').addEventListener('click', function() {
        // In production, this would open a form modal
        window.location.href = 'submit-event.html';
    });
    
    // Initial title update
    updateCalendarTitle();
    
    // Update title when view changes
    calendar.on('datesSet', function() {
        updateCalendarTitle();
    });
});