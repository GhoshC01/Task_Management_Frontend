import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask } from '../slices/tasksSlice'; // Import the updateTask action
import { useParams, useNavigate } from 'react-router-dom';

const EditTask = () => {
  const { id } = useParams(); // Get the task ID from the URL
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { tasks, error } = useSelector((state) => state.tasks); // Get tasks from state

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('Pending'); // Fixed variable name from statuss to status

  useEffect(() => {
    // Find the task to edit from the tasks array
    const task = tasks.find((task) => task._id === id);
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setStatus(task.status); // Setting the status correctly
    }
  }, [tasks, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Dispatching the updateTask action with the correct updatedData
      await dispatch(updateTask({ id, updatedData: { title, description, status } })).unwrap();
      // On success, navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Edit Task</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-gray-700">Title:</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-gray-700">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-gray-700">Status:</label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        </div>

        <div className="flex justify-between mt-4">
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
          >
            Update
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-4 py-2 bg-gray-600 text-white font-semibold rounded-md hover:bg-gray-700"
          >
            Cancel
          </button>
        </div>
      </form>

      {error && <p className="mt-4 text-red-500">{error}</p>}
    </div>
  );
};

export default EditTask;
