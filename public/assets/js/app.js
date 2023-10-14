document.addEventListener('DOMContentLoaded', (event) => {
    if (event) {
        console.info('DOM loaded');
    }

    // LOGOUT FUNCTION
    window.logout = function() {
        fetch('/users/logout', { method: 'POST' })
        .then(response => {
            if (response.status === 204) {
                window.location.href = '/login';
            }
        });
    };

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

const signUpButton = document.getElementById('sign-up');
const loginButton = document.getElementById('login');
const userSignupEmailInput = document.getElementById('user-signup-email');
const userSignupPasswordInput = document.getElementById('user-signup-password');
const userEmailInput = document.getElementById('user-email');
const userPasswordInput = document.getElementById('user-password');

signUpButton.addEventListener('click', (e) => {
    e.preventDefault();

    const userData = {
        email: userSignupEmailInput.value.trim(),
        password: userSignupPasswordInput.value.trim(),
    };

    if (!userData.email || !userData.password) {
        return;
    }

    signUpUser(userData.email, userData.password);
    userSignupEmailInput.value = '';
    userSignupPasswordInput.value = '';
});

loginButton.addEventListener('click', (e) => {
    e.preventDefault();

    const userData = {
        email: userEmailInput.value.trim(),
        password: userPasswordInput.value.trim(),
    };

    if (!userData.email || !userData.password) {
        return;
    }

    loginUser(userData.email, userData.password);
    userEmailInput.value = '';
    userPasswordInput.value = '';
});

function signUpUser(email, password) {
    fetch('/api/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then((response) => {
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to sign up');
        }
    })
    .catch((err) => {
        console.log(err);
    });
}

function loginUser(email, password) {
    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        }),
    })
    .then((response) => {
        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            alert('Failed to log in');
        }
    })
    .catch((err) => {
        console.log(err);
    });
}
});