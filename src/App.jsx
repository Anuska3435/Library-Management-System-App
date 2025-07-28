// App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./components/Landing";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    localStorage.removeItem("loggedInUser"); // force re-login
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login onLogin={setUser} />} />
        <Route
          path="/dashboard"
          element={user ? <Dashboard user={user} logout={() => setUser(null)} /> : <Login onLogin={setUser} />}
        />
      </Routes>
    </Router>
  );
};

export default App;
