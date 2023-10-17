document.addEventListener("DOMContentLoaded", () => {
  // LOGOUT FUNCTION
  window.logout = function () {
    document.getElementById("loading").style.display = "block";

    setTimeout(() => {
      // Hide the loading message after 3 seconds
      document.getElementById("loading").style.display = "none";
    }, 3000);

    fetch("/api/users/logout", { method: "POST" })
      .then((response) => {
        console.log(`Received response with status: ${response.status}`); // Log the response status
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
          console.error("Server Response:", text); // Log the server's response text
        }
      })
      .catch((err) => {
        console.error("Error:", err); // Log any fetch errors
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
  // Check if we are on a study room page
  if (window.location.pathname.includes("/studyroom/")) {
    const roomId = window.location.pathname.split("/").pop();

    // Fetch previous messages
    fetch(`/api/studyrooms/${roomId}/messages`)
      .then((response) => response.json())
      .then((messages) => {
        // ... [Rest of the fetch messages logic remains unchanged]
      });

    // Send a new message
    document.getElementById("sendMessage").addEventListener("click", () => {
      const messageContent = document.getElementById("messageInput").value;

      if (messageContent) {
        // Emit the message to the server via socket
        socket.emit("chat message", `You: ${messageContent}`);

        // Clear the input and add the message to the chat
        const messagesDiv = document.getElementById("messages");
        const messageElem = document.createElement("div");
        messageElem.className = "message";
        messageElem.textContent = `You: ${messageContent}`;
        messagesDiv.appendChild(messageElem);
        document.getElementById("messageInput").value = "";

        // Optionally, you can also save the message to the database
        fetch(`/api/studyrooms/${roomId}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: messageContent }),
        });
      }
    });

    // Listen for incoming messages from the server
    socket.on("chat message", (msg) => {
      const messagesDiv = document.getElementById("messages");
      const messageElem = document.createElement("div");
      messageElem.className = "message";
      messageElem.textContent = msg;
      messagesDiv.appendChild(messageElem);
    });
  }
});
