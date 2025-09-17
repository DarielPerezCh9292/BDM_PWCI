// Debug temporal para verificar URLs
console.log('🔍 DEBUG TEMPORAL - Verificando construcción de URLs');

// Simular la configuración
const API_CONFIG = {
    BASE_URL: window.location.origin + '/BD/3erEntrega/api',
    ENDPOINTS: {
        COMENTARIOS: 'obtener_comentarios.php',
        CREAR_COMENTARIO: 'crear_comentario.php'
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

// Test de URLs
console.log('📍 Ruta actual:', window.location.pathname);
console.log('🌐 Origen:', window.location.origin);
console.log('📋 Configuración:', API_CONFIG);

// Test de construcción de URLs
const testUrl1 = buildApiUrl('obtener_comentarios.php', { postId: 11 });
const testUrl2 = buildApiUrl('crear_comentario.php');

console.log('🧪 Test URL 1:', testUrl1);
console.log('🧪 Test URL 2:', testUrl2);

// Verificar que las URLs sean correctas
const expected1 = 'http://localhost/BD/3erEntrega/api/obtener_comentarios.php?postId=11';
const expected2 = 'http://localhost/BD/3erEntrega/api/crear_comentario.php';

console.log('✅ URL 1 correcta:', testUrl1 === expected1);
console.log('✅ URL 2 correcta:', testUrl2 === expected2);

// Test de fetch directo
async function testFetch() {
    try {
        console.log('🧪 Probando fetch directo...');
        const response = await fetch(testUrl1);
        console.log('📥 Respuesta:', response.status, response.statusText);
        
        if (response.ok) {
            const data = await response.json();
            console.log('✅ Datos recibidos:', data);
        } else {
            console.log('❌ Error HTTP:', response.status);
        }
    } catch (error) {
        console.error('💥 Error en fetch:', error);
    }
}

// Ejecutar test
testFetch();




