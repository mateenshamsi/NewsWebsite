// seedPosts.js
require("dotenv").config();
const mongoose = require("mongoose");
const slugify = require("slugify");
const Post = require("./models/Post");
const User = require("./models/User"); // to assign author

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";

const seedPosts = async () => {
  try {
    await mongoose.connect(MONGO_URI);

    console.log("MongoDB connected");

    // Optional: clear existing posts
    await Post.deleteMany({});
    console.log("Existing posts removed");

    // Find an existing admin to assign as author
    const adminUser = await User.findOne({ role: "admin" });
    if (!adminUser) {
      console.error("No admin user found. Create one first.");
      process.exit(1);
    }
    const authorId = adminUser._id;

    // Seed data
    const posts = [
      {
        title: "Global Tech Innovations 2026",
        content:
          "Tech industry is booming with new AI, Web3, and IoT innovations around the world...",
        category: "Technology",
        image:
          "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        author: authorId,
      },
      {
        title: "Sports Highlights This Week",
        content:
          "From football to tennis, here are the top highlights and scores from this week’s games...",
        category: "Sports",
        image:
          "https://images.unsplash.com/photo-1505842465776-3b2adf0d44df?auto=format&fit=crop&w=800&q=80",
        author: authorId,
      },
      {
        title: "Health Tips for 2026",
        content:
          "Discover the latest trends in health, nutrition, and mental wellness to stay fit and happy...",
        category: "Health",
        image:
          "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=800&q=80",
        author: authorId,
      },
      {
        title: "Business Strategies for Startups",
        content:
          "Learn the most effective business strategies that startups are using to scale rapidly in 2026...",
        category: "Business",
        image:
          "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
        author: authorId,
      },
      {
        title: "Entertainment Buzz This Month",
        content:
          "Latest news from movies, music, and celebrity happenings around the globe...",
        category: "Entertainment",
        image:
          "https://images.unsplash.com/photo-1512428559087-560fa5ceab42?auto=format&fit=crop&w=800&q=80",
        author: authorId,
      },
    ];

    // Generate slug for each post
    posts.forEach((p) => {
      p.slug = slugify(p.title, { lower: true, strict: true });
    });

    const inserted = await Post.insertMany(posts);
    console.log(`Seeded ${inserted.length} posts successfully`);

    process.exit(0);
  } catch (err) {
    console.error("Error seeding posts:", err);
    process.exit(1);
  }
};

seedPosts();