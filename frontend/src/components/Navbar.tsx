import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar: React.FC = () => {
  const { isAuthed, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-400">NewsPortal</h1>

      <div className="space-x-6">
        <Link to="/" className="hover:text-blue-400">
          Home
        </Link>

        {isAdmin && (
          <Link to="/create-post" className="hover:text-blue-400">
            Create Post
          </Link>
        )}

        {isAuthed ? (
          <button
            onClick={handleLogout}
            className="hover:text-red-400"
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="hover:text-blue-400">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;