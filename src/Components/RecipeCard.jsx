import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import { Heart, X } from "lucide-react";
import axios from "axios"; // Axios for API calls

Modal.setAppElement("#root");

const RecipeCard = ({ recipe }) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isHeartClicked, setIsHeartClicked] = useState(false); // State to track heart icon click
  const [isReadMoreOpen, setIsReadMoreOpen] = useState(false); // State to track read more toggle
  const Authuser = localStorage.getItem("access_token");
  const ingredients = recipe.Cleaned_Ingredients.split(",").map((ingredient) =>
    ingredient.trim()
  );

  // Check if the recipe is already in favorites
  useEffect(() => {
    const checkIfFavorite = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // Fetch user's favorite recipes
        const response = await axios.get("https://supe-cook-backend.vercel.app/get_recipes/", {
          headers,
        });

        // Check if the current recipe is in the user's favorites
        const isFavorite = response.data.some(
          (favRecipe) => favRecipe.name === recipe.Title
        );
        setIsHeartClicked(isFavorite);
      } catch (error) {
        console.error(
          "Error checking favorite status:",
          error.response?.data || error.message
        );
      }
    };

    checkIfFavorite();
  }, [recipe.Title]);

  // Function to add recipe to favorites
  const addToFavorites = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You need to log in first.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // API request to save recipe data
      const response = await axios.post(
        "https://supe-cook-backend.vercel.app/recipes/",
        {
          image: recipe.Image_Name,
          name: recipe.Title,
          ingredients: ingredients,
          instructions: recipe.Instructions,
        },
        { headers }
      );

      console.log(response.data);
      alert("Recipe added to favorites!");
      setIsHeartClicked(true);
    } catch (error) {
      console.error(
        "Error adding recipe to favorites:",
        error.response?.data || error.message
      );
      alert("Failed to add recipe. Please try again.");
    }
  };

  // Function to remove recipe from favorites
  const removeFromFavorites = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        alert("You need to log in first.");
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // API request to delete recipe by title
      const response = await axios.delete(
        `https://supe-cook-backend.vercel.app/delete_recipes/?title=${encodeURIComponent(
          recipe.Title
        )}`,
        { headers }
      );

      console.log(response.data);
      alert("Recipe removed from favorites!");
      setIsHeartClicked(false);
    } catch (error) {
      console.error(
        "Error removing recipe from favorites:",
        error.response?.data || error.message
      );
      alert("Failed to remove recipe. Please try again.");
    }
  };

  // Handle heart icon click
  const toggleHeart = () => {
    if (Authuser) {
      if (isHeartClicked) {
        removeFromFavorites(); // Remove from favorites if already clicked
      } else {
        addToFavorites(); // Add to favorites if not clicked
      }
    }
  };

  // Open modal and log image name
  const openModal = () => {
    console.log(
      "Opened Recipe Image:",
      recipe.Image_Name || "default-image.jpg"
    );
    setModalIsOpen(true);
  };

  return (
    <>
      {/* Recipe Card */}
      <div
        className="flex flex-col sm:flex-row items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition cursor-pointer"
        onClick={openModal}
      >
        {/* Recipe Image */}
        <img
          src={`${recipe.Image_Name}.jpg`}
          alt={recipe.Image_Name || "No Title"}
          className="w-full h-48 sm:h-12 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-4"
        />

        {/* Recipe Details */}
        <div className="flex-1">
          {/* Title with Truncate Logic */}
          <div className="w-full">
            {recipe.Title?.length > 40 ? (
              <>
                {isReadMoreOpen ? (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {recipe.Title}
                    </h3>
                    <div className="mt-2">
                      <button
                        className="text-sm text-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsReadMoreOpen(false);
                        }}
                      >
                        Read Less
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-semibold text-gray-900 truncate-2-lines">
                      {recipe.Title}
                    </h3>
                    <div className="mt-2">
                      <button
                        className="text-sm text-blue-500"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsReadMoreOpen(true);
                        }}
                      >
                        Read More
                      </button>
                    </div>
                  </>
                )}
              </>
            ) : (
              <h3 className="text-lg font-semibold text-gray-900">
                {recipe.Title || "No Title Available"}
              </h3>
            )}
          </div>
        </div>

        {/* Icons */}
        <div
          className="flex items-center space-x-2 text-gray-500"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Heart Icon */}
          {Authuser && (
            <Heart
              className={`w-5 h-5 cursor-pointer transition-all duration-300 ${
                isHeartClicked ? "text-pink-500" : "hover:text-red-500"
              }`}
              onClick={toggleHeart}
              aria-label="Toggle favorite"
            />
          )}
        </div>
      </div>

      {/* Responsive Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="w-full max-w-4xl sm:max-w-[80%] bg-white rounded-xl shadow-lg p-5 mt-6 mb-6 mx-4 sm:mx-0 overflow-hidden transform transition-all duration-300"
        overlayClassName="fixed inset-0 bg-white/30 backdrop-blur-md flex justify-center items-center"
        style={{
          content: {
            maxHeight: "80vh", // Limit modal height to 90% of the viewport height
            overflowY: "auto", // Enable vertical scrolling
          },
        }}
      >
        {/* Modal Header with Icons */}
        <div className="flex justify-between items-center mb-4">
          {/* Heart Icon Inside Modal */}
          {Authuser && (
            <Heart
              className={`w-6 h-6 cursor-pointer transition-all duration-300 ${
                isHeartClicked ? "text-pink-500" : "hover:text-red-500"
              }`}
              onClick={toggleHeart}
              aria-label="Toggle favorite"
            />
          )}

          {/* Close Button (X Icon) */}
          <button
            className="text-gray-500 hover:text-gray-800 transition"
            onClick={() => setModalIsOpen(false)}
            aria-label="Close modal"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Content Layout */}
        <div className="flex flex-col sm:flex-row">
          {/* Image Section */}
          <div className="sm:w-1/2 flex-none mb-4 sm:mb-0">
            <img
              src={`${recipe.Image_Name}.jpg`}
              alt={recipe.Title || "No Title Available"}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          {/* Details Section */}
          <div className="sm:w-1/2 flex-grow max-h-[70vh] overflow-y-auto px-2 custom-scroll border border-gray-300 rounded-lg">
            {/* Recipe Title */}
            <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-300 pb-2">
              {recipe.Title || "No Title Available"}
            </h2>

            {/* Ingredients */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Ingredients
              </h3>
              <div className="flex flex-wrap">
                {recipe.Cleaned_Ingredients &&
                typeof recipe.Cleaned_Ingredients === "string" ? (
                  (() => {
                    const cleanedIngredients =
                      recipe.Cleaned_Ingredients.replace(/^\[|\]$/g, "")
                        .replace(/,\s*'/g, "'")
                        .replace(/'\s*,/g, "'")
                        .split("'")
                        .map((ingredient) => ingredient.trim())
                        .filter(Boolean);

                    const midIndex = Math.ceil(cleanedIngredients.length / 2);
                    const firstHalf = cleanedIngredients.slice(0, midIndex);
                    const secondHalf = cleanedIngredients.slice(midIndex);

                    return (
                      <>
                        <div className="w-full sm:w-1/2 pr-4">
                          <ul className="text-sm text-gray-600 list-disc pl-5">
                            {firstHalf.map((ingredient, index) => (
                              <li key={index} className="mb-1">
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="w-full sm:w-1/2 pl-4">
                          <ul className="text-sm text-gray-600 list-disc pl-5">
                            {secondHalf.map((ingredient, index) => (
                              <li key={index} className="mb-1">
                                {ingredient}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </>
                    );
                  })()
                ) : (
                  <p>No ingredients available</p>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Instructions
              </h3>
              <p className="text-sm text-gray-600 text-justify mr-2">
                {recipe.Instructions || "No instructions available"}
              </p>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
};

RecipeCard.propTypes = {
  recipe: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Image_Name: PropTypes.string.isRequired,
    Cleaned_Ingredients: PropTypes.string.isRequired,
    Instructions: PropTypes.string,
  }).isRequired,
};

export default RecipeCard;
