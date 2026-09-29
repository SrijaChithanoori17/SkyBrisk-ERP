import { useState } from "react";

import Login from "./Login";
import Register from "./Register";
import Dashboard from "./Dashboard";

function App() {

  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );

  const [showRegister, setShowRegister] = useState(false);


  const handleLogin = () => {
    setLoggedIn(true);
  };


  const handleLogout = () => {

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("name");
    localStorage.removeItem("email");

    setLoggedIn(false);
    setShowRegister(false);
  };


  // Logged in → Dashboard
  if (loggedIn) {
    return (
      <Dashboard
        onLogout={handleLogout}
      />
    );
  }


  // Register page
  if (showRegister) {
    return (
      <Register
        onRegister={() => setShowRegister(false)}
        onBackToLogin={() => setShowRegister(false)}
      />
    );
  }


  // Login page
  return (
    <Login
      onLogin={handleLogin}
      onShowRegister={() => setShowRegister(true)}
    />
  );
}

export default App;