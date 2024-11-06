import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTasks, deleteTask } from '../slices/tasksSlice';
import { Link } from 'react-router-dom';
import { logoutUser } from '../slices/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { tasks } = useSelector((state) => state.tasks);
  const [filter, setFilter] = useState('All');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  // Local state to manage tasks
  const [localTasks, setLocalTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedTasks = await dispatch(fetchTasks()).unwrap();
      setLocalTasks(fetchedTasks); // Set the local state with fetched tasks
    };
    fetchData();
  }, [dispatch]);

  // Filter tasks based on selected status
  const filteredTasks = filter === 'All' ? localTasks : localTasks.filter(task => task.status === filter);

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await dispatch(deleteTask(taskId)).unwrap();

        // Immediately remove the deleted task from local state
        setLocalTasks(prevTasks => prevTasks.filter(task => task._id !== taskId));
        setMessage('Task deleted successfully!');
        setMessageType('success');
      } catch (error) {
        setMessage('Failed to delete the task. Please try again.');
        setMessageType('error');
      }
    }
  };

  // Handle task update success
  useEffect(() => {
    if (messageType === 'success') {
      setMessage('Task updated successfully!');
      setMessageType('success');
    }
  }, [messageType]);

  const handleLogout = () => {
    dispatch(logoutUser());
    alert('Logout Successfully')
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Task Dashboard</h2>

      {message && (
        <div className={`mb-4 p-2 text-white rounded-md ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {message}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="filter" className="block text-gray-700 mb-2">Filter by Status:</label>
        <select
          id="filter"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <ul className="space-y-4">
        {filteredTasks.map((task) => (
          <li key={task._id} className="flex justify-between items-center p-4 border border-gray-200 rounded-md">
            <div>
              <h3 className="text-lg font-semibold">{task.title}</h3>
              <p className="text-gray-600">{task.description}</p>
              <span className={`text-sm font-medium ${task.status === 'Completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                Status: {task.status}
              </span>
            </div>
            <div className="space-x-2">
              <Link to={`/edit-task/${task._id}`}>
                <button className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200">
                  Edit
                </button>
              </Link>
              <button
                type="button"
                onClick={() => handleDelete(task._id)}
                className="px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-200"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      <Link to="/create-task">
        <button className="mt-4 px-4 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition duration-200">
          Create New Task
        </button>
      </Link>

      {/* Logout button */}
      <button
        onClick={handleLogout}
        className="mt-4 ml-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
