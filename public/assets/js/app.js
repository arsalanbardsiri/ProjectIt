function scrollToBottomOfChat() {
  let messagesDiv = document.getElementById("messages");
  if (messagesDiv) {
    setTimeout(() => {
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }, 100); // Delay of 100ms
  }
}

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

  // Chat Functionality
  const messagesDiv = document.getElementById("messages");
  if (messagesDiv) {
    const roomId = document.body.getAttribute("data-room-id"); // Get roomId from the data attribute

    let currentPage = 1;
    loadMessages();

    window.addEventListener("scroll", function () {
      if (
        window.innerHeight + window.scrollY >=
        document.body.offsetHeight - 500
      ) {
        loadMessages();
      }
    });

    function loadMessages() {
      fetch(`/api/studyrooms/${roomId}/messages?page=${currentPage}`)
        .then((response) => response.json())
        .then((messages) => {
          messages.reverse().forEach((msg) => {
            // Note the addition of .reverse() here
            const messageElem = document.createElement("div");
            messageElem.className = "message";
            messageElem.textContent = `${msg.user.username} at ${msg.createdAt}: ${msg.message}`;
            messagesDiv.appendChild(messageElem);
          });
          currentPage++;
          scrollToBottomOfChat();
        });
    }

    // Socket.io code
    const socketHost =
      window.location.hostname === "localhost"
        ? "http://localhost:3001"
        : window.location.origin;

    const socket = io(socketHost, { withCredentials: true });

    function appendMessageToChat(msg) {
      const messageElem = document.createElement("div");
      messageElem.className = "message";
      messageElem.textContent = `${msg.user} at ${msg.timestamp}: ${msg.message}`;
      messagesDiv.appendChild(messageElem);
    }

    function clearMessageInput() {
      document.getElementById("messageInput").value = "";
    }

    socket.on("connect", () => {
      console.log("Successfully connected to the server.");
      socket.emit("join room", roomId);
    });

    socket.on("connect_error", (error) => {
      console.error("Failed to connect to the server:", error);
    });

    document
      .getElementById("sendMessage")
      .addEventListener("click", function () {
        const messageContent = document.getElementById("messageInput").value;
        if (messageContent.trim() === "") return;
        socket.emit("chat message", messageContent, roomId);
        clearMessageInput();
      });

    document
      .getElementById("messageInput")
      .addEventListener("keypress", function (event) {
        if (event.keyCode === 13 && !event.shiftKey) {
          event.preventDefault();
          document.getElementById("sendMessage").click();
        }
      });

    socket.on("chat message", (msg) => {
      appendMessageToChat(msg);
  scrollToBottomOfChat();
    });
  }
});
