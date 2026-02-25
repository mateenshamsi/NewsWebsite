import React, { useEffect, useState } from "react";
import type { Post } from "../types";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Home: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [search, setSearch] = useState("");

  const { user, token } = useAuth();
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL+"/api/posts" || "http://localhost:5000/api/posts";
  // Fetch posts
  const fetchPosts = async () => {
    try {
      const { data } = await axios.get<Post[]>(API_URL);
      setPosts(data);
      setFilteredPosts(data);

      // extract unique categories
      const cats = Array.from(new Set(data.map((p) => p.category || "General")));
      setCategories(["All", ...cats]);
    } catch (err) {
      console.error("Failed to fetch posts", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);


// inside your Home.tsx component
const handleDelete = async (id: string) => {
  if (!token) return toast.error("Not authorized");

  // Show toast with confirm/cancel buttons
  const confirmDelete = new Promise<void>((resolve, reject) => {
    toast(
      (t) => (
        <div className="flex flex-col space-y-2">
          <span>Are you sure you want to delete this post?</span>
          <div className="flex space-x-2">
            <button
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              onClick={() => {
                resolve(); // confirm
                toast.dismiss(t.id);
              }}
            >
              Yes
            </button>
            <button
              className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400"
              onClick={() => {
                reject(); // cancel
                toast.dismiss(t.id);
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: Infinity, position: "top-center" }
    );
  });

  try {
    await confirmDelete; // wait for user confirmation

    await axios.delete(`${API_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    toast.success("Post deleted successfully!");
    fetchPosts(); // refresh posts
  } catch {
    toast("Deletion cancelled");
  }
};

  // Filter by category & search
  useEffect(() => {
    let tempPosts = [...posts];
    if (activeCategory !== "All") {
      tempPosts = tempPosts.filter((p) => (p.category || "General") === activeCategory);
    }
    if (search.trim()) {
      const query = search.toLowerCase();
      tempPosts = tempPosts.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.content.toLowerCase().includes(query) ||
          (p.category || "General").toLowerCase().includes(query)
      );
    }
    setFilteredPosts(tempPosts);
  }, [activeCategory, search, posts]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading posts...</p>;
  if (posts.length === 0) return <p className="text-center mt-10 text-gray-500">No posts available.</p>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-4xl font-bold text-gray-900 mb-6">Latest News</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search posts..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-1/2 p-2 border rounded-md mb-4 focus:ring-2 focus:ring-blue-400"
      />

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-3 mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-md font-medium transition ${
              activeCategory === cat
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Posts Grid */}
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post._id}
            className="bg-white p-6 rounded-lg shadow hover:shadow-2xl transition duration-300 relative"
          >
            {post.image && (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover rounded-md mb-4"
              />
            )}
            <h3 className="text-xl font-semibold mb-2 text-gray-800">{post.title}</h3>
            <p className="text-gray-600 mb-4">
              {post.content.length > 100 ? post.content.substring(0, 100) + "..." : post.content}
            </p>

            <div className="flex justify-between items-center">
              <Link
                to={`/post/${post._id}`}
                className="text-blue-500 hover:underline font-medium"
              >
                Read More
              </Link>

              {/* Admin buttons */}
              {user?.role === "admin" && (
                <div className="space-x-2">
                  <button
                    onClick={() => navigate(`/edit/${post._id}`)}
                    className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;