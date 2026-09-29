
import { useState } from "react";
import api from "./api";
import "./Register.css";

function Register({ onRegister, onBackToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !password) {
      alert("Please fill all fields.");
      return;
    }

    try {
      setLoading(true);

      await api.post("/api/auth/register", {
        name,
        email,
        password
      });

      alert(
        "Registration successful! You can now login as a Sales Executive."
      );

      onRegister();
    } catch (error) {
      console.error("Registration error:", error);

      alert(
        error.response?.data?.message ||
        "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">

      <div className="register-card">

        <div className="register-header">
          <div className="register-icon">📚</div>

          <h1>Create Account</h1>

          <p>
            Register to access the ERP system
          </p>
        </div>

        <form onSubmit={handleRegister}>

          <div className="form-group">
            <label>Full Name</label>

            <input
              type="text"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Email</label>

            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>

            <input
              type="password"
              placeholder="Create a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="register-role-info">
            <span>👤</span>
            <div>
              <strong>Default Role</strong>
              <p>Sales Executive</p>
            </div>
          </div>

          <button
            type="submit"
            className="register-button"
            disabled={loading}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </button>

        </form>

        <div className="login-link">
          Already have an account?

          <button onClick={onBackToLogin}>
            Login
          </button>
        </div>

      </div>

    </div>
  );
}

export default Register;

