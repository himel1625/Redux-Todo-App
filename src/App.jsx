import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo, toggleTodo } from './App/Features/Todo/todoSlice';

const App = () => {
  const [text, SetText] = useState('');
  const [editId, setEditId] = useState(null);
  const todos = useSelector(state => state.todos);
  const dispatch = useDispatch();

  useEffect(() => {
    const saveTodos = JSON.parse(localStorage.getItem('todos')) || [];
    if (saveTodos.length > 0) {
      saveTodos.forEach(todo => {
        dispatch({
          type: 'todos/loadFromStorage',
          payload: todo,
        });
      });
    }
  }, [dispatch]);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (text.trim()) {
      if (editId) {
        dispatch(deleteTodo(editId));
        dispatch(addTodo(`${text} (Edited)`));
        setEditId(null);
      } else {
        dispatch(addTodo(text));
      }
      SetText('');
    }
  };

  const handleEditTodo = todo => {
    SetText(todo.text);
    setEditId(todo.id);
  };

  // const handleDeleteTodo = id => {
  //   dispatch(deleteTodo(id));
  // };
  return (
    <div className='min-h-screen bg-gray-100 text-gray-800 py-10 px-4'>
      <div className='max-w-3xl mx-auto bg-white shadow-md rounded-lg p-6'>
        <h1 className='text-3xl font-bold text-center mb-6 text-[#2F4F6F]'>
          Redux Todo App
        </h1>
        <div className='flex flex-col sm:flex-row items-center justify-center gap-4 mb-6'>
          <input
            type='text'
            value={text}
            onChange={e => SetText(e.target.value)}
            placeholder='Enter your Todo...'
            className='w-full sm:w-auto flex-grow px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F4F6F] bg-gray-50 text-gray-700 placeholder-gray-400'
          />
          <button
            className='px-6 py-2 bg-[#2F4F6F] text-white font-semibold rounded-lg shadow-md hover:bg-[#243b55] focus:outline-none focus:ring-2 focus:ring-[#2F4F6F] transition duration-200 cursor-pointer'
            onClick={handleAddTodo}
          >
            {editId ? 'Edit Todo' : 'Add Todo'}
          </button>
        </div>
        <div className='space-y-4'>
          {todos.map(todo => (
            <div
              key={todo.id}
              className={`flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg shadow-sm transition duration-200 cursor-pointer ${
                todo.completed ? 'bg-green-100' : 'bg-gray-50'
              }`}
            >
              <div
                onClick={() => dispatch(toggleTodo(todo.id))}
                className={`flex flex-col cursor-pointer w-full sm:w-auto ${
                  todo.completed
                    ? 'line-through text-gray-500'
                    : 'text-gray-800'
                }`}
              >
                <span className='text-lg font-bold'>{todo.text}</span>
                <span className='text-sm text-gray-500'>
                  {new Date(todo.id).toLocaleString()}
                </span>
              </div>
              <div className='flex space-x-2 mt-2 sm:mt-0'>
                <button
                  onClick={() => handleEditTodo(todo)}
                  className='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition cursor-pointer'
                >
                  Edit
                </button>
                <button
                  onClick={() => dispatch(deleteTodo(todo.id))}
                  // onClick={() => handleDeleteTodo(todo.id)}
                  className='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition cursor-pointer'
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
        {todos.length === 0 && (
          <p className='text-center text-gray-500 mt-6'>
            No todos yet! Add some tasks to get started.
          </p>
        )}
      </div>
    </div>
  );
};

export default App;
