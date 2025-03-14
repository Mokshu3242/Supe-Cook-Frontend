import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, Suspense, lazy } from "react";

// Lazy load components
const Navbar = lazy(() => import("./Components/Navbar"));
const Contact = lazy(() => import("./Components/About"));
const Home = lazy(() => import("./Components/Home"));
const Sidebar = lazy(() => import("./Components/Sidebar"));
const Login = lazy(() => import("./Components/Login"));
const Signup = lazy(() => import("./Components/Signup"));
const Settings = lazy(() => import("./Components/Settings"));
const Favorite = lazy(() => import("./Components/Favorite"));

function App() {
  const [recipes, setRecipes] = useState([]); // State for storing recipes
  const [selectedIngredients, setSelectedIngredients] = useState(new Set()); // State for storing selected ingredients

  const updateRecipes = (newRecipes) => {
    setRecipes(newRecipes);
    console.log("Selected Ingredients from Sidebar:", selectedIngredients); // Print selected ingredients
  };

  // Function to update selected ingredients
  const updateSelectedIngredients = (ingredientOrSet) => {
    setSelectedIngredients((prevIngredients) => {
      if (ingredientOrSet instanceof Set) {
        return new Set(ingredientOrSet); // Handle full set replacement
      } else {
        const newIngredients = new Set(prevIngredients);
        if (newIngredients.has(ingredientOrSet)) {
          newIngredients.delete(ingredientOrSet); // Remove if already selected
        } else {
          newIngredients.add(ingredientOrSet); // Add if not selected
        }
        return newIngredients;
      }
    });
  };

  const Authuser = localStorage.getItem("access_token");

  return (
    <Router>
      {/* Suspense to handle lazy loading fallback */}
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Full-screen login and signup pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Layout for the authenticated pages (Home, Settings, Favorite) */}
          {Authuser && (
            <>
              <Route
                path="/settings"
                element={
                  <div>
                    <Navbar />
                    <div className="flex">
                      <div className="md:block md:w-64 md:fixed md:left-0 md:top-16 md:h-screen bg-gray-800 text-white">
                        <Sidebar
                          updateRecipes={updateRecipes}
                          selectedIngredients={selectedIngredients}
                          updateSelectedIngredients={updateSelectedIngredients}
                        />
                      </div>
                      <div className="w-full p-6 md:ml-95 mt-16">
                        <Settings />
                      </div>
                    </div>
                  </div>
                }
              />
              <Route
                path="/favorite"
                element={
                  <div>
                    <Navbar />
                    <div className="flex">
                      <div className="md:block md:w-64 md:fixed md:left-0 md:top-16 md:h-screen bg-gray-800 text-white">
                        <Sidebar
                          updateRecipes={updateRecipes}
                          selectedIngredients={selectedIngredients}
                          updateSelectedIngredients={updateSelectedIngredients}
                        />
                      </div>
                      <div className="w-full p-6 md:ml-95 mt-16">
                        <Favorite />
                      </div>
                    </div>
                  </div>
                }
              />
            </>
          )}

          {/* Other routes */}
          <Route
            path="/*"
            element={
              <div>
                <Navbar />
                <div className="flex">
                  <div className="md:block md:w-64 md:fixed md:left-0 md:top-16 md:h-screen bg-gray-800 text-white">
                    <Sidebar
                      updateRecipes={updateRecipes}
                      selectedIngredients={selectedIngredients}
                      updateSelectedIngredients={updateSelectedIngredients}
                    />
                  </div>
                  <div className="w-full p-6 md:ml-95 mt-16">
                    <Routes>
                      <Route
                        path="/"
                        element={
                          <Home
                            recipes={recipes}
                            selectedIngredients={selectedIngredients}
                            updateSelectedIngredients={updateSelectedIngredients}
                          />
                        }
                      />
                      <Route path="/about" element={<Contact />} />
                    </Routes>
                  </div>
                </div>
              </div>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
