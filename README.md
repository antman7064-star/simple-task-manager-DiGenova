# Simple Task Manager

A beginner-friendly task manager that uses an Express REST API and a plain HTML, CSS, and JavaScript frontend. Tasks are kept in server memory, so they reset when the server restarts.

## Run the app

From this folder, install the dependency and start the server:

```sh
npm install
npm start
```

Open the forwarded port 3000 in your browser. In GitHub Codespaces, use the Ports tab if the port notification does not appear.

## Personalize the page

In `public/index.html`, replace `Your Name` in the subtitle with your name before taking the assignment screenshots.

## API routes

- `GET /api/tasks` returns all tasks.
- `POST /api/tasks` creates a task from a JSON body such as `{"text":"Finish the assignment"}`.
- `DELETE /api/tasks/:id` removes a task by ID.
