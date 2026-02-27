import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function Navbar() {
  const { token, logout } = useContext(AuthContext);

  return (
    <nav style={{
      background: "#111",
      padding: "15px 30px",
      display: "flex",
      justifyContent: "space-between",
      color: "white"
    }}>
      <Link to="/" style={{ color: "red", fontWeight: "bold", textDecoration: "none" }}>
        🎬 Drama Platform
      </Link>

      <div>
        <Link to="/watchlist" style={{ marginRight: 20, color: "white" }}>
          Watchlist
        </Link>

        {token ? (
          <button onClick={logout}>Logout</button>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 10 }}>Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;