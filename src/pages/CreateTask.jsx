import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../slices/tasksSlice';
import { Link } from 'react-router-dom'; // Import Link

const CreateTask = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending');
  const [dueDate, setDueDate] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const dispatch = useDispatch();
  const taskStatus = useSelector((state) => state.tasks.status);
  const taskError = useSelector((state) => state.tasks.error);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(createTask({ title, description, status, dueDate }));

    if (resultAction.type === 'tasks/createTask/fulfilled') {
      setSuccessMessage('Task added successfully!');
      setTitle('');
      setDescription('');
      setStatus('Pending');
      setDueDate('');
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Create Task</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
        >
          Add Task
        </button>
      </form>
      
      {taskStatus === 'failed' && <p className="text-red-500 mt-2">{taskError.message || 'An error occurred'}</p>}
      {successMessage && <p className="text-green-500 mt-2">{successMessage}</p>}
      
      {/* Dashboard link using Link component */}
      <Link to="/dashboard">
        <button className="w-full mt-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700 transition duration-200">
          Go to Dashboard
        </button>
      </Link>
    </div>
  );
};

export default CreateTask;
