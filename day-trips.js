class TripPlanner {
    constructor() {
      this.planner = document.querySelector('.planner-widget');
      this.init();
    }
  
    init() {
      this.planner.innerHTML = `
        <div class="planner-form">
          <div class="form-group">
            <label>Departure Date</label>
            <input type="date" id="trip-date">
          </div>
          <div class="form-group">
            <label>Transportation</label>
            <select id="transport-type">
              <option value="train">Train</option>
              <option value="car">Car</option>
              <option value="bus">Bus</option>
            </select>
          </div>
          <button id="generate-trip">Generate Trip Plan</button>
        </div>
        <div class="trip-results" style="display:none;">
          <h3>Your Perfect Day Trip</h3>
          <div class="trip-details"></div>
        </div>
      `;
  
      document.getElementById('generate-trip').addEventListener('click', this.generateTrip.bind(this));
    }
  
    generateTrip() {
      const date = document.getElementById('trip-date').value;
      const transport = document.getElementById('transport-type').value;
      
      // Mock trip generation - in reality would fetch from API
      const trips = {
        train: {
          title: "Cold Spring Day Trip",
          itinerary: [
            "9:00 AM - Metro-North from Grand Central",
            "10:30 AM - Explore Main Street shops",
            "12:00 PM - Lunch at Hudson Hil's",
            "2:00 PM - Hike Breakneck Ridge",
            "6:00 PM - Return train to NYC"
          ]
        },
        // Other trip options...
      };
  
      const results = document.querySelector('.trip-results');
      results.style.display = 'block';
      results.querySelector('.trip-details').innerHTML = `
        <h4>${trips[transport].title}</h4>
        <ul>
          ${trips[transport].itinerary.map(item => `<li>${item}</li>`).join('')}
        </ul>
      `;
    }
  }
  
  // Initialize
  new TripPlanner();