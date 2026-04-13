const form = document.getElementById("taskForm");
const input = document.getElementById("taskInput");
const list = document.getElementById("taskList");
const filters = document.querySelectorAll(".filters button");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";

// ADD TASK
form.addEventListener("submit", e => {
  e.preventDefault();

  const task = {
    id: Date.now(),
    text: input.value,
    done: false
  };

  tasks.push(task);
  input.value = "";
  saveAndRender();
});

// RENDER
function render() {
  list.innerHTML = "";

  let filtered = tasks.filter(task => {
    if (currentFilter === "active") return !task.done;
    if (currentFilter === "done") return task.done;
    return true;
  });

  filtered.forEach(task => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    if (task.done) li.classList.add("done");

    // TOGGLE DONE
    text.addEventListener("click", () => {
      task.done = !task.done;
      saveAndRender();
    });

    // EDIT
    text.addEventListener("dblclick", () => {
      const editInput = document.createElement("input");
      editInput.value = task.text;
      editInput.className = "edit-input";

      li.replaceChild(editInput, text);
      editInput.focus();

      editInput.addEventListener("keydown", e => {
        if (e.key === "Enter") {
          task.text = editInput.value;
          saveAndRender();
        }
        if (e.key === "Escape") {
          render();
        }
      });
    });

    // DELETE BUTTON
    const del = document.createElement("span");
    del.textContent = "✕";
    del.className = "delete";

    del.addEventListener("click", () => {
      tasks = tasks.filter(t => t.id !== task.id);
      saveAndRender();
    });

    li.appendChild(text);
    li.appendChild(del);
    list.appendChild(li);
  });
}

// FILTER
filters.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;

    filters.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    render();
  });
});

// SAVE
function saveAndRender() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  render();
}

// INIT
render();