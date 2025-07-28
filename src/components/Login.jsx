import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ onLogin }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [registeredUsers, setRegisteredUsers] = useState({
    admin: { name: "Admin", password: "admin123", role: "admin" },
    user: { name: "User", password: "user123", role: "user" },
  });

  const navigate = useNavigate();

  const normalize = (str) => str.trim().toLowerCase();

  const handleLogin = (e) => {
    e.preventDefault();
    const key = normalize(username);
    const user = registeredUsers[key];

    if (user && user.password === password) {
      onLogin({ role: user.role, name: user.name });
      navigate("/dashboard");
    } else {
      alert("Invalid credentials");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const key = normalize(username);
    if (registeredUsers[key]) {
      alert("Username already exists");
      return;
    }

    const newUser = {
      name: username.trim(),
      password: password,
      role: "user",
    };

    setRegisteredUsers({ ...registeredUsers, [key]: newUser });
    alert(`${username.trim()} registered. Please log in.`);
    setIsRegistering(false);
    setUsername("");
    setPassword("");
  };

  return (
    <div className="login-wrapper">
      <div className="login-page-container">
        <h2 className="login-title">{isRegistering ? "Register" : "Login"}</h2>

        <form onSubmit={isRegistering ? handleRegister : handleLogin} className="login-form">
          <input
            className="login-input"
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <div style={{ position: "relative", width: "100%" }}>
            <input
              className="login-input"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                fontSize: "0.9rem",
                color: "#007bff",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <button className="login-button" type="submit">
            {isRegistering ? "Register" : "Login"}
          </button>
        </form>

        <p className="toggle-mode-text">
          {isRegistering ? (
            <>
              Already have an account?{" "}
              <button type="button" onClick={() => setIsRegistering(false)}>Login</button>
            </>
          ) : (
            <>
              Don’t have an account?{" "}
              <button type="button" onClick={() => setIsRegistering(true)}>Register</button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;
