document.addEventListener('DOMContentLoaded', (event) => {
    if (event) {
        console.info('DOM loaded');
    }

    // LOGOUT FUNCTION
    window.logout = function() {
        fetch('/api/users/logout', { method: 'POST' })
            .then(response => {
                if (response.status === 204) {
                    window.location.href = '/login';
                } else {
                    console.error('Failed to logout.');
                    return response.text();
                }
            })
            .then(text => {
                if (text) {
                    console.error(text);
                }
            })
            .catch(err => {
                console.error('Error:', err);
            });
    };

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // Login form event listener
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const userData = {
                email: document.getElementById('email-login').value,
                password: document.getElementById('password-login').value
            };

            fetch('/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Login successful!') {
                    window.location.href = '/dashboard';
                } else {
                    alert(data.message);
                }
            });
        });
    }

    // Registration form event listener
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const userData = {
                username: document.getElementById('username-register').value,
                email: document.getElementById('email-register').value,
                password: document.getElementById('password-register').value
            };

            fetch('/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Registration successful!') {
                    window.location.href = '/dashboard';
                } else {
                    alert(data.message);
                }
            });
        });
    }
});
