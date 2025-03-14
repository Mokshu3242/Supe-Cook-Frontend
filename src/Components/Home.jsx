import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import RecipeCard from "./RecipeCard";

const Home = ({ selectedIngredients = new Set() }) => {
  const [query, setQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [recipesPerPage] = useState(20);
  const [recipes, setRecipes] = useState([]);
  const [filteredRecipes, setFilteredRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch recipes on mount
  useEffect(() => {
    console.log("Fetching recipes...");
    fetch("/recipes.json")
      .then((response) => {
        console.log("Response:", response);
        return response.json();
      })
      .then((data) => {
        console.log("Fetched Recipes Data:", data);
        if (Array.isArray(data)) {
          setRecipes(data);
          setFilteredRecipes(data);
        } else {
          console.error("Fetched data is not an array");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading recipes:", error);
        setLoading(false);
      });
  }, []);

  // Filter recipes based on search query and selected ingredients
  useEffect(() => {
    console.log("Filtering recipes...");
    const lowerQueryWords = query.toLowerCase().split(" ").filter(Boolean);

    const filtered = recipes.filter((recipe) => {
      const matchesQuery =
        lowerQueryWords.length === 0 ||
        lowerQueryWords.every(
          (word) =>
            (recipe.Title && recipe.Title.toLowerCase().includes(word)) ||
            (recipe.Cleaned_Ingredients &&
              recipe.Cleaned_Ingredients.toLowerCase().includes(word))
        );

      // Convert selectedIngredients (Set) to an array for .every() method
      const selectedIngredientsArray = Array.from(selectedIngredients);
      const containsSelectedIngredients =
        selectedIngredientsArray.length === 0 ||
        selectedIngredientsArray.every((ingredient) =>
          recipe.Cleaned_Ingredients
            ? recipe.Cleaned_Ingredients.toLowerCase().includes(
                ingredient.toLowerCase()
              )
            : false
        );

      return matchesQuery && containsSelectedIngredients;
    });

    console.log("Filtered Recipes:", filtered);
    setFilteredRecipes(filtered);
    setCurrentPage(1);
  }, [query, recipes, selectedIngredients]);

  const indexOfLastRecipe = currentPage * recipesPerPage;
  const indexOfFirstRecipe = indexOfLastRecipe - recipesPerPage;
  const currentRecipes = filteredRecipes.slice(
    indexOfFirstRecipe,
    indexOfLastRecipe
  );

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const totalPages = Math.ceil(filteredRecipes.length / recipesPerPage);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center text-gray-900 mb-10 tracking-wide">
        🍽️ Explore Delicious Recipes
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

      {loading ? (
        <div className="text-center text-lg font-semibold text-gray-600">
          Loading recipes...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {currentRecipes.length > 0 ? (
              currentRecipes.map((recipe, index) => (
                <RecipeCard
                  key={index}
                  recipe={{
                    Title: recipe.Title || "No Name",
                    Image_Name: `${recipe.Image_Name}`,
                    Cleaned_Ingredients:
                      recipe.Cleaned_Ingredients || "No Ingredients Available",
                    Instructions:
                      recipe.Instructions || "No Instructions Available",
                  }}
                />
              ))
            ) : (
              <div className="text-center text-lg font-semibold text-gray-600">
                No recipes found.
              </div>
            )}
          </div>
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

Home.propTypes = {
  selectedIngredients: PropTypes.instanceOf(Set).isRequired,
};

export default Home;
