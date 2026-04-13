import { useEffect, useState, useRef } from "react";
import "./App.css";

export default function App() {
  const [tasks, setTasks] = useState(() => {
    return JSON.parse(localStorage.getItem("tasks")) || [];
  });

  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  const inputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  function addTask(e) {
    e.preventDefault();
    if (!input.trim()) return;

    setTasks([
      ...tasks,
      { id: Date.now(), text: input, done: false }
    ]);

    setInput("");
  }

  function toggleTask(id) {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, done: !t.done } : t
    ));
  }

  function deleteTask(id) {
    setTasks(tasks.filter(t => t.id !== id));
  }

  function editTask(id, text) {
    setTasks(tasks.map(t =>
      t.id === id ? { ...t, text } : t
    ));
  }

  function clearCompleted() {
    setTasks(tasks.filter(t => !t.done));
  }

  const filtered = tasks
    .filter(t => {
      if (filter === "active") return !t.done;
      if (filter === "done") return t.done;
      return true;
    })
    .filter(t =>
      t.text.toLowerCase().includes(search.toLowerCase())
    );

  return (
    <div className="app">

      {/* HEADER */}
      <header className="topbar">
        <div className="brand">TASK SYSTEM</div>

        <div className="meta">
          <span>{tasks.filter(t => !t.done).length} ACTIVE</span>
          <span>{tasks.filter(t => t.done).length} DONE</span>
        </div>
      </header>

      {/* HERO */}
      <div className="hero">
        <h1>EXECUTE WITH CLARITY</h1>
        <p>A system for structured work</p>
      </div>

      {/* INPUT */}
      <form onSubmit={addTask} className="inputWrap">
        <input
          ref={inputRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Write a task..."
        />
      </form>

      {/* SEARCH */}
      <input
        className="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* FILTER */}
      <div className="filters">
        {["all", "active", "done"].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={filter === f ? "active" : ""}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      {/* ACTION BAR */}
      <div className="actionsBar">
        <button onClick={clearCompleted}>
          CLEAR COMPLETED
        </button>
      </div>

      {/* EMPTY */}
      {filtered.length === 0 && (
        <div className="empty">
          <p>No tasks found</p>
        </div>
      )}

      {/* LIST */}
      <ul className="list">
        {filtered.map(task => (
          <TaskItem
            key={task.id}
            task={task}
            toggle={toggleTask}
            remove={deleteTask}
            edit={editTask}
          />
        ))}
      </ul>

    </div>
  );
}

// COMPONENT
function TaskItem({ task, toggle, remove, edit }) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(task.text);

  return (
    <li className={task.done ? "done fade-in" : "fade-in"}>

      {editing ? (
        <input
          className="edit"
          value={value}
          autoFocus
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              edit(task.id, value);
              setEditing(false);
            }
            if (e.key === "Escape") {
              setEditing(false);
              setValue(task.text);
            }
          }}
        />
      ) : (
        <span onClick={() => toggle(task.id)}>
          {task.text}
        </span>
      )}

      <div className="actions">
        <button onClick={() => setEditing(true)}>EDIT</button>
        <button onClick={() => remove(task.id)}>DELETE</button>
      </div>

    </li>
  );
}