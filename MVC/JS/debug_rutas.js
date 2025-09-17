// Debug de rutas en JavaScript
console.log('🔍 Debug de rutas en JavaScript');

// Función para obtener la ruta base de las APIs
function getApiPath(endpoint) {
    // Usar ruta absoluta desde la raíz del proyecto
    return `/BD/3erEntrega/api/${endpoint}`;
}

// Función para obtener la ruta de la API usando la configuración
function getApiPathRelative(endpoint) {
    // Usar ruta absoluta para evitar problemas de navegación
    return `/BD/3erEntrega/api/${endpoint}`;
}

console.log('📍 Ruta actual:', window.location.pathname);
console.log('🔗 Ruta de APIs (absoluta):', getApiPath('crear_comentario.php'));
console.log('🔗 Ruta de APIs (relativa):', getApiPathRelative('crear_comentario.php'));

// Test de construcción de URL
const testEndpoint = 'obtener_comentarios.php?postId=11';
console.log('🧪 Test endpoint:', testEndpoint);
console.log('🔗 URL construida:', getApiPathRelative(testEndpoint));

// Verificar que la URL sea correcta
const expectedUrl = '/BD/3erEntrega/api/obtener_comentarios.php?postId=11';
console.log('✅ URL esperada:', expectedUrl);
console.log('🔍 ¿Coinciden?', getApiPathRelative(testEndpoint) === expectedUrl);

// Test de fetch
async function testFetch() {
    console.log('🧪 Probando fetch...');
    try {
        const url = getApiPathRelative('obtener_comentarios.php?postId=11');
        console.log('🌐 URL del fetch:', url);
        
        const response = await fetch(url);
        console.log('📥 Respuesta:', response);
        console.log('📊 Status:', response.status);
        
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




