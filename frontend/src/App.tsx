import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CreatePost from "./pages/CreatePost";
import Post from "./pages/Post";
import Login from "./pages/Login"; // make sure you import Login
import Register from "./pages/Register";
import EditPost from "./pages/EditPost";
import ProtectedRoute from "./ProtectedRoute";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <Router>
      <Navbar />
      <Toaster />
      <Routes>
        {/* Home is now protected */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Auth routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Only Routes */}
        <Route
          path="/create-post"
          element={
            <ProtectedRoute adminOnly>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit/:id"
          element={
            <ProtectedRoute adminOnly>
              <EditPost />
            </ProtectedRoute>
          }
        />

        {/* Public Post View */}
        <Route path="/post/:id" element={<ProtectedRoute><Post /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
};

export default App;