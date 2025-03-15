import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(""); // Optional profile image URL
  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    // Constructing the payload for the request
    const userPayload = {
      name,
      email,
      password,
      profile_image: profileImage, // Optional
    };

    try {
      const response = await fetch("https://supe-cook-backend.vercel.app/users/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userPayload),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.detail || "Signup failed");
      }

      alert(data.message);
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-green-500 to-teal-600 p-4 relative">
      {/* Go Back to Home Button */}
      <Link
        to="/"
        className="absolute top-4 left-4 p-2 bg-white text-green-600 rounded-md shadow-md hover:bg-gray-100 transition duration-300"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          />
        </svg>
      </Link>

      <div className="w-full max-w-md p-6 sm:p-8 bg-white shadow-xl rounded-xl space-y-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-800">Create Account</h2>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">Name</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-300"
              required
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-300"
              required
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-300"
              required
              placeholder="Enter your password"
            />
          </div>

          <div>
            <label htmlFor="profileImage" className="block text-sm font-medium text-gray-600">Profile Image URL</label>
            <input
              type="text"
              id="profileImage"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="w-full p-3 sm:p-4 rounded-md border border-gray-300 focus:ring-2 focus:ring-green-500 focus:outline-none transition duration-300"
            />
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
          >
            Sign Up
          </button>
        </form>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
