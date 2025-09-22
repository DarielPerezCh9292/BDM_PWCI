let selectedUser = null;
let chatInterval = null;

function openChat(userId, userName, userImage) {
    selectedUser = userId;
    document.getElementById('chatUserPhoto').src = userImage;
    document.getElementById('chatUserName').innerText = userName;
    document.getElementById('chatModal').style.display = 'flex';

    // Función que carga los mensajes
    function cargarMensajes() {
        fetch(`obtener_mensajes.php?usuario_id=${selectedUser}`)
            .then(res => res.json())
            .then(data => {
                let chatHistory = document.getElementById('chatHistory');
                chatHistory.innerHTML = '';

                data.forEach(m => {
                    let div = document.createElement('div');
                    div.classList.add('message');
                    div.classList.add(m.emisor_id == selectedUser ? 'received' : 'sent');
                    div.innerHTML = `<p>${m.mensaje}</p>`;
                    chatHistory.appendChild(div);
                });

                // Scroll automático hacia abajo
                chatHistory.scrollTop = chatHistory.scrollHeight;
            });
    }

    // Llamada inmediata
    cargarMensajes();

    // Limpia intervalos previos
    if (chatInterval) {
        clearInterval(chatInterval);
    }

    // Inicia actualización cada 3 segundos
    chatInterval = setInterval(cargarMensajes, 3000);
}



function closeModal() {
    document.getElementById('chatModal').style.display = 'none';
    selectedUser = null;

    if (chatInterval) {
        clearInterval(chatInterval);
        chatInterval = null;
    }
}


function sendMessage() {
    let message = document.getElementById('messageInput').value;
    if (message.trim() !== '') {
        fetch('enviar_mensaje.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `receptor_id=${selectedUser}&mensaje=${encodeURIComponent(message)}`
        }).then(() => {
            let messageDiv = document.createElement('div');
            messageDiv.classList.add('message', 'sent');
            messageDiv.innerHTML = `<p>${message}</p>`;
            document.getElementById('chatHistory').appendChild(messageDiv);
            document.getElementById('messageInput').value = '';
        });
    }
}

