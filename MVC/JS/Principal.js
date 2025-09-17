// VERSIÓN: 2.0 - Sistema de comentarios completamente renovado
// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM cargado, inicializando JavaScript v2.0...');
    
    // ===== CONFIGURACIÓN DE APIS =====
    const API_CONFIG = {
        BASE_URL: window.location.origin + '/BD/3erEntrega/api',
        ENDPOINTS: {
            COMENTARIOS: 'obtener_comentarios.php',
            CREAR_COMENTARIO: 'crear_comentario.php',
            CREAR_PUBLICACION: 'crear_publicacion.php',
            CREAR_REACCION: 'crear_reaccion.php'
        }
    };
    
    // Función para construir URLs de API
    function buildApiUrl(endpoint, params = {}) {
        const url = new URL(API_CONFIG.BASE_URL + '/' + endpoint);
        
        // Agregar parámetros de consulta
        Object.keys(params).forEach(key => {
            if (params[key] !== null && params[key] !== undefined) {
                url.searchParams.append(key, params[key]);
            }
        });
        
        console.log('🔗 URL construida:', url.toString());
        return url.toString();
    }
    
    // ===== SISTEMA DE COMENTARIOS =====
    class CommentSystem {
        constructor() {
            this.init();
        }
        
        init() {
            console.log('💬 Inicializando sistema de comentarios...');
            this.setupCommentToggles();
            this.setupCommentForms();
        }
        
        // Configurar botones para mostrar/ocultar comentarios
        setupCommentToggles() {
            const toggles = document.querySelectorAll('.comment-toggle');
            console.log(`🔘 Encontrados ${toggles.length} botones de toggle`);
            
            toggles.forEach((toggle, index) => {
                toggle.addEventListener('click', (e) => {
                    e.preventDefault();
                    const postId = toggle.dataset.postId;
                    console.log(`👁️ Toggle comentarios para post ${postId}`);
                    
                    this.toggleCommentSection(postId);
                });
            });
        }
        
        // Configurar formularios de comentarios
        setupCommentForms() {
            const forms = document.querySelectorAll('.comment-form');
            console.log(`📝 Encontrados ${forms.length} formularios de comentarios`);
            
            forms.forEach((form, index) => {
                form.addEventListener('submit', (e) => {
                    e.preventDefault();
                    const postId = form.dataset.postId;
                    const input = form.querySelector('input[type="text"]');
                    const texto = input.value.trim();
                    
                    if (!texto) {
                        console.log('❌ Texto vacío, no se envía');
                        return;
                    }
                    
                    console.log(`📤 Enviando comentario para post ${postId}: "${texto}"`);
                    this.createComment(postId, texto, input);
                });
            });
        }
        
        // Mostrar/ocultar sección de comentarios
        toggleCommentSection(postId) {
            const commentSection = document.getElementById(`comments-${postId}`);
            if (!commentSection) {
                console.error(`❌ Sección de comentarios no encontrada para post ${postId}`);
                return;
            }
            
            const isHidden = commentSection.classList.contains('d-none');
            commentSection.classList.toggle('d-none');
            
            if (!isHidden) {
                // Si se está ocultando, no hacer nada
                return;
            }
            
            // Si se está mostrando, cargar comentarios
            console.log(`📥 Cargando comentarios para post ${postId}`);
            this.loadComments(postId);
        }
        
        // Cargar comentarios de una publicación
        async loadComments(postId) {
            try {
                const url = buildApiUrl(API_CONFIG.ENDPOINTS.COMENTARIOS, { postId });
                console.log(`🌐 Cargando comentarios desde: ${url}`);
                
                const response = await fetch(url);
                console.log(`📥 Respuesta recibida:`, response);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const comentarios = await response.json();
                console.log(`📊 Comentarios cargados:`, comentarios);
                
                this.renderComments(postId, comentarios);
                
            } catch (error) {
                console.error(`💥 Error cargando comentarios para post ${postId}:`, error);
                this.showCommentError(postId, 'Error al cargar comentarios');
            }
        }
        
        // Renderizar comentarios en el DOM
        renderComments(postId, comentarios) {
            const container = document.getElementById(`comment-list-${postId}`);
            if (!container) {
                console.error(`❌ Contenedor de comentarios no encontrado para post ${postId}`);
                return;
            }
            
            if (Array.isArray(comentarios) && comentarios.length > 0) {
                const html = comentarios.map(com => `
                    <div class="comment mb-3 p-3 border rounded">
                        <div class="d-flex align-items-center mb-2">
                            <strong class="text-primary me-2">${this.escapeHtml(com.nombre)}</strong>
                            <small class="text-muted">${this.formatDate(com.fecha_creacion || new Date())}</small>
                        </div>
                        <p class="mb-0">${this.escapeHtml(com.texto)}</p>
                    </div>
                `).join('');
                
                container.innerHTML = html;
                console.log(`✅ ${comentarios.length} comentarios renderizados para post ${postId}`);
            } else {
                container.innerHTML = `
                    <div class="text-center text-muted py-4">
                        <i class="fas fa-comment-slash fa-2x mb-2"></i>
                        <p class="mb-0">No hay comentarios aún. ¡Sé el primero en comentar!</p>
                    </div>
                `;
                console.log(`ℹ️ No hay comentarios para mostrar en post ${postId}`);
            }
        }
        
        // Crear un nuevo comentario
        async createComment(postId, texto, input) {
            try {
                const formData = new FormData();
                formData.append('id_publicacion', postId);
                formData.append('texto', texto);
                
                const url = buildApiUrl(API_CONFIG.ENDPOINTS.CREAR_COMENTARIO);
                console.log(`🌐 Enviando comentario a: ${url}`);
                
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });
                
                console.log(`📥 Respuesta de creación:`, response);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log(`📊 Respuesta de comentario:`, data);
                
                if (data.success || data.mensaje) {
                    console.log(`✅ Comentario creado exitosamente`);
                    input.value = '';
                    input.focus();
                    
                    // Recargar comentarios
                    this.loadComments(postId);
                    
                    // Mostrar mensaje de éxito
                    this.showSuccessMessage('Comentario enviado correctamente');
                } else {
                    throw new Error(data.error || data.message || 'Error desconocido al crear comentario');
                }
                
            } catch (error) {
                console.error(`💥 Error creando comentario:`, error);
                this.showErrorMessage('Error al enviar el comentario: ' + error.message);
            }
        }
        
        // Mostrar error en la sección de comentarios
        showCommentError(postId, message) {
            const container = document.getElementById(`comment-list-${postId}`);
            if (container) {
                container.innerHTML = `
                    <div class="text-center text-danger py-4">
                        <i class="fas fa-exclamation-triangle fa-2x mb-2"></i>
                        <p class="mb-0">${message}</p>
                        <button class="btn btn-outline-primary btn-sm mt-2" onclick="commentSystem.loadComments(${postId})">
                            <i class="fas fa-redo"></i> Reintentar
                        </button>
                    </div>
                `;
            }
        }
        
        // Mostrar mensaje de éxito
        showSuccessMessage(message) {
            // Crear toast de éxito
            const toast = document.createElement('div');
            toast.className = 'toast show position-fixed';
            toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
            toast.innerHTML = `
                <div class="toast-header bg-success text-white">
                    <i class="fas fa-check me-2"></i>
                    <strong class="me-auto">Éxito</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Auto-remover después de 3 segundos
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 3000);
        }
        
        // Mostrar mensaje de error
        showErrorMessage(message) {
            // Crear toast de error
            const toast = document.createElement('div');
            toast.className = 'toast show position-fixed';
            toast.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
            toast.innerHTML = `
                <div class="toast-header bg-danger text-white">
                    <i class="fas fa-exclamation-triangle me-2"></i>
                    <strong class="me-auto">Error</strong>
                    <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
                </div>
                <div class="toast-body">
                    ${message}
                </div>
            `;
            
            document.body.appendChild(toast);
            
            // Auto-remover después de 5 segundos
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 5000);
        }
        
        // Utilidades
        escapeHtml(text) {
            const div = document.createElement('div');
            div.textContent = text;
            return div.innerHTML;
        }
        
        formatDate(date) {
            if (!date) return '';
            const d = new Date(date);
            return d.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        }
    }
    
    // ===== SISTEMA DE PUBLICACIONES =====
    class PostSystem {
        constructor() {
            this.init();
        }
        
        init() {
            console.log('📝 Inicializando sistema de publicaciones...');
            this.setupPostForm();
            this.setupMediaPreviews();
        }
        
        // Configurar formulario de publicación
        setupPostForm() {
            const form = document.getElementById('postForm');
            if (!form) {
                console.log('❌ Formulario de publicación no encontrado');
                return;
            }
            
            console.log('✅ Formulario de publicación encontrado');
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createPost(form);
            });
        }
        
        // Crear nueva publicación
        async createPost(form) {
            const texto = document.getElementById('postText')?.value.trim();
            const imagen = document.getElementById('postImage')?.files[0];
            const video = document.getElementById('postVideo')?.files[0];
            
            if (!texto && !imagen && !video) {
                this.showErrorMessage('Debes escribir algo o subir una imagen o un video');
                return;
            }
            
            try {
                const formData = new FormData();
                if (texto) formData.append('texto', texto);
                if (imagen) formData.append('imagen', imagen);
                if (video) formData.append('video', video);
                
                const url = buildApiUrl(API_CONFIG.ENDPOINTS.CREAR_PUBLICACION);
                console.log(`🌐 Creando publicación en: ${url}`);
                
                const response = await fetch(url, {
                    method: 'POST',
                    body: formData
                });
                
                console.log(`📥 Respuesta de publicación:`, response);
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log(`📊 Respuesta de publicación:`, data);
                
                if (data.success) {
                    console.log(`✅ Publicación creada exitosamente`);
                    this.showSuccessMessage('Publicación creada correctamente');
                    
                    // Limpiar formulario
                    form.reset();
                    this.clearMediaPreviews();
                    
                    // Recargar página después de un breve delay
                    setTimeout(() => {
                        location.reload();
                    }, 1000);
                } else {
                    throw new Error(data.message || 'Error desconocido al crear publicación');
                }
                
            } catch (error) {
                console.error(`💥 Error creando publicación:`, error);
                this.showErrorMessage('Error al crear la publicación: ' + error.message);
            }
        }
        
        // Configurar previsualizaciones de medios
        setupMediaPreviews() {
            // Previsualización de imagen
            const imageInput = document.getElementById('postImage');
            if (imageInput) {
                imageInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        this.showImagePreview(file);
                    }
                });
            }
            
            // Previsualización de video
            const videoInput = document.getElementById('postVideo');
            if (videoInput) {
                videoInput.addEventListener('change', (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        this.showVideoPreview(file);
                    }
                });
            }
        }
        
        // Mostrar previsualización de imagen
        showImagePreview(file) {
            const preview = document.getElementById('previewImg');
            const container = document.getElementById('imagePreview');
            
            if (preview && container) {
                preview.src = URL.createObjectURL(file);
                container.classList.remove('d-none');
            }
        }
        
        // Mostrar previsualización de video
        showVideoPreview(file) {
            const preview = document.getElementById('previewVideo');
            const container = document.getElementById('videoPreview');
            
            if (preview && container) {
                preview.src = URL.createObjectURL(file);
                container.classList.remove('d-none');
            }
        }
        
        // Limpiar previsualizaciones
        clearMediaPreviews() {
            const imagePreview = document.getElementById('imagePreview');
            const videoPreview = document.getElementById('videoPreview');
            
            if (imagePreview) imagePreview.classList.add('d-none');
            if (videoPreview) videoPreview.classList.add('d-none');
        }
        
        // Mostrar mensaje de éxito
        showSuccessMessage(message) {
            const commentSystem = window.commentSystem;
            if (commentSystem) {
                commentSystem.showSuccessMessage(message);
            }
        }
        
        // Mostrar mensaje de error
        showErrorMessage(message) {
            const commentSystem = window.commentSystem;
            if (commentSystem) {
                commentSystem.showErrorMessage(message);
            }
        }
    }
    
    // ===== SISTEMA DE REACCIONES =====
    class ReactionSystem {
        constructor() {
            this.init();
        }
        
        init() {
            console.log('😀 Inicializando sistema de reacciones...');
            this.setupGlobalReactionFunction();
        }
        
        // Configurar función global de reacciones
        setupGlobalReactionFunction() {
            window.react = (element, emoji) => {
                const postId = element.closest('.post')?.id?.split('-')[1];
                if (!postId) {
                    console.error('❌ No se pudo obtener el ID del post');
                    return;
                }
                
                console.log(`😀 Reacción ${emoji} para publicación ${postId}`);
                this.createReaction(postId, emoji, element);
            };
        }
        
        // Crear reacción
        async createReaction(postId, emoji, element) {
            try {
                const url = buildApiUrl(API_CONFIG.ENDPOINTS.CREAR_REACCION);
                console.log(`🌐 Enviando reacción a: ${url}`);
                
                const response = await fetch(url, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `id_publicacion=${postId}&tipo=${encodeURIComponent(emoji)}`
                });
                
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
                }
                
                const data = await response.json();
                console.log(`📊 Respuesta de reacción:`, data);
                
                if (data.success || data.mensaje) {
                    console.log(`✅ Reacción ${emoji} registrada`);
                    
                    // Actualizar UI
                    const button = element.closest('.dropdown')?.querySelector('button');
                    if (button) {
                        button.innerHTML = `${emoji} Reaccionaste`;
                        button.classList.add('text-primary');
                    }
                } else {
                    throw new Error(data.error || data.message || 'Error desconocido al crear reacción');
                }
                
            } catch (error) {
                console.error(`💥 Error creando reacción:`, error);
                const commentSystem = window.commentSystem;
                if (commentSystem) {
                    commentSystem.showErrorMessage('Error al registrar reacción: ' + error.message);
                }
            }
        }
    }
    
    // ===== INICIALIZACIÓN =====
    console.log('🔧 Inicializando sistemas...');
    
    // Crear instancias de los sistemas
    window.commentSystem = new CommentSystem();
    window.postSystem = new PostSystem();
    window.reactionSystem = new ReactionSystem();
    
    console.log('🎉 Todos los sistemas inicializados correctamente');
    
    // Log de configuración
    console.log('📋 Configuración de APIs:', API_CONFIG);
    console.log('📍 Ruta actual:', window.location.pathname);
    console.log('🌐 Origen:', window.location.origin);
});

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
        this.setActiveYear(2022); // Año más reciente por defecto
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

// ===== FUNCIONALIDAD ADICIONAL PARA PUBLICACIONES =====

// Función para filtrar publicaciones por año (ejemplo)
function filterPublicationsByYear(year) {
    // Aquí implementarías la lógica para filtrar las publicaciones
    // que contengan contenido relacionado con el año seleccionado
    
    console.log(`Filtrando publicaciones del año ${year}`);
    
    // Ejemplo de implementación:
    const publications = document.querySelectorAll('.post');
    publications.forEach(publication => {
        // Aquí verificarías si la publicación contiene contenido del año seleccionado
        // Por ahora solo mostramos todas
        publication.style.display = 'block';
    });
}


