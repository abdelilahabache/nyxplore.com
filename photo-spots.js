class PhotoMap {
    constructor() {
      this.mapContainer = document.querySelector('.map-container');
      this.spots = [
        {
          name: "DUMBO",
          coords: { x: 35, y: 60 },
          image: "https://images.unsplash.com/photo-1549310786-a6bc7aece6a1"
        },
        // Add more spots...
      ];
      this.init();
    }
  
    init() {
      // Create clickable pins
      this.spots.forEach(spot => {
        const pin = document.createElement('div');
        pin.className = 'map-pin';
        pin.style.left = `${spot.coords.x}%`;
        pin.style.top = `${spot.coords.y}%`;
        pin.innerHTML = `<i class="fas fa-camera"></i>`;
        
        pin.addEventListener('click', () => this.showSpotDetails(spot));
        this.mapContainer.querySelector('.map-pins').appendChild(pin);
      });
    }
  
    showSpotDetails(spot) {
      const modal = document.createElement('div');
      modal.className = 'spot-modal';
      modal.innerHTML = `
        <div class="modal-content">
          <button class="close-modal"><i class="fas fa-times"></i></button>
          <img src="${spot.image}" alt="${spot.name}">
          <h3>${spot.name}</h3>
          <p>Best time to shoot: Golden hour</p>
          <button class="directions-btn">
            <i class="fas fa-directions"></i> Get Directions
          </button>
        </div>
      `;
      
      modal.querySelector('.close-modal').addEventListener('click', () => {
        modal.remove();
      });
      
      document.body.appendChild(modal);
    }
  }
  
  // Initialize
  new PhotoMap();