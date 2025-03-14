import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser } from "react-icons/fa";
import axios from "axios";

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();
  const profileMenuRef = useRef(null); // Ref for the profile menu

  const Authuser = localStorage.getItem("access_token");

  useEffect(() => {
    if (Authuser) {
      axios
        .get("http://127.0.0.1:8000/users/profile", {
          headers: { Authorization: `Bearer ${Authuser}` },
        })
        .then((response) => {
          setUserProfile(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, [Authuser]);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleProfileMenu = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  const isValidImageUrl = (url) => {
    return url && (url.startsWith("http://") || url.startsWith("https://"));
  };

  const profileImageSrc =
    userProfile && isValidImageUrl(userProfile.profile_image)
      ? userProfile.profile_image
      : "https://via.placeholder.com/150";

  return (
    <nav className="fixed top-0 right-0 w-full p-4 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo Section */}
        <div className="flex-1 flex justify-start items-center ml-30 lg:ml-210">
          <Link
            to="/"
            className="text-lg font-semibold flex items-center space-x-2"
          >
            <img
              src="/logo.png"
              className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 lg:w-14 lg:h-14" // Responsive logo size
              alt="Logo"
            />
            <span className="sm:inline">SupeCook</span>{" "}
            {/* Hide text on small screens */}
          </Link>
        </div>

        {/* Right Section (Profile and Menu) */}
        <div className="flex items-center space-x-4">
          {/* User Profile Button */}
          <div className="relative" ref={profileMenuRef}>
            {Authuser ? (
              <button
                className="relative p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                onClick={toggleProfileMenu}
              >
                {profileImageSrc ? (
                  <img
                    src={profileImageSrc}
                    alt="User Profile"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <FaUser size={24} className="text-white" />
                )}
              </button>
            ) : (
              <button
                className="relative p-2 rounded-full bg-gray-700 hover:bg-gray-600"
                onClick={toggleProfileMenu}
              >
                <FaUser size={24} className="text-white" />
              </button>
            )}

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-lg shadow-lg p-4 bg-gray-800 text-white border border-gray-700 text-center">
                <ul>
                  {Authuser ? (
                    <>
                      <li>
                        <Link
                          to="/favorite"
                          className="block p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                          Favorites
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/about"
                          className="block p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                          About Us
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/settings"
                          className="block p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                          Settings
                        </Link>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            localStorage.removeItem("access_token");
                            navigate("/");
                          }}
                          className="w-full p-2 rounded-lg bg-red-500 hover:bg-pink-500 text-white font-semibold transition-colors duration-300"
                        >
                          Logout
                        </button>
                      </li>
                    </>
                  ) : (
                    <>
                      <li>
                        <Link
                          to="/Login"
                          className="block p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                          Login/ Signup
                        </Link>
                      </li>
                      <li>
                        <Link
                          to="/about"
                          className="block p-2 rounded-lg hover:bg-gray-700 transition-colors duration-200"
                        >
                          About Us
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu (Responsive) */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 p-4 bg-white dark:bg-gray-800 text-black dark:text-white border-t border-gray-300 dark:border-gray-700">
          <ul>
            {Authuser ? (
              <>
                <li>
                  <Link
                    to="/favorites"
                    className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Favorites
                  </Link>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      localStorage.removeItem("access_token");
                      navigate("/");
                    }}
                    className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link
                    to="/Login"
                    className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    Login/ Signup
                  </Link>
                </li>
                <li>
                  <Link
                    to="/about"
                    className="block p-2 rounded hover:bg-gray-200 dark:hover:bg-gray-700"
                  >
                    About Us
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
