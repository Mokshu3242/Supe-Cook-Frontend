import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch the user's profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("access_token"); // Assuming token is stored in localStorage
        if (!token) {
          navigate("/login"); // Redirect to login if not authenticated
          return;
        }

        const response = await fetch("https://supe-cook-backend.vercel.app/users/profile", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Failed to fetch profile");
        }

        const data = await response.json();
        setName(data.name);
        setEmail(data.email);
        setProfileImage(data.profile_image || ""); // Default to empty string if profile_image is null
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  console.log("Profile Image URL:", profileImage);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("https://supe-cook-backend.vercel.app/users/", {
        method: "PUT", // PUT request to update profile
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name,
          email,
          profile_image: profileImage || null, // Ensure that profile image is null if not provided
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.detail || "Profile update failed");
      }

      alert("Profile updated successfully");
    } catch (err) {
      setError(err.message);
    }
  };

  // Handle account deletion
  const handleDeleteAccount = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch("https://supe-cook-backend.vercel.app/users/delete_account/", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete account");
      }

      // Clear local storage and redirect to login page
      localStorage.removeItem("access_token");
      alert("Your account has been deleted successfully.");
      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  // Check if profile image is valid and show a fallback if it's not
  const isValidImageUrl = (url) => {
    return url && (url.startsWith("http://") || url.startsWith("https://"));
  };

  const profileImageSrc = isValidImageUrl(profileImage)
    ? profileImage
    : "https://via.placeholder.com/150"; // Fallback to placeholder if the URL is not valid

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className={`flex items-center justify-center min-h-100 mt-15`}>
      <div className="w-full max-w-md p-6 shadow-lg rounded-lg border border-gray-300 dark:border-gray-700">
        {/* Profile Image Section */}
        <div className="flex justify-center mb-4">
          <img
            src={profileImageSrc}
            alt="Profile"
            className="w-20 h-20 rounded-full object-cover"
            onError={(e) => (e.target.src = "https://via.placeholder.com/150")} // Fallback on error
          />
        </div>
        <h2 className="text-2xl font-semibold text-center mb-4">Settings</h2>
        {error && <p className="text-red-500 text-center mb-2">{error}</p>}
        <form onSubmit={handleUpdateProfile}>
          <div className="mb-4">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1">Profile Image URL</label>
            <input
              type="text"
              value={profileImage}
              onChange={(e) => setProfileImage(e.target.value)}
              className="w-full p-2 rounded border border-gray-300 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 mt-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Update Profile
          </button>
        </form>
        {/* Delete Profile Button */}
        <button
          onClick={handleDeleteAccount}
          className="w-full p-2 mt-4 bg-red-600 text-white rounded hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600"
        >
          Delete Profile
        </button>
      </div>
    </div>
  );
};

export default Settings;
