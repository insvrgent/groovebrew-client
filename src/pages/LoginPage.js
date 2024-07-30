import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";
import RouletteWheel from "../components/RouletteWheel";
import { loginUser } from "../helpers/userHelpers"; // Import from userHelper.js

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation(); // Use useLocation hook instead of useSearchParams
  const searchParams = new URLSearchParams(location.search); // Pass location.search directly

  const next = searchParams.get("next");
  const table = searchParams.get("table");

  const handleLogin = async (email, username, password) => {
    try {
      const response = await loginUser(username, password);

      if (response.success) {
        localStorage.setItem("auth", response.token);

        if (response.cafeId !== null) {
          navigate(`/${response.cafeId}`);
        } else {
          let destination = "/";

          // Validate parameters and construct the destination URL
          if (table && !next) {
            console.error(
              'Parameter "table" requires "next" to be present in the URL.',
            );
            // Navigate to a default route or handle this case as needed
            navigate("/");
            return;
          }

          if (next) {
            destination = `/${next}`;
            if (table) {
              destination += `?table=${table}`;
            }
          }

          navigate(destination, { replace: true });
        }
      } else {
        console.error("Login failed");
      }
    } catch (error) {
      console.error("Error occurred while logging in:", error.message);
    }
  };

  return (
    <div className="login-container">
      <RouletteWheel onSign={handleLogin} />
    </div>
  );
};

export default LoginPage;
