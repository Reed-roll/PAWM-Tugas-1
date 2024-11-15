async function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        alert('Login successful');
        window.location.href = '/lab';
    } else {
        const errorText = await response.text();
        console.error('Login failed:', errorText);
        alert('Login failed');
    }
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password }) // Include email in the request body
        });

        if (response.ok) {
            const data = await response.json();
            console.log('Registration successful:', data);
            alert('Registration successful');
            window.location.href = '/login';
        } else {
            const errorText = await response.text();
            console.error('Registration failed:', errorText);
            alert('Registration failed: ' + errorText);
        }
    } catch (error) {
        console.error('Error during registration:', error);
        alert('An error occurred during registration. Please try again.');
    }
}

// Button handlers and UI interactions
function setupEventListeners() {
    const loginButton = document.getElementById('login')
    if (loginButton) {
        loginButton.addEventListener('click', () => {
            window.location.href = '/login';
        });
    }

    const registerButton = document.getElementById('register')
    if (registerButton) {
        registerButton.addEventListener('click', () => {
            window.location.href = '/register';
        });
    }

    const startLabButton = document.getElementById('startLab');
    if (startLabButton) {
        startLabButton.addEventListener('click', () => {
            window.location.href = '/lab';
        });
    }

    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }



    const saveButton = document.getElementById('save');
    if (saveButton) {
        saveButton.addEventListener('click', saveState);
    }

    const loadButton = document.getElementById('load');
    if (loadButton) {
        loadButton.addEventListener('click', loadState);
    }
}

// Call when DOM is loaded
document.addEventListener('DOMContentLoaded', setupEventListeners);