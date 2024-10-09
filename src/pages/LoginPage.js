import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./LoginPage.css";
import RouletteWheel from "../components/RouletteWheel";
import { loginUser, signUpUser } from "../helpers/userHelpers";

const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const next = searchParams.get("next");
  const table = searchParams.get("table");

  const handleLogin = async (
    email,
    username,
    password,
    setLoading,
    setError
  ) => {
    try {
      setLoading(true);
      const response = await loginUser(username, password);

      if (response.success) {
        localStorage.setItem("auth", response.token);

        if (response.cafeId !== null) {
          window.location.href = response.cafeId;
        } else {
          let destination = "/";
          if (table && !next) {
            console.error('Parameter "table" requires "next" to be present.');
            navigate("/");
            return;
          }
          if (next) {
            destination = `/${next}`;
            if (table) destination += `?table=${table}`;
          }
          window.location.href = destination;
        }
      } else {
        setError(true); // Trigger error state in the button
        console.error("Login failed");
      }
    } catch (error) {
      setError(true);
      console.error("Error occurred while logging in:", error.message);
    } finally {
      setLoading(false); // Ensure loading state is cleared
    }
  };
  const handleSignUp = async (
    email,
    username,
    password,
    setLoading,
    setError
  ) => {
    try {
      setLoading(true);
      const response = await signUpUser(email, username, password);

      if (response.success) {
        localStorage.setItem("auth", response.token);

        let destination = "/";

        window.location.href = destination;
      } else {
        setError(true); // Trigger error state in the button
        console.error("Login failed");
      }
    } catch (error) {
      setError(true);
      console.error("Error occurred while logging in:", error.message);
    } finally {
      setLoading(false); // Ensure loading state is cleared
    }
  };

  return (
    <div className="login-container">
      <RouletteWheel onSignIn={handleLogin} onSignUp={handleSignUp} />
    </div>
  );
};

export default LoginPage;
