const API_URL = "http://localhost:5501";
let token = localStorage.getItem("token");

// Identify the current page
const page = window.location.pathname;

// Handle Sign-Up Page
if (page === "/signup.html") {
  document
    .getElementById("signupForm")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("signupUsername").value;
      const password = document.getElementById("signupPassword").value;

      try {
        const response = await fetch(`${API_URL}/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });
        const result = await response.json();
        if (response.ok) {
          alert("Sign-Up successful! Please log in.");
          window.location.href = "/login.html";
        } else {
          alert(result.message || "Sign-Up failed");
        }
      } catch (error) {
        console.error("Error signing up:", error);
      }
    });
}

// Handle Login Page
if (page === "/login.html") {
  document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("loginUsername").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json();
      if (response.ok) {
        localStorage.setItem("token", result.token);
        window.location.href = "/tasks.html";
      } else {
        alert(result.message || "Login failed");
      }
    } catch (error) {
      console.error("Error logging in:", error);
    }
  });
}

// Handle Tasks Page
if (page === "/tasks.html") {
  const todoForm = document.getElementById("todoForm");
  const todoList = document.getElementById("todoList");

  async function fetchTasks() {
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const tasks = await response.json();
      renderTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  function renderTasks(tasks) {
    todoList.innerHTML = "";
    tasks.forEach((task) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${task.title}</span>
        <div>
          ${
            task.state === "pending"
              ? `<button onclick="updateTaskState('${task._id}', 'completed')">Complete</button>`
              : ""
          }
          ${
            task.state !== "deleted"
              ? `<button onclick="updateTaskState('${task._id}', 'deleted')">Delete</button>`
              : ""
          }
        </div>
      `;
      todoList.appendChild(li);
    });
  }

  async function updateTaskState(taskId, newState) {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ state: newState }),
      });
      if (response.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error(`Error updating task state to ${newState}:`, error);
    }
  }

  window.updateTaskState = updateTaskState;

  todoForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newTask = {
      title: document.getElementById("todoInput").value,
    };
    try {
      const response = await fetch(`${API_URL}/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newTask),
      });
      if (response.ok) {
        fetchTasks();
        todoForm.reset();
      }
    } catch (error) {
      console.error("Error adding task:", error);
    }
  });

  fetchTasks();

  // Logout functionality
  if (document.getElementById("logoutButton")) {
    document.getElementById("logoutButton").addEventListener("click", () => {
      localStorage.removeItem("token");
      window.location.href = "/login.html";
    });
  }
}
