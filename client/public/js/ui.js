// Button handlers and UI interactions
function setupEventListeners() {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    const startLabButton = document.getElementById('startLab');
    if (startLabButton) {
        startLabButton.addEventListener('click', () => {
            window.location.href = '/lab';
        });
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