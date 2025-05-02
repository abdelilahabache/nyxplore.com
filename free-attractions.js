class AttractionFilter {
    constructor() {
      this.attractions = Array.from(document.querySelectorAll('.featured-card'));
      this.filters = {
        category: 'all',
        neighborhood: 'all'
      };
      this.init();
    }
  
    init() {
      // Category filter buttons
      document.querySelectorAll('[data-filter="category"]').forEach(btn => {
        btn.addEventListener('click', () => {
          this.filters.category = btn.dataset.value;
          this.applyFilters();
        });
      });
  
      // Neighborhood filter dropdown
      document.getElementById('neighborhood-filter').addEventListener('change', (e) => {
        this.filters.neighborhood = e.target.value;
        this.applyFilters();
      });
    }
  
    applyFilters() {
      this.attractions.forEach(attraction => {
        const categoryMatch = this.filters.category === 'all' || 
          attraction.querySelector('.card-category').textContent.toLowerCase().includes(this.filters.category);
        
        const neighborhoodMatch = this.filters.neighborhood === 'all' ||
          attraction.querySelector('.card-meta span').textContent.toLowerCase().includes(this.filters.neighborhood);
        
        attraction.style.display = categoryMatch && neighborhoodMatch ? 'block' : 'none';
      });
    }
  }
  
  // Initialize
  new AttractionFilter();