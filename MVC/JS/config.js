// Configuración de rutas de la API
const API_CONFIG = {
    // Ruta base de la API
    BASE_URL: '/BD/3erEntrega/api',
    
    // Endpoints disponibles
    ENDPOINTS: {
        CREAR_PUBLICACION: 'crear_publicacion.php',
        CREAR_COMENTARIO: 'crear_comentario.php',
        CREAR_REACCION: 'crear_reaccion.php',
        OBTENER_COMENTARIOS: 'obtener_comentarios.php',
        PUBLICACIONES: 'publicaciones.php'
    },
    
    // Función para construir URLs completas
    getUrl: function(endpoint) {
        return `${this.BASE_URL}/${endpoint}`;
    },
    
    // Función para construir URLs con parámetros
    getUrlWithParams: function(endpoint, params = {}) {
        const url = new URL(this.getUrl(endpoint), window.location.origin);
        Object.keys(params).forEach(key => {
            url.searchParams.append(key, params[key]);
        });
        return url.toString();
    }
};

// Exportar para uso en otros archivos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = API_CONFIG;
}




