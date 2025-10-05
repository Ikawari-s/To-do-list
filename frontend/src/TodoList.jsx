import React, { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:3000/api/tasks';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);

  // Fetch tasks on mount
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await fetch(API_BASE);
        const data = await res.json();
        setTasks(data);
        setLoading(false);
      } catch (err) {
        console.error('Failed to fetch tasks:', err);
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // Add a new task
  const addTask = async () => {
    if (!input.trim()) return;

    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: input.trim() })
      });

      const newTask = await res.json();
      setTasks([newTask, ...tasks]);
      setInput('');
    } catch (err) {
      console.error('Failed to add task:', err);
    }
  };

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  // Toggle completed state
  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !task.completed })
      });

      const updated = await res.json();

      setTasks(tasks.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      console.error('Failed to toggle task:', err);
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });

      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  return (
    <div className="todo-container">
      <h1 className="todo-title">To-Do List</h1>

      <div className="todo-input-group">
        <input
          className="todo-input"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add a new task"
        />
        <button onClick={addTask} className="todo-add-button">Add</button>
      </div>

      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <ul className="todo-list">
          {tasks.map(task => (
            <li key={task.id} className="todo-list-item">
              <span
                onClick={() => toggleTask(task.id)}
                className={`todo-task-text ${task.completed ? 'completed' : ''}`}
              >
                {task.title}
              </span>
              <button onClick={() => deleteTask(task.id)} className="todo-delete-button">
                ✕
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
