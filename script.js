let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

const taskForm = document.getElementById("taskForm");
const taskList = document.getElementById("taskList");

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  addTask();
});

function addTask() {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const dueDate = document.getElementById("dueDate").value;

  const task = {
    id: Date.now(),
    title,
    description,
    dueDate,
    complete: false
  };

  tasks.push(task);
  saveTasks();
  renderTasks();
  taskForm.reset();
}

function renderTasks(filter = "all") {
  taskList.innerHTML = "";
  tasks.forEach(task => {
    if (filter === "complete" && !task.complete) return;
    if (filter === "incomplete" && task.complete) return;

    const li = document.createElement("li");
    li.className = task.complete ? "complete" : "";

    li.innerHTML = `
      <div>
        <strong>${task.title}</strong> - ${task.description} <br>
        Due: ${task.dueDate}
      </div>
      <div>
        <button onclick="toggleComplete(${task.id})">${task.complete ? "Undo" : "Complete"}</button>
        <button onclick="editTask(${task.id})">Edit</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;

    taskList.appendChild(li);

    // Reminder feature: alert if deadline is within 1 day
    const due = new Date(task.dueDate);
    const now = new Date();
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    if (diff <= 1 && !task.complete) {
      li.style.border = "2px solid red";
    }
  });
}

function toggleComplete(id) {
  tasks = tasks.map(task => task.id === id ? {...task, complete: !task.complete} : task);
  saveTasks();
  renderTasks();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  document.getElementById("title").value = task.title;
  document.getElementById("description").value = task.description;
  document.getElementById("dueDate").value = task.dueDate;
  deleteTask(id); // remove old version, will re-add on submit
}

function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks();
}

function filterTasks(type) {
  renderTasks(type);
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Initial render
renderTasks();