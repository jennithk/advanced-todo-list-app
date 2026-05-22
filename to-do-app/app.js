const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");
const filterButtons = document.querySelectorAll(".filter-btn");
const searchInput = document.getElementById("searchInput");
const taskCounter = document.getElementById("taskCounter");
const clearCompleted = document.getElementById("clearCompleted");
const themeToggle = document.getElementById("themeToggle");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";
let searchTerm = "";

function saveTodos() {
  localStorage.setItem("todos", JSON.stringify(todos));
}

function updateCounter() {
  taskCounter.textContent = `${todos.length} Tasks`;
}

function renderTodos() {

  todoList.innerHTML = "";

  let filteredTodos = todos.filter((todo) => {

    const matchesSearch = todo.text
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (currentFilter === "active") {
      return todo.completed === false && matchesSearch;
    }

    if (currentFilter === "completed") {
      return todo.completed === true && matchesSearch;
    }

    return matchesSearch;
  });

  filteredTodos.forEach((todo) => {

    const li = document.createElement("li");

    li.className = `todo-item ${
      todo.completed ? "completed" : ""
    }`;

    li.dataset.id = todo.id;

    li.innerHTML = `
      <span>${todo.text}</span>

      <div class="actions">

        <input
          type="checkbox"
          class="toggle"
          ${todo.completed ? "checked" : ""}
        >

        <button class="edit">Edit</button>

        <button class="delete">Delete</button>

      </div>
    `;

    todoList.appendChild(li);
  });

  updateCounter();
}

function addTodo() {

  const text = taskInput.value.trim();

  if (!text) return;

  const newTodo = {
    id: Date.now(),
    text: text,
    completed: false
  };

  todos.push(newTodo);

  saveTodos();

  renderTodos();

  taskInput.value = "";
}

addBtn.addEventListener("click", addTodo);

taskInput.addEventListener("keypress", (e) => {

  if (e.key === "Enter") {
    addTodo();
  }

});

searchInput.addEventListener("input", (e) => {

  searchTerm = e.target.value;

  renderTodos();

});

todoList.addEventListener("click", (e) => {

  const li = e.target.closest(".todo-item");

  if (!li) return;

  const id = Number(li.dataset.id);

  if (e.target.classList.contains("delete")) {

    todos = todos.filter(todo => todo.id !== id);

    saveTodos();

    renderTodos();
  }

  if (e.target.classList.contains("edit")) {

    const todo = todos.find(todo => todo.id === id);

    const newText = prompt("Edit task:", todo.text);

    if (newText !== null && newText.trim() !== "") {

      todo.text = newText.trim();

      saveTodos();

      renderTodos();
    }
  }

});

todoList.addEventListener("change", (e) => {

  if (e.target.classList.contains("toggle")) {

    const li = e.target.closest(".todo-item");

    if (!li) return;

    const id = Number(li.dataset.id);

    todos = todos.map(todo => {

      if (todo.id === id) {

        return {
          ...todo,
          completed: e.target.checked
        };
      }

      return todo;
    });

    saveTodos();

    renderTodos();
  }

});

filterButtons.forEach((button) => {

  button.addEventListener("click", () => {

    filterButtons.forEach((btn) => {
      btn.classList.remove("active");
    });

    button.classList.add("active");

    currentFilter = button.dataset.filter;

    renderTodos();

  });

});

clearCompleted.addEventListener("click", () => {

  todos = todos.filter(todo => !todo.completed);

  saveTodos();

  renderTodos();

});

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {

  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {

    localStorage.setItem("theme", "dark");

  } else {

    localStorage.setItem("theme", "light");
  }

});

renderTodos();