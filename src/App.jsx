import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addTodo, deleteTodo, toggleTodo } from './App/Features/Todo/todoSlice';

const App = () => {
  const [text, SetText] = useState();
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
        dispatch(addTodo(`${text} (edited)`));
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

  return (
    <div>
      <div className=' flex items-center justify-center mt-20'>
        <h1 className='text-3xl font-bold text-blue-600'>Redux Todo App</h1>
      </div>
      <div className='text-center mx-auto mt-20  '>
        <div>
          <input
            type='text'
            value={text}
            onChange={e => SetText(e.target.value)}
            placeholder='Enter your Todo list'
            className='w-60 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm text-gray-700 placeholder-gray-400'
          />
          <button
            className='px-4 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200'
            onClick={handleAddTodo}
          >
            {editId ? 'Edit Todo' : 'Add Todo'}
          </button>
        </div>
        <div>
          <ul>
            {todos.map(todo => (
              <>
                <li
                  kay={todo.id}
                  className={`flex justify-between items-center p-3 rounded-lg shadow-lg ${
                    todo.completed ? 'bg-green-100' : 'bg-gray-100'
                  }`}
                >
                  <div
                    onClick={() => dispatch(toggleTodo(todo.id))}
                    className={` flex flex-col cursor-pointer ${
                      todo.completed
                        ? 'line-through text-gray-500'
                        : 'text-gray-800'
                    }`}
                  >
                    <span>{todo.text}</span>
                    <span>{new Date(todo.id).toLocaleString()}</span>
                  </div>

                  <div class='flex space-x-2'>
                    <button
                      onClick={() => handleEditTodo(todo)}
                      class='px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition'
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => dispatch(deleteTodo(todo.id))}
                      class='px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition'
                    >
                      Delete
                    </button>
                  </div>
                </li>
              </>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default App;
