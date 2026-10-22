const API_URL = '/api/tasks';
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const taskCount = document.getElementById('task-count');
const statusMessage = document.getElementById('status-message');
const addButton = taskForm.querySelector('button[type="submit"]');

function setStatus(message, isError = false) {
    statusMessage.textContent = message;
    statusMessage.dataset.error = String(isError);
}

async function getErrorMessage(response) {
    const result = await response.json().catch(() => ({}));
    return result.error || `Request failed (${response.status}).`;
}

function renderTasks(tasks) {
    taskList.replaceChildren();
    taskCount.textContent = `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`;

    if (tasks.length === 0) {
        const emptyState = document.createElement('li');
        emptyState.className = 'empty-state';
        emptyState.textContent = 'No tasks yet. Add one above to get started.';
        taskList.appendChild(emptyState);
        return;
    }

    tasks.forEach((task) => {
        const item = document.createElement('li');
        item.className = 'task-item';

        const text = document.createElement('span');
        text.className = 'task-text';
        text.textContent = task.text;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete-button';
        deleteButton.type = 'button';
        deleteButton.dataset.taskId = task.id;
        deleteButton.textContent = 'Delete';
        deleteButton.setAttribute('aria-label', `Delete task: ${task.text}`);

        item.append(text, deleteButton);
        taskList.appendChild(item);
    });
}

async function fetchTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        renderTasks(await response.json());
        setStatus('');
    } catch (error) {
        setStatus(`Could not load tasks: ${error.message}`, true);
        taskCount.textContent = 'Unavailable';
    }
}

taskForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const text = taskInput.value.trim();

    if (!text) {
        setStatus('Enter a task before adding it.', true);
        taskInput.focus();
        return;
    }

    addButton.disabled = true;
    setStatus('');

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        taskInput.value = '';
        await fetchTasks();
    } catch (error) {
        setStatus(`Could not add task: ${error.message}`, true);
    } finally {
        addButton.disabled = false;
    }
});

taskList.addEventListener('click', async (event) => {
    const deleteButton = event.target.closest('button[data-task-id]');

    if (!deleteButton) {
        return;
    }

    deleteButton.disabled = true;
    setStatus('');

    try {
        const response = await fetch(`${API_URL}/${deleteButton.dataset.taskId}`, {
            method: 'DELETE'
        });

        if (!response.ok) {
            throw new Error(await getErrorMessage(response));
        }

        await fetchTasks();
    } catch (error) {
        deleteButton.disabled = false;
        setStatus(`Could not delete task: ${error.message}`, true);
    }
});

fetchTasks();
