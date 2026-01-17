let isLogin = true;

function toggleForm() {
    isLogin = !isLogin;
    const formTitle = document.getElementById('form-title');
    const mainBtn = document.getElementById('main-btn');
    const toggleText = document.getElementById('toggle-text');
    const messageEl = document.getElementById('message');

    // Clear previous messages when switching
    messageEl.innerText = "";

    formTitle.innerText = isLogin ? 'Login' : 'Register';
    mainBtn.innerText = isLogin ? 'Login' : 'Register';
    toggleText.innerHTML = isLogin 
        ? "Don't have an account? <span onclick='toggleForm()' style='cursor:pointer; color:blue;'>Register</span>" 
        : "Already have an account? <span onclick='toggleForm()' style='cursor:pointer; color:blue;'>Login</span>";
}

async function handleSubmit() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const messageEl = document.getElementById('message');

    if (!username || !password) {
        messageEl.style.color = "red";
        messageEl.innerText = "Please fill in all fields";
        return;
    }

    // FIX: Use the 'isLogin' variable to pick the right door
    const endpoint = isLogin ? '/login' : '/register';

    try {
        messageEl.style.color = "blue";
        messageEl.innerText = "Connecting...";

        // FIX: We use the 'endpoint' variable here so it works for both forms
       // Add http://localhost:3000 back so it talks to your local server
const response = await fetch(`http://localhost:3000${endpoint}`, {  
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
});  

        const data = await response.text();

        if (response.status === 200) {
            messageEl.style.color = "green";
            messageEl.innerText = isLogin ? "Login Successful!" : "Registration Successful!";
            
            // Redirect only on successful login
            if (isLogin) {  
                setTimeout(() => {
                    window.location.href = 'welcome.html';
                }, 1000);
            } else {
                // If they just registered, switch them to the login form
                setTimeout(() => {
                    toggleForm();
                    messageEl.style.color = "green";
                    messageEl.innerText = "Now please Login with your new account";
                }, 2000);
            }
        } else {
            messageEl.style.color = "red";
            messageEl.innerText = data; // Show the error from the server
        }  
    } catch (error) {
        console.error("Fetch Error:", error);
        messageEl.style.color = "red";
        messageEl.innerText = "Error connecting to server";
    }
}   
window.onload = function() {
    document.getElementById('username').value = "";
    document.getElementById('password').value = "";
}; 