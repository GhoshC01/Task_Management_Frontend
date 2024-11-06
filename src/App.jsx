import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux'; // Access Redux state for user management
import { ToastContainer } from 'react-toastify';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateTask from './pages/CreateTask';
import EditTask from './pages/EditTask'; // Import EditTask component

const App = () => {
  const user = useSelector((state) => state.auth.user); // Accessing user from Redux state

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

        {/* Protected Routes */}
        <Route path="/dashboard" element={user ? <Dashboard /> : <Navigate to="/" />} />
        <Route path="/create-task" element={user ? <CreateTask /> : <Navigate to="/" />} />
        <Route path="/edit-task/:id" element={user ? <EditTask /> : <Navigate to="/" />} /> {/* Add EditTask route */}
      </Routes>
      <ToastContainer />
    </Router>
  );
};

export default App;
