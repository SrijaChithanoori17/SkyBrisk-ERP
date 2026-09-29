import { useState } from "react";
import api from "./api";
import "./Login.css";

function Login({ onLogin, onShowRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await api.post("/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("name", response.data.name);
      localStorage.setItem("email", response.data.email);

      alert("Login successful! 🎉");

      onLogin();
    } catch (error) {
      console.error("Login failed:", error);

      alert(
        error.response?.data?.message ||
        "Invalid email or password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">

          <div className="login-icon">
            📦
          </div>

          <h1>Skybrisk ERP</h1>

          <p>
            Inventory & Sales Management System
          </p>

        </div>


        <form onSubmit={handleLogin}>

          <div className="login-form-group">

            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

          </div>


          <div className="login-form-group">

            <label>Password</label>

            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

          </div>


          <button
            type="submit"
            className="login-button"
            disabled={loading}
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </form>


        <div className="register-link">

          <span>
            Don't have an account?
          </span>

          <button
            type="button"
            onClick={onShowRegister}
          >
            Create Account
          </button>

        </div>

      </div>

    </div>
  );
}

export default Login;