import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let nextTaskId = 3;
let tasks = [
    { id: 1, text: 'Learn Node.js and Express basics' },
    { id: 2, text: 'Build a REST API frontend' }
];

app.get('/api/tasks', (req, res) => {
    res.status(200).json(tasks);
});

app.post('/api/tasks', (req, res) => {
    const text = typeof req.body?.text === 'string' ? req.body.text.trim() : '';

    if (!text) {
        return res.status(400).json({ error: 'Task text is required.' });
    }

    const newTask = { id: nextTaskId, text };
    nextTaskId += 1;
    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.delete('/api/tasks/:id', (req, res) => {
    const taskId = Number(req.params.id);

    if (!Number.isSafeInteger(taskId)) {
        return res.status(400).json({ error: 'Task ID must be a valid number.' });
    }

    const initialLength = tasks.length;
    tasks = tasks.filter((task) => task.id !== taskId);

    if (tasks.length === initialLength) {
        return res.status(404).json({ error: 'Task not found.' });
    }

    res.status(200).json({ success: true, message: `Task ${taskId} deleted.` });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
