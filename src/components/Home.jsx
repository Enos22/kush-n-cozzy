import { useState } from "react";

function Home() {
  const [role, setRole] = useState("client");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loggedInUser, setLoggedInUser] = useState(null);

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    const endpoint = role === "admin" ? "admins" : "clients";

    fetch(
      `http://localhost:3001/${endpoint}?username=${username}&password=${password}`,
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.length > 0) {
          setLoggedInUser({ ...data[0], role });
        } else {
          setError("Invalid username or password.");
        }
      })
      .catch(() => setError("Something went wrong. Is json-server running?"));
  };

  const handleLogout = () => {
    setLoggedInUser(null);
    setUsername("");
    setPassword("");
  };

  if (loggedInUser) {
    return (
      <div className="home-container">
        <div className="tag-card tilt">
          <h2>Welcome, {loggedInUser.username}</h2>
          <p
            className="brand-subtitle"
            style={{ textAlign: "left", marginBottom: 0 }}>
            logged in as {loggedInUser.role}
          </p>
          <button className="logout-btn" onClick={handleLogout}>
            Log Out
          </button>{" "}
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <h1 className="brand-mark">
        Kush-n-<span>Cozzy</span>
      </h1>
      <p className="brand-subtitle">your cozy corner store</p>

      <div className="tag-card tilt">
        <div className="role-toggle" data-role={role}>
          <button
            type="button"
            className={role === "client" ? "active" : ""}
            onClick={() => setRole("client")}>
            Client
          </button>
          <button
            type="button"
            className={role === "admin" ? "active" : ""}
            onClick={() => setRole("admin")}>
            Admin
          </button>
        </div>

        <form onSubmit={handleLogin}>
          <label>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="error-text">{error}</p>}

          <button type="submit">
            Log In as {role === "admin" ? "Admin" : "Client"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Home;
