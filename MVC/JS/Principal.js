// ===== FUNCIONALIDAD DEL SLIDER DE AÑOS MUNDIALES =====

class WorldCupYearsSlider {
    constructor() {
        this.currentIndex = 0;
        this.years = [
            1930, 1934, 1938, 1950, 1954, 1958, 1962, 1966, 1970, 1974,
            1978, 1982, 1986, 1990, 1994, 1998, 2002, 2006, 2010, 2014, 2018, 2022
        ];
        this.itemsPerView = 4;
        this.init();
    }

    init() {
        this.createSliderHTML();
        this.bindEvents();
        this.updateSlider();
        this.setActiveYear(2022); // Año más reciente por defect
    }

    createSliderHTML() {
        const sidebar = document.querySelector('.sidebar');
        if (!sidebar) return;

        // Crear el HTML del slider
        const sliderHTML = `
             <div class="world-cup-years-slider">
                <h5>
                    <i class="fas fa-trophy me-2"></i>
                    MUNDIALES
                </h5>
                
                <div class="years-container">
                    <div class="years-track">
                        ${this.years.map(year => `
                            <div class="year-capsule" data-year="${year}">
                                <div class="year-number">${year}</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="slider-controls">
                    <button class="slider-btn" id="prevBtn" title="Años anteriores">
                        <i class="fas fa-chevron-up"></i>
                    </button>
                    <button class="slider-btn" id="nextBtn" title="Años siguientes">
                        <i class="fas fa-chevron-down"></i>
                    </button>
                </div>
                
                <div class="slider-indicator">
                    <span id="currentRange"></span>
                </div>
            </div>
        `;

        // Insertar el slider al principio del sidebar
        sidebar.insertAdjacentHTML('afterbegin', sliderHTML);
    }

    bindEvents() {
        // Botones de navegación
        document.getElementById('prevBtn')?.addEventListener('click', () => this.previous());
        document.getElementById('nextBtn')?.addEventListener('click', () => this.next());

        // Cápsulas de años
        document.querySelectorAll('.year-capsule').forEach(capsule => {
            capsule.addEventListener('click', (e) => {
                const year = parseInt(e.currentTarget.dataset.year);
                this.setActiveYear(year);
                this.onYearSelected(year);
            });
        });

        // Navegación con teclado
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.previous();
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.next();
            }
        });

        // Navegación con rueda del mouse
        const yearsContainer = document.querySelector('.years-container');
        if (yearsContainer) {
            yearsContainer.addEventListener('wheel', (e) => {
                e.preventDefault();
                if (e.deltaY > 0) {
                    this.next();
                } else {
                    this.previous();
                }
            });
        }
    }

    previous() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.updateSlider();
        }
    }

    next() {
        const maxIndex = Math.max(0, this.years.length - this.itemsPerView);
        if (this.currentIndex < maxIndex) {
            this.currentIndex++;
            this.updateSlider();
        }
    }

    updateSlider() {
        const track = document.querySelector('.years-track');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const currentRange = document.getElementById('currentRange');

        if (!track || !prevBtn || !nextBtn || !currentRange) return;

        // Calcular la transformación
        const translateY = this.currentIndex * (60 + 15); // altura de cápsula + gap
        track.style.transform = `translateY(-${translateY}px)`;

        // Actualizar estado de botones
        prevBtn.disabled = this.currentIndex === 0;
        nextBtn.disabled = this.currentIndex >= Math.max(0, this.years.length - this.itemsPerView);

        // Actualizar indicador de rango
        const startYear = this.years[this.currentIndex];
        const endYear = this.years[Math.min(this.currentIndex + this.itemsPerView - 1, this.years.length - 1)];
        currentRange.textContent = `${startYear} - ${endYear}`;

        // Actualizar estilos de botones
        this.updateButtonStyles();
    }

    updateButtonStyles() {
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');

        if (prevBtn?.disabled) {
            prevBtn.style.opacity = '0.5';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }

        if (nextBtn?.disabled) {
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    setActiveYear(year) {
        // Remover clase active de todas las cápsulas
        document.querySelectorAll('.year-capsule').forEach(capsule => {
            capsule.classList.remove('active');
        });

        // Agregar clase active a la cápsula del año seleccionado
        const activeCapsule = document.querySelector(`[data-year="${year}"]`);
        if (activeCapsule) {
            activeCapsule.classList.add('active');
            
            // Asegurar que la cápsula activa sea visible
            this.scrollToYear(year);
        }
    }

    scrollToYear(year) {
        const yearIndex = this.years.indexOf(year);
        if (yearIndex === -1) return;

        // Calcular si el año está en el rango visible
        const startIndex = this.currentIndex;
        const endIndex = this.currentIndex + this.itemsPerView - 1;

        if (yearIndex < startIndex || yearIndex > endIndex) {
            // Ajustar el índice para mostrar el año seleccionado
            this.currentIndex = Math.max(0, yearIndex - Math.floor(this.itemsPerView / 2));
            this.updateSlider();
        }
    }

    onYearSelected(year) {
        console.log(`Año seleccionado: ${year}`);
        
        // Aquí puedes agregar la lógica para filtrar las publicaciones por año
        // Por ejemplo:
        // this.filterPublicationsByYear(year);
        // this.updateFeed(year);
        
        // También puedes emitir un evento personalizado
        const event = new CustomEvent('worldCupYearSelected', { 
            detail: { year: year } 
        });
        document.dispatchEvent(event);
    }

    // Método para obtener el año activo
    getActiveYear() {
        const activeCapsule = document.querySelector('.year-capsule.active');
        return activeCapsule ? parseInt(activeCapsule.dataset.year) : null;
    }

    // Método para cambiar el año activo programáticamente
    selectYear(year) {
        if (this.years.includes(year)) {
            this.setActiveYear(year);
            this.onYearSelected(year);
        }
    }
}

// ===== INICIALIZACIÓN DEL SLIDER =====

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar el slider de años mundiales
    const worldCupSlider = new WorldCupYearsSlider();
    
    // Escuchar eventos de cambio de año
    document.addEventListener('worldCupYearSelected', function(e) {
        console.log('Evento capturado:', e.detail);
        // Aquí puedes agregar la lógica para actualizar la interfaz
        // cuando se selecciona un año diferente
    });
    
    // Hacer el slider disponible globalmente si es necesario
    window.worldCupSlider = worldCupSlider;
});




