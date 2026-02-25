import React, { useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const categories = [
  "General",
  "Sports",
  "Technology",
  "Health",
  "Business",
  "Entertainment",
];

const CreatePost: React.FC = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("General");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setPreview(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) return toast.error("You must be logged in");

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);
      if (image) formData.append("image", image);

      await axios.post("http://localhost:5000/api/posts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Post created successfully");
      navigate("/");
    } catch (error: any) {
      console.error("Create post failed:", error);
      toast.error("Error creating post");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">Create Post</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />

        <textarea
          placeholder="Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full border p-2 rounded"
          rows={6}
          required
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full border p-2 rounded"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Image Upload */}
        <div className="flex items-center space-x-4">
          <button
            type="button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded"
            onClick={() => fileInputRef.current?.click()}
          >
            {image ? "Change Image" : "Choose Image"}
          </button>
          <span className="text-gray-700">
            {image ? image.name : "No file selected"}
          </span>
        </div>
        <input
          type="file"
          accept="image/*"
          className="hidden"
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        {/* Image Preview */}
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full max-h-64 object-cover rounded mt-2"
          />
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          Publish
        </button>
      </form>
    </div>
  );
};

export default CreatePost;