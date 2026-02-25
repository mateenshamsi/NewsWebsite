import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import type { Post as PostType } from "../types";

const Post: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [post, setPost] = useState<PostType | null>(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL; 
    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await fetch(`${API_URL}/posts/${id}`);
                const data = await res.json();
                setPost(data);
            } catch (err) {
                console.error("Failed to fetch post", err);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchPost();
    }, [id]);

    if (loading) return <p className="text-center mt-10">Loading...</p>;
    if (!post) return <p className="text-center mt-10">Post not found</p>;

    return (
        <div className="max-w-3xl mx-auto px-4 py-10">
            <h1 className="text-4xl font-bold mb-4 text-gray-900">{post.title}</h1>
            <p className="text-gray-500 mb-6">
                {new Date(post.createdAt).toLocaleDateString()}
            </p>
            {post.image && (
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full rounded-lg mb-6 shadow"
                />
            )}
            <p className="text-gray-700 whitespace-pre-line">{post.content}</p>
        </div>
    );
};

export default Post; 