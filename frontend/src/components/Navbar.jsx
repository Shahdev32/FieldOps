import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user = {}, logout } = useContext(AuthContext);

  return (
    <div style={{ display: "flex", gap: 10 }}>
      <Link to="/">Home</Link>

      {!user?.token && <Link to="/login">Login</Link>}
      {!user?.token && <Link to="/register">Register</Link>}

      {user?.token && (
        <>
          <span>{user.role}</span>
          <button onClick={logout}>Logout</button>
        </>
      )}
    </div>
  );
};

export default Navbar;
