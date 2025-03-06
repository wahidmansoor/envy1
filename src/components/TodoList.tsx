import React, { useState } from 'react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: '1', text: 'Complete patient evaluation', completed: false },
    { id: '2', text: 'Review lab results', completed: false },
    { id: '3', text: 'Update treatment plan', completed: false }
  ]);
  const [newTodo, setNewTodo] = useState('');

  const toggleTodo = (id: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const addTodo = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newTodo.trim()) {
      setTodos([...todos, {
        id: Date.now().toString(),
        text: newTodo,
        completed: false
      }]);
      setNewTodo('');
    }
  };

  return (
    <div className="mt-6 p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium mb-4">Todo List</h3>
      <form onSubmit={addTodo} className="mb-4">
        <div className="flex gap-2">
          <label htmlFor="new-task" className="sr-only">Add a new task</label>
          <input
            type="text"
            id="new-task"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task"
            className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Add Task
          </button>
        </div>
      </form>
      <ul className="space-y-2">
        {todos.map(todo => (
          <li
            key={todo.id}
            className="flex items-center justify-between p-3 rounded-md"
          >
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo.id)}
                  className="w-4 h-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  aria-label={`Mark "${todo.text}" as ${todo.completed ? 'not completed' : 'completed'}`}
                />
                <span className={`${todo.completed ? 'line-through text-gray-400' : ''}`}>
                  {todo.text}
                </span>
              </label>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
