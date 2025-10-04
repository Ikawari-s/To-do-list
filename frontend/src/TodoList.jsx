import React, { useState } from 'react';

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState('');

  const addTask = () => {
    if (!input.trim()) return;

    setTasks([
      ...tasks,
      { id: Date.now(), text: input.trim(), completed: false }
    ]);
    setInput('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      addTask();
    }
  };

  const toggleTask = (id) => {
    setTasks(
      tasks.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
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
      <ul className="todo-list"> 
        {tasks.map(task => (
          <li key={task.id} className="todo-list-item">
            <span
              onClick={() => toggleTask(task.id)}
              className={`todo-task-text ${task.completed ? 'completed' : ''}`}
            >
              {task.text}
            </span>
            <button onClick={() => deleteTask(task.id)} className="todo-delete-button">
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}; 

export default TodoList;
