// Initialize seasonal tabs
document.querySelectorAll('.seasonal-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active class from all tabs and content
      document.querySelectorAll('.seasonal-tab, .seasonal-content').forEach(el => {
        el.classList.remove('active');
      });
      
      // Add active class to clicked tab and corresponding content
      tab.classList.add('active');
      const season = tab.dataset.season;
      document.getElementById(season).classList.add('active');
    });
  });
  
  // Interactive Calendar (simplified implementation)
  class EventCalendar {
    constructor(container) {
      this.container = document.querySelector(container);
      this.initCalendar();
    }
  
    initCalendar() {
      // This would be replaced with a real calendar library like FullCalendar
      this.container.innerHTML = `
        <div class="calendar-header">
          <button class="prev-month"><i class="fas fa-chevron-left"></i></button>
          <h3>December 2023</h3>
          <button class="next-month"><i class="fas fa-chevron-right"></i></button>
        </div>
        <div class="calendar-grid">
          ${Array.from({length: 31}, (_, i) => `
            <div class="calendar-day ${i === 24 ? 'has-event' : ''}">
              ${i + 1}
              ${i === 24 ? '<div class="event-tooltip">Winter Village Opens</div>' : ''}
            </div>
          `).join('')}
        </div>
      `;
      
      // Add event listeners for navigation
      this.container.querySelector('.prev-month').addEventListener('click', () => {
        console.log('Previous month');
      });
      
      this.container.querySelector('.next-month').addEventListener('click', () => {
        console.log('Next month');
      });
    }
  }
  
  // Initialize
  new EventCalendar('.calendar-wrapper');