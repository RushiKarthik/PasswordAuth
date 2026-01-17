let isLogin = true;

function toggleForm() {
    isLogin = !isLogin;
    document.getElementById('form-title').innerText = isLogin ? 'Login' : 'Register';
    document.getElementById('main-btn').innerText = isLogin ? 'Login' : 'Register';
    document.getElementById('toggle-text').innerHTML = isLogin 
        ? "Don't have an account? <span onclick='toggleForm()'>Register</span>" 
        : "Already have an account? <span onclick='toggleForm()'>Login</span>";
}

async function handleSubmit() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('message');

    // Determine which endpoint to hit based on the mode
    const endpoint = isLogin ? '/login' : '/register';

    try {
        const response = await fetch(`http://localhost:3000${endpoint}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await response.text();

        if (response.status === 200) {
            messageEl.style.color = "green";
            messageEl.innerText = isLogin ? "Login Successful!" : "Registration Successful!";
            if(isLogin){  
            window.location.href = 'welcome.html';
          }  
}
       
             else {
            messageEl.style.color = "red";
            messageEl.innerText = data;
        }  
    } catch (error) {
        messageEl.innerText = "Error connecting to server";
    }
}  
