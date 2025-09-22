function validarFormulario() {
    let errorMensajes = document.querySelectorAll('.error');
    errorMensajes.forEach(function(error) {
        error.textContent = ''; 
    });

    const nombreUsuario = document.getElementById('nombre_usuario').value;
    const password = document.getElementById('password').value;
    let esValido = true;

    // Validación para el nombre de usuario (campo vacío)
    if (nombreUsuario === "") {
        document.getElementById('error_usuario').textContent = "Por favor, ingrese el nombre de usuario.";
        esValido = false;
    } else {
        
        const regexUsuario = /^[a-zA-Z0-9]+$/;
        if (!regexUsuario.test(nombreUsuario)) {
            document.getElementById('error_usuario').textContent = "El nombre de usuario solo debe contener letras y números.";
            esValido = false;
        }
    }


    if (password === "") {
        document.getElementById('error_password').textContent = "Por favor, ingrese la contraseña.";
        esValido = false;
    } else {
      
        if (password.length < 6) {
            document.getElementById('error_password').textContent = "La contraseña debe tener al menos 6 caracteres.";
            esValido = false;
        }
    }

    return esValido; 
}

function validarRegistro() {
    let errorMensajes = document.querySelectorAll('.error');
    errorMensajes.forEach(function(error) {
        error.textContent = ''; 
    });

    const nombreUsuario = document.getElementById('nombre_usuario').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmarpassword = document.getElementById('confirmar_password').value;
    const imagenPerfil = document.getElementById('imagen_perfil').files[0];
    let esValido = true;

   
    if (nombreUsuario === "") {
        document.getElementById('error_usuario').textContent = "Por favor, ingrese el nombre de usuario.";
        esValido = false;
    }

    
    if (email === "") {
        document.getElementById('error_email').textContent = "Por favor, ingrese su correo electrónico.";
        esValido = false;
    } else {
        const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
        if (!regexEmail.test(email)) {
            document.getElementById('error_email').textContent = "Por favor, ingrese un correo electrónico válido.";
            esValido = false;
        }
    }


    if (password === "") {
        document.getElementById('error_password').textContent = "Por favor, ingrese la contraseña.";
        esValido = false;
    } else if (password.length < 6) {
        document.getElementById('error_password').textContent = "La contraseña debe tener al menos 6 caracteres.";
        esValido = false;
    }

    if (confirmarpassword === "") {
        document.getElementById('error_confirmar_password').textContent = "Por favor, confirme la contraseña.";
        esValido = false;
    } else if (password !== confirmarpassword) {
        document.getElementById('error_confirmar_password').textContent = "Las contraseñas no coinciden.";
        esValido = false;
    }


    if (!imagenPerfil) {
        document.getElementById('error_imagen').textContent = "Por favor, seleccione una imagen de perfil.";
        esValido = false;
    } else {
        const tipoImagen = imagenPerfil.type;
        if (!['image/jpeg', 'image/png', 'image/jpg'].includes(tipoImagen)) {
            document.getElementById('error_imagen').textContent = "La imagen debe ser de tipo JPG, JPEG o PNG.";
            esValido = false;
        }
    }

    return esValido;
}

// Funcionalidad para la barra de búsqueda
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.querySelector('.search-input');
    const searchBtn = document.querySelector('.search-btn');
    
    if (searchInput && searchBtn) {
        // Enfocar el input cuando se hace clic en el botón de búsqueda
        searchBtn.addEventListener('click', function() {
            searchInput.focus();
        });
        
        // Permitir búsqueda con Enter
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Aquí puedes agregar la lógica de búsqueda cuando esté lista
                console.log('Búsqueda realizada:', searchInput.value);
            }
        });
        
        // Efecto de placeholder animado
        const placeholder = searchInput.placeholder;
        let currentPlaceholder = '';
        let i = 0;
        
        function typePlaceholder() {
            if (i < placeholder.length) {
                currentPlaceholder += placeholder.charAt(i);
                searchInput.placeholder = currentPlaceholder;
                i++;
                setTimeout(typePlaceholder, 100);
            }
        }
        
        // Iniciar la animación cuando se enfoca el input
        searchInput.addEventListener('focus', function() {
            if (searchInput.value === '') {
                searchInput.placeholder = '';
                currentPlaceholder = '';
                i = 0;
                typePlaceholder();
            }
        });
        
        // Restaurar placeholder original cuando se pierde el foco
        searchInput.addEventListener('blur', function() {
            if (searchInput.value === '') {
                searchInput.placeholder = placeholder;
            }
        });
    }
});
