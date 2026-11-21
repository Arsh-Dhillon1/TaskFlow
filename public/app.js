
const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const message = document.getElementById("message");

// Get all tasks from backend
async function loadTasks() {
    try {
        const response = await fetch("/api/tasks");
        const tasks = await response.json();

        taskList.innerHTML = "";

        tasks.forEach(task => {
            const li = document.createElement("li");

            if (task.completed) {
                li.classList.add("completed");
            }

            const span = document.createElement("span");
            span.textContent = task.title;

            const completeButton = document.createElement("button");
            completeButton.textContent = task.completed
                ? "Undo"
                : "Complete";

            completeButton.onclick = () => toggleTask(task.id);

            const deleteButton = document.createElement("button");
            deleteButton.textContent = "Delete";
            deleteButton.classList.add("delete-btn");
            deleteButton.onclick = () => deleteTask(task.id);

            li.append(span, completeButton, deleteButton);
            taskList.appendChild(li);
        });
    } catch (error) {
        message.textContent = "Could not connect to the server.";
    }
}

// Add a task
taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = taskInput.value.trim();

    if (!title) return;

    await fetch("/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ title })
    });

    taskInput.value = "";
    message.textContent = "";
    loadTasks();
});

// Complete or undo a task
async function toggleTask(id) {
    await fetch(`/api/tasks/${id}`, {
        method: "PATCH"
    });

    loadTasks();
}

// Delete a task
async function deleteTask(id) {
    await fetch(`/api/tasks/${id}`, {
        method: "DELETE"
    });

    loadTasks();
}

// Initial loading
loadTasks();
