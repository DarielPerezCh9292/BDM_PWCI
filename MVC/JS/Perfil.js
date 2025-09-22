function openEditProfile() {
    document.getElementById('editProfileModal').style.display = 'block';
  }
  
  function closeEditProfile() {
    document.getElementById('editProfileModal').style.display = 'none';
  }
  
  // Cerrar al hacer clic fuera del modal
  window.onclick = function(event) {
    const modal = document.getElementById('editProfileModal');
    if (event.target == modal) {
      closeEditProfile();
    }
  }
  
  // Previsualización de la foto de perfil
  document.getElementById('photoInput').addEventListener('change', function(e) {
    const reader = new FileReader();
    reader.onload = function(event) {
      document.getElementById('profilePhotoPreview').src = event.target.result;
      document.getElementById('profilePhoto').src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
  });

  // Función para reactivar publicaciones rechazadas
  function reactivarPublicacion(idPublicacion, textoActual) {
    if (confirm('¿Estás seguro de que quieres reactivar esta publicación? Se enviará nuevamente para moderación.')) {
      // Usar la función de edición existente para reactivar
      editarPublicacion(idPublicacion, textoActual);
    }
  }