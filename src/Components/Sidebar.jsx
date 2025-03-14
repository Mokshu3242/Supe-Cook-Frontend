import { useState, useCallback, useRef } from "react";
import PropTypes from "prop-types";
import { Menu, X, Search, ChevronDown, ChevronUp, ArrowUp } from "lucide-react";
import pantryData from "./data/ingredients.json";

const Sidebar = ({ themeToggleButton, updateSelectedIngredients }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState(new Set());
  const sidebarRef = useRef(null); // Ref for the sidebar

  const toggleSection = useCallback((sectionName) => {
    setExpandedSections((prevState) => ({
      ...prevState,
      [sectionName]: !prevState[sectionName],
    }));
  }, []);

  const toggleIngredient = useCallback(
    (ingredientName) => {
      const newSelectedIngredients = new Set(selectedIngredients);
      if (newSelectedIngredients.has(ingredientName)) {
        newSelectedIngredients.delete(ingredientName);
      } else {
        newSelectedIngredients.add(ingredientName);
      }
      setSelectedIngredients(newSelectedIngredients);
      updateSelectedIngredients(newSelectedIngredients); // Call the parent's function to update state
    },
    [selectedIngredients, updateSelectedIngredients]
  );

  // Function to scroll the sidebar to the top
  const scrollToTop = () => {
    if (sidebarRef.current) {
      sidebarRef.current.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="relative">
      <style>
        {`
          .sidebar {
            overflow-y: auto;
          }
          .sidebar::-webkit-scrollbar {
            width: 6px;
          }
          .sidebar::-webkit-scrollbar-track {
            background: transparent;
          }
          .sidebar::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 10px;
          }
          .sidebar::-webkit-scrollbar-thumb:hover {
            background-color: #555;
          }
        `}
      </style>
      <div
        ref={sidebarRef} // Attach the ref to the sidebar
        className={`fixed inset-y-0 left-0 w-80 md:w-88 lg:w-96 p-6 space-y-6 transform z-50 transition-transform md:translate-x-0 md:w-88 lg:w-99 
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          bg-gray-900 text-white sidebar md:block`}
      >
        <div className="flex items-center justify-between md:justify-center relative h-6 px-4 md:px-8">
          <h2 className="text-2xl font-semibold text-white md:absolute md:justify-start md:ml-0 ml-10">
            Pantry
          </h2>
        </div>

        <hr className="border-gray-700" />

        {/* Search Input */}
        <div className="flex items-center gap-2 mb-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search ingredients"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-700 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Search ingredients"
            />
            <Search
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-red-500"
              >
                <X />
              </button>
            )}
          </div>
        </div>

        {/* Display Selected Ingredients */}
        {selectedIngredients.size > 0 && (
          <div className="relative bg-gray-800 p-3 rounded-md mt-3">
            <div className="flex justify-between items-center mb-2">
              <span className="font-medium text-gray-300">
                Selected Ingredients:
              </span>
              <div className="relative group">
                <button
                  onClick={() => {
                    setSelectedIngredients(new Set()); // Clear local state
                    updateSelectedIngredients(new Set()); // Clear the ingredients in App.jsx
                  }}
                  className="text-red-500 text-sm font-semibold hover:text-red-700"
                >
                  <X aria-label="Clear all selected ingredients" />
                </button>
                <span className="absolute top-full right-0 mt-1 w-20 text-center text-xs bg-black text-white py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                  Clear All
                </span>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
              {[...selectedIngredients].map((ingredient, index) => (
                <button
                  key={index}
                  onClick={() => toggleIngredient(ingredient)}
                  className="px-3 py-1 bg-green-500 text-white text-xs rounded-full"
                >
                  {ingredient}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Theme Toggle Button */}
        <div className="flex justify-center">{themeToggleButton}</div>

        {/* Render pantry categories */}
        {pantryData.categories.map((category, categoryIndex) => {
          const filteredIngredients = category.ingredients.filter(
            (ingredient) =>
              ingredient.name.toLowerCase().includes(searchQuery.toLowerCase())
          );

          if (filteredIngredients.length === 0) return null;

          return (
            <div
              key={categoryIndex}
              className="bg-gray-800 shadow-md rounded-lg p-4 w-full mt-6"
            >
              <div
                className="flex items-center mb-4 cursor-pointer"
                onClick={() => toggleSection(category.name)}
              >
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <div>
                  <h2 className="text-xl font-medium text-white">
                    {category.name}
                  </h2>
                  <p className="text-sm text-gray-400">
                    {
                      filteredIngredients.filter((ingredient) =>
                        selectedIngredients.has(ingredient.name)
                      ).length
                    }{" "}
                    / {filteredIngredients.length} Ingredients
                  </p>
                </div>
                {expandedSections[category.name] ? (
                  <ChevronUp className="ml-auto text-gray-500" />
                ) : (
                  <ChevronDown className="ml-auto text-gray-500" />
                )}
              </div>
              {expandedSections[category.name] && (
                <div>
                  <div className="grid grid-cols-3 gap-2">
                    {filteredIngredients.map((ingredient, index) => (
                      <button
                        key={index}
                        onClick={() => toggleIngredient(ingredient.name)}
                        className={`px-3 py-2 rounded-md text-center text-xs transition-all ${
                          selectedIngredients.has(ingredient.name)
                            ? "bg-green-500 text-white"
                            : "bg-gray-700 text-gray-300"
                        }`}
                      >
                        {ingredient.name}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-center mt-4">
                    <ChevronUp
                      className="cursor-pointer text-gray-500"
                      size={24}
                      onClick={() => toggleSection(category.name)}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Go to Up Button */}
        {/* <button
          onClick={scrollToTop}
          className="absolute bottom-6 right-6 p-3 bg-gray-800 text-white rounded-full shadow-lg hover:bg-gray-700 transition-colors"
          aria-label="Go to top"
        >
          <ArrowUp size={24} />
        </button> */}
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-5 left-3 md:hidden p-2 rounded-md z-50 transition-all bg-gray-900 text-white`}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </div>
  );
};

Sidebar.propTypes = {
  themeToggleButton: PropTypes.node.isRequired,
  updateRecipes: PropTypes.func.isRequired, // Ensure the parent function is passed correctly
  updateSelectedIngredients: PropTypes.func.isRequired, // Ensure the parent function is passed correctly
};

export default Sidebar;
