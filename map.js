document.addEventListener('DOMContentLoaded', function() {
    // Initialize map
    const map = L.map('nyc-map').setView([40.7128, -74.0060], 12);
    
    // Add base tile layer (OpenStreetMap)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Add traffic layer (simulated)
    const trafficLayer = L.layerGroup().addTo(map);
    
    // Simulate traffic data
    function simulateTraffic() {
      trafficLayer.clearLayers();
      
      // Add random traffic circles
      for (let i = 0; i < 15; i++) {
        const lat = 40.70 + Math.random() * 0.1;
        const lng = -74.00 + Math.random() * 0.1;
        const severity = Math.floor(Math.random() * 3);
        const colors = ['#2ecc71', '#f39c12', '#e74c3c'];
        
        L.circleMarker([lat, lng], {
          radius: 5 + severity * 3,
          fillColor: colors[severity],
          color: '#fff',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(trafficLayer);
      }
    }
    simulateTraffic();
    
    // Add transit layer (subway lines)
    const transitLayer = L.layerGroup();
    const subwayLines = {
      "A/C/E": { color: "#0039A6", coords: [[40.755, -73.986], [40.749, -73.988], [40.742, -73.989]] },
      "B/D/F/M": { color: "#FF6319", coords: [[40.756, -73.978], [40.753, -73.981], [40.750, -73.984]] },
      "1/2/3": { color: "#EE352E", coords: [[40.750, -73.991], [40.747, -73.993], [40.744, -73.995]] }
    };
    
    Object.entries(subwayLines).forEach(([line, data]) => {
      const polyline = L.polyline(data.coords, {color: data.color, weight: 6}).bindPopup(line);
      transitLayer.addLayer(polyline);
    });
    
    // Weather data (simplified)
    function updateWeather() {
      const weatherTypes = [
        { icon: '☀️', temp: Math.round(Math.random() * 10 + 70) },
        { icon: '⛅', temp: Math.round(Math.random() * 10 + 60) },
        { icon: '🌧️', temp: Math.round(Math.random() * 10 + 55) },
        { icon: '❄️', temp: Math.round(Math.random() * 10 + 30) }
      ];
      const weather = weatherTypes[Math.floor(Math.random() * weatherTypes.length)];
      
      document.querySelector('.weather-icon').textContent = weather.icon;
      document.querySelector('.weather-temp').textContent = `${weather.temp}°F`;
    }
    
    // Landmarks data
    const landmarks = {
      "Times Square": {
        coords: [40.7580, -73.9855],
        description: "The bustling commercial and entertainment hub known as 'The Crossroads of the World'.",
        photos: [
        "assets/images/times square/times-square-day.webp",
        "assets/images/times square/times-square-night.webp"
        ]
      },
      "Central Park": {
    coords: [40.7829, -73.9654],
    description: "An urban oasis with 843 acres of lawns, woods, and recreational facilities.",
    photos: [
        "assets/images/central-park/bethesda-terrace.webp",
        "assets/images/central-park/bow-bridge.webp"
    ]
},
      "Statue of Liberty": {
        coords: [40.6892, -74.0445],
        description: "A symbol of freedom gifted by France in 1886, located on Liberty Island.",
        photos: [
        "assets/images/Statue of Liberty/statue-gallery1.webp",
        "assets/images/Statue of Liberty/statue-gallery2.webp"
        ]
      }
    };
    
    // Add landmarks to map
    const landmarkMarkers = L.layerGroup();
    Object.entries(landmarks).forEach(([name, data]) => {
      const marker = L.marker(data.coords)
        .bindPopup(name)
        .on('click', () => showLocationInfo(name, data.description, data.photos));
      landmarkMarkers.addLayer(marker);
    });
    landmarkMarkers.addTo(map);
    
    // Show location info in panel
    function showLocationInfo(name, description, photos) {
      document.getElementById('location-title').textContent = name;
      document.getElementById('location-description').innerHTML = `<p>${description}</p>`;
      
      const gallery = document.getElementById('location-photos');
      gallery.innerHTML = photos.map(photo => 
        `<img src="${photo}" alt="${name}" loading="lazy">`
      ).join('');
      
      // Update weather when location changes
      updateWeather();
    }
    
    // Layer control buttons
    document.querySelectorAll('.map-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const layer = this.dataset.layer;
        this.classList.toggle('active');
        
        if (layer === 'traffic') {
          if (this.classList.contains('active')) {
            trafficLayer.addTo(map);
            simulateTraffic();
          } else {
            map.removeLayer(trafficLayer);
          }
        }
        else if (layer === 'transit') {
          if (this.classList.contains('active')) {
            transitLayer.addTo(map);
          } else {
            map.removeLayer(transitLayer);
          }
        }
        else if (layer === 'weather') {
          updateWeather();
        }
        else if (layer === 'landmarks') {
          if (this.classList.contains('active')) {
            landmarkMarkers.addTo(map);
          } else {
            map.removeLayer(landmarkMarkers);
          }
        }
      });
    });
    
    // Initial view showing NYC info
    showLocationInfo("New York City", 
      "Explore New York City using the map controls. Click on landmarks or enable layers to view more information.", 
      [
        "https://images.unsplash.com/photo-1499092346589-b9b6be3e94b2?w=400",
        "https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400"
      ]
    );

    const boroughs = {
      "Manhattan": { 
        coords: [[40.70, -74.02], [40.80, -74.02], [40.80, -73.93], [40.70, -73.93]],
        description: "The most densely populated borough and home to many famous landmarks." 
      },
      "Brooklyn": { 
        coords: [[40.65, -74.02], [40.70, -74.02], [40.70, -73.93], [40.65, -73.93]],
        description: "Known for its cultural diversity, art scene, and distinct neighborhoods." 
      }
    };
    
    Object.entries(boroughs).forEach(([name, data]) => {
      const polygon = L.polygon(data.coords, {
        color: '#3498db',
        fillColor: '#2980b9',
        fillOpacity: 0.1,
        weight: 2
      }).bindPopup(name)
       .on('click', () => showLocationInfo(name, data.description, []));
    });
  });