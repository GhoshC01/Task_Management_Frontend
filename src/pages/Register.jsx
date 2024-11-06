import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../slices/authSlice"; // Replace with the actual slice path
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Import the useNavigate hook
  const { status, error } = useSelector((state) => state.auth); // Ensure 'auth' is the slice name

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({ username, password }))
      .unwrap()
      .then(() => {
        navigate("/dashboard"); // Navigate to Dashboard upon successful registration
      });
    alert("Registration successfull").catch((error) => {
      console.error("Registration failed:", error);
      alert("Registration successfull");
    });
  };

  // Show toast notifications based on registration status
  useEffect(() => {
    if (status === "succeeded") {
      alert("Registration successful!");
    } else if (status === "failed") {
      alert(`Registration failed: ${error}`);
    }
  }, [status, error]); // Re-run whenever status or error changes

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-700 mb-6">
          Register
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {status === "loading" ? "Registering..." : "Register"}
          </button>
          <div>
            <Link to="/">Already registered? Please log in</Link>
          </div>
        </form>

        {/* Show error if registration failed */}
        {status === "failed" && (
          <p className="mt-4 text-red-500 text-center">
            Registration failed: {error}
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;
