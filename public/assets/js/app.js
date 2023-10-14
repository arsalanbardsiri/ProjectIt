document.addEventListener("DOMContentLoaded", (event) => {

  // LOGOUT FUNCTION
  window.logout = function () {
    fetch("/users/logout", { method: "POST" })
      .then((response) => {
        if (response.status === 204) {
          window.location.href = "/login";
        } else if (response.status === 404) {
          console.error("User session not found.");
          return response.text();
        } else if (response.status === 500) {
          console.error("Internal Server Error during logout.");
          return response.text();
        } else {
          console.error(
            "Logout was not successful. HTTP Status:",
            response.status
          );
          return response.text();
        }
      })
      .then((text) => {
        if (text) {
          console.error("Server Response:", text);
        }
      })
      .catch((err) => {
        console.error("Error:", err);
      });
  };

  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");

  // Login form event listener
  if (loginForm) {
    loginForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const userData = {
        email: document.getElementById("email-login").value,
        password: document.getElementById("password-login").value,
      };

      fetch("/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Login successful!") {
            window.location.href = "/dashboard";
          } else {
            alert(data.message);
          }
        });
    });
  }

  // Registration form event listener
  if (registerForm) {
    registerForm.addEventListener("submit", function (event) {
      event.preventDefault();
      const userData = {
        username: document.getElementById("username-register").value,
        email: document.getElementById("email-register").value,
        password: document.getElementById("password-register").value,
      };

      fetch("/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.message === "Registration successful!") {
            window.location.href = "/dashboard";
          } else {
            alert(data.message);
          }
        });
    });
  }
});
