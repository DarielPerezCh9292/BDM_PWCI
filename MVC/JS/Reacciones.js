function toggleReactions(button) {
    const container = button.parentElement;
    const reactions = container.querySelector('.reactions');
    reactions.style.display = reactions.style.display === 'flex' ? 'none' : 'flex';
}

function react(el, emoji) {
    const btn = el.closest('.reaction-container').querySelector('.like-btn');
    btn.innerHTML = emoji; // Reemplaza el texto por el emoji
    el.parentElement.style.display = 'none';
}


// Publicaciones

function publicarPost() {
    const texto = document.getElementById('postText').value;
    const imagenInput = document.getElementById('postImage');
    const imagen = imagenInput.files[0];

    if (!texto && !imagen) {
        alert("Escribe algo o sube una imagen.");
        return;
    }

    const feed = document.querySelector('.feed');
    const nuevoPost = document.createElement('div');
    nuevoPost.className = 'post';

    let contenido = `
        <div class="user-info">
            <img src="Imagenes/1.jpg" alt="Usuario" class="user-img">
            <span class="user-name">Usuario</span>
        </div>
        <p class="post-content">${texto}</p>
    `;

    if (imagen) {
        const reader = new FileReader();
        reader.onload = function(e) {
            contenido += `<img src="${e.target.result}" class="post-image">`;
            nuevoPost.innerHTML = contenido;
            agregarSeccionesReaccionesYComentarios(nuevoPost);
            feed.prepend(nuevoPost); // Insertar el post en el feed
        }
        reader.readAsDataURL(imagen);
    } else {
        nuevoPost.innerHTML = contenido;
        agregarSeccionesReaccionesYComentarios(nuevoPost);
        feed.prepend(nuevoPost); // Insertar el post en el feed
    }

    document.getElementById('postText').value = '';
    imagenInput.value = '';
}

function agregarSeccionesReaccionesYComentarios(nuevoPost) {
    const commentSection = document.createElement('div');
    commentSection.className = 'comment-section';
    commentSection.id = `commentSection-${nuevoPost.dataset.id}`;
    commentSection.innerHTML = `
        <div class="comment">
            <span class="comment-user">Usuario 2:</span>
            <p class="comment-content">¡Me encanta! 😍</p>
        </div>
    `;
    nuevoPost.appendChild(commentSection);

    // Agregar el campo para comentar
    const commentInput = document.createElement('textarea');
    commentInput.placeholder = 'Escribe tu comentario...';
    commentInput.className = 'textarea2';
    commentInput.id = `commentInput-${nuevoPost.dataset.id}`; // ID único por publicación
    nuevoPost.appendChild(commentInput);

    // Agregar las acciones de reacciones y el botón de comentar
    const postActions = document.createElement('div');
    postActions.className = 'post-actions';

    const reactionContainer = document.createElement('div');
    reactionContainer.className = 'reaction-container';
    reactionContainer.innerHTML = `
        <button class="like-btn" onclick="toggleReactions(this)">👍 Me gusta</button>
        <div class="reactions" style="display: none;">
            <span onclick="react(this, '👍')">👍</span>
            <span onclick="react(this, '❤️')">❤️</span>
            <span onclick="react(this, '😂')">😂</span>
            <span onclick="react(this, '😮')">😮</span>
            <span onclick="react(this, '😢')">😢</span>
            <span onclick="react(this, '😡')">😡</span>
        </div>
    `;

    const commentButton = document.createElement('button');
    commentButton.className = 'comment-btn';
    commentButton.style.backgroundColor = '#2196F3';
    commentButton.textContent = '📩 Comentar';
    commentButton.onclick = function() {
        agregarComentario(nuevoPost.dataset.id);
    };

    postActions.appendChild(reactionContainer);
    postActions.appendChild(commentButton);
    nuevoPost.appendChild(postActions);
}

function agregarComentario(postId) {
    const commentInput = document.getElementById(`commentInput-${postId}`);
    const commentText = commentInput.value.trim();

    if (commentText) {
        const newComment = document.createElement('div');
        newComment.className = 'comment';
        newComment.innerHTML = `
            <span class="comment-user">Usuario X:</span>
            <p class="comment-content">${commentText}</p>
        `;

        const commentSection = document.getElementById(`commentSection-${postId}`);
        commentSection.appendChild(newComment);

        commentInput.value = ''; 
    } else {
        alert('Por favor, ingresa un comentario.');
    }
}
