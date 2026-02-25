export interface Post {
    _id: string;           // MongoDB ObjectId as string
    title: string;         // Post title
    content: string;       // Post content
    category?: string;     // Optional category
    image?: string;        // Optional image URL
    createdAt: string;     // ISO date string
    updatedAt: string;     // ISO date string
}

export interface User {
    _id: string;           // MongoDB ObjectId
    username: string;      // Username
    email: string;         // Email
    role: "admin" | "user"; // Role of the user
    createdAt: string;
    updatedAt: string;
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}