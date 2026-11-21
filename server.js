
const express = require("express");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());

// Serve frontend files
app.use(express.static("public"));

// Temporary in-memory storage
let tasks = [];
let nextId = 1;

// GET: Retrieve all tasks
app.get("/api/tasks", (req, res) => {
    res.json(tasks);
});

// POST: Create a task
app.post("/api/tasks", (req, res) => {
    const { title } = req.body;

    if (!title || !title.trim()) {
        return res.status(400).json({
            message: "Task title is required"
        });
    }

    const newTask = {
        id: nextId++,
        title: title.trim(),
        completed: false
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

// PATCH: Toggle task completion
app.patch("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const task = tasks.find(task => task.id === id);

    if (!task) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    task.completed = !task.completed;

    res.json(task);
});

// DELETE: Delete a task
app.delete("/api/tasks/:id", (req, res) => {
    const id = Number(req.params.id);

    const taskExists = tasks.some(task => task.id === id);

    if (!taskExists) {
        return res.status(404).json({
            message: "Task not found"
        });
    }

    tasks = tasks.filter(task => task.id !== id);

    res.json({
        message: "Task deleted successfully"
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`TaskFlow server running at http://localhost:${PORT}`);
});
