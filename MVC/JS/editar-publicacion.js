function editarPublicacion(id, texto) {
    // Mostrar el modal
    document.getElementById('editarModal').style.display = 'block';

    // Cargar los datos de texto e ID
    document.getElementById('edit-id').value = id;
    document.getElementById('edit-texto').value = texto;

    // Limpiar vistas previas
    const previewImagen = document.getElementById('preview-imagen');
    const previewVideo = document.getElementById('preview-video');
    previewImagen.innerHTML = '';
    previewVideo.innerHTML = '';

    // Hacer fetch para obtener los archivos actuales (imagen y/o video)
    fetch(`obtener_archivo_publicacion.php?id=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.imagen || data.video) {
                // Mostrar la imagen si existe
                if (data.imagen) {
                    document.getElementById('imagen-actual').value = data.imagen;
                    previewImagen.innerHTML = `<img src="${data.imagen}" class="img-fluid rounded" style="max-height: 300px;">`;
                }

                // Mostrar el video si existe
                if (data.video) {
                    document.getElementById('video-actual').value = data.video;
                    previewVideo.innerHTML = `
                        <video controls class="w-100 rounded" style="max-height: 300px;">
                            <source src="${data.video}" type="video/mp4">
                            Tu navegador no soporta video.
                        </video>`;
                }
            } else {
                previewImagen.innerHTML = '<p>No hay imagen cargada.</p>';
                previewVideo.innerHTML = '<p>No hay video cargado.</p>';
            }
        })
        .catch(error => {
            console.error("Error al obtener archivo: ", error);
            previewImagen.innerHTML = '<p>Error al cargar la imagen.</p>';
            previewVideo.innerHTML = '<p>Error al cargar el video.</p>';
        });
}


function cerrarModalEditar() {
    document.getElementById('editarModal').style.display = 'none';
}

document.getElementById('formEditar').addEventListener('submit', function(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    // Loguear los datos del FormData
    for (let [key, value] of formData.entries()) {
        console.log(key, value);
    }

    fetch('editar_publicacion.php', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(response => {
        if (response.status === 'ok') {
            location.reload();
        } else {
            alert(response.message || "Error al actualizar publicación.");
            console.error(response);
        }
    })
    .catch(error => {
        alert("Error al procesar la solicitud.");
        console.error(error);
    });
});



function previewImagen(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview-imagen');

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = `<img src="${e.target.result}" class="img-fluid rounded" style="max-height: 300px;">`;
    };
    reader.readAsDataURL(file);
}

function previewVideo(event) {
    const file = event.target.files[0];
    const preview = document.getElementById('preview-video');

    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        preview.innerHTML = `
            <video controls class="w-100 rounded" style="max-height: 300px;">
                <source src="${e.target.result}" type="${file.type}">
                Tu navegador no soporta video.
            </video>`;
    };
    reader.readAsDataURL(file);
}
