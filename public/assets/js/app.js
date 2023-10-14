document.addEventListener('DOMContentLoaded', function() {

    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const userData = {
                email: document.getElementById('email-login').value,
                password: document.getElementById('password-login').value
            };

            fetch('/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Login successful!') {
                    window.location.href = '/dashboard';  // Redirect to dashboard
                } else {
                    alert(data.message);
                }
            });
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const userData = {
                username: document.getElementById('username-register').value,
                email: document.getElementById('email-register').value,
                password: document.getElementById('password-register').value
            };

            fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Registration successful!') {
                    window.location.href = '/dashboard';  // Redirect to dashboard
                } else {
                    alert(data.message);
                }
            });
        });
    }

});
