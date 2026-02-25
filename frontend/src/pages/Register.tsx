import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import type { User } from "../types";

const Register: React.FC = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
   const [email, setEmail] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!username || !password || !email|| !confirmPassword) {
            setError("All fields are required");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        try {
            const { data:_ } = await axios.post<{ user: User }>(
                "http://localhost:5000/api/auth/register",
                {
                    username,
                    email,
                    password
                 
                }
            );

          
            navigate("/login");

        } catch (err: any) {
            console.error(err);
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-lg w-96">
                <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>

                {error && <p className="text-red-500 mb-4">{error}</p>}

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="w-full mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                    />
                      <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                    />

                    <input
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full mb-6 px-4 py-2 border rounded-md focus:ring-2 focus:ring-green-400"
                    />

                    <button
                        type="submit"
                        className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition"
                    >
                        Register
                    </button>
                </form>

                <p className="text-center mt-4 text-gray-600">
                    Already have an account?{" "}
                    <Link to="/login" className="text-blue-500 hover:underline">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;