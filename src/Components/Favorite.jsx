import { useState, useEffect } from "react";
import RecipeCard from "./RecipeCard";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Favorite = () => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(20);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get the JWT token from localStorage
  const token = localStorage.getItem("access_token");
  const navigate = useNavigate();

  useEffect(() => {
    const hasReloaded = sessionStorage.getItem("favoritePageReloaded");

    if (!hasReloaded) {
      sessionStorage.setItem("favoritePageReloaded", "true");
      window.location.reload();
    }
  }, []);

  // Fetch favorite recipes on component mount
  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        // Check if the user is authenticated
        if (!token) {
          navigate("/login"); // Redirect to login if no token
          return;
        }

        // Fetch recipes from the backend
        const response = await axios.get("https://supe-cook-backend.vercel.app/get_recipes/", {
          headers: {
            Authorization: `Bearer ${token}`, // Attach the token in the Authorization header
          },
        });

        console.log("API Response:", response.data); // Debugging: Check API response
        setRecipes(response.data); // Set the fetched recipes
        setFilteredRecipes(response.data); // Initialize filtered recipes
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to fetch recipes. Please try again.");
      } finally {
        setLoading(false); // Stop loading
      }
    };

    fetchFavoriteRecipes();
  }, [token, navigate]);

  // Filter recipes based on search query
  useEffect(() => {
    const lowerQueryWords = query.toLowerCase().split(" ").filter(Boolean);

    const filtered = recipes.filter((recipe) => {
      const matchesQuery =
        lowerQueryWords.length === 0 ||
        lowerQueryWords.every(
          (word) =>
            (recipe.name && recipe.name.toLowerCase().includes(word)) ||
            (recipe.ingredients &&
              recipe.ingredients.join(", ").toLowerCase().includes(word))
        );

      return matchesQuery;
    });

    setFilteredRecipes(filtered); // Update filtered recipes
    setCurrentPage(1); // Reset to the first page
  }, [query, recipes]);

  // Pagination logic
  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-wide">
        ❤️ Your Favorite Recipes
      </h1>

      {/* Search Input */}
      <div className="mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or ingredients..."
          className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="text-center text-lg font-semibold text-gray-600">
          Loading recipes...
        </div>
      ) : error ? ( // Error State
        <div className="text-center text-lg font-semibold text-red-600">
          {error}
        </div>
      ) : (
        <>
          {/* Recipe Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {currentRecipes.length > 0 ? (
              currentRecipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={{
                    Title: recipe.name || "No Name",
                    Image_Name: recipe.image || "default-image.jpg",
                    Cleaned_Ingredients:
                      recipe.ingredients.join(", ") ||
                      "No Ingredients Available",
                    Instructions:
                      recipe.instructions || "No Instructions Available",
                  }}
                />
              ))
            ) : (
              <div className="text-center text-lg font-semibold text-gray-600">
                No recipes found.
              </div>
            )}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-6 space-x-4">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600"
            >
              Previous
            </button>
            <span className="text-lg font-semibold">{`Page ${currentPage} of ${totalPages}`}</span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg disabled:bg-gray-300 hover:bg-blue-600"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Favorite;
