
document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    console.log("Datos listo para enviar:" , {username, email, password});
try {
    const response = await fetch("http://localhost:4000/api/users/register",{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({username, email, password})
    });

    const data = await response.json();

    const messageDiv = document.getElementById("message");

    if(response.ok){
        messageDiv.innerHTML = `<p style="color: green;">${data.message}</p>`;
    document.getElementById("registerForm").reset();
    }else{
        messageDiv.innerHTML = `<p style="color: red;">${data.error}</p>`;
    }

}catch(error){
    console.log("Error al registrar usuario:", error);
    document.getElementById("message").innerHTML = `<p style="color: red;">Error al registrar usuario</p>`;
}
})

/* ... Debajo del código de registro ... */

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    try {
        const response = await fetch('http://localhost:4000/api/users/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await response.json();
        const messageDiv = document.getElementById('loginMessage');

        if (response.ok) {
            // ¡LOGIN EXITOSO!
            messageDiv.innerHTML = `<p style="color: green">Bienvenido, ${data.user.username}!</p>`;
            
            // TRUCO: Guardar el usuario en el navegador para usarlo después (ej: al crear playlist)
            localStorage.setItem('user', JSON.stringify(data.user)); // <--- IMPORTANTE
            window.location.href = 'dashboard.html';
            document.getElementById('loginForm').reset();
        } else {
            messageDiv.innerHTML = `<p style="color: red">${data.error}</p>`;
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById('loginMessage').innerHTML = '<p style="color: red">Error de conexión</p>';
    }
});