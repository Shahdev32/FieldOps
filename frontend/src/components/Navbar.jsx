import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <div style={{ padding: 10, background: "#222", color: "#fff" }}>
      <span>Job System</span>

      {user && (
        <>
          <span style={{ marginLeft: 20 }}>Role: {user.role}</span>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            style={{ marginLeft: 20 }}
          >
            Logout
          </button>
        </>
      )}
    </div>
  );
}