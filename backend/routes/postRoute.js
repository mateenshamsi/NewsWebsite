const router = require("express").Router();
const Post = require("../models/Post");
const auth = require("../middleware/authMiddleware");
const upload = require("../middleware/upload");
const cloudinary = require("../config/cloudinary");


// =======================
// GET ALL POSTS (Public)
// =======================
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ msg: "Failed to fetch posts" });
  }
});


// =======================
// GET SINGLE POST (Public)
// =======================
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "username email");

    if (!post)
      return res.status(404).json({ msg: "Post not found" });

    res.json(post);
  } catch (error) {
    res.status(500).json({ msg: "Invalid ID or server error" });
  }
});


// =======================
// CREATE POST (Admin)
// =======================
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    const slug = req.body.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const newPost = new Post({
      title: req.body.title,
      content: req.body.content,
      category: req.body.category || "General",
      slug,
      image: req.file ? req.file.path : null,
      author: req.user.id,
    });

    await newPost.save();

    res.status(201).json(newPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Failed to create post" });
  }
});


// =======================
// UPDATE POST (Admin)
// =======================
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ msg: "Post not found" });

    // Update fields
    if (req.body.title) {
      post.title = req.body.title;

      post.slug = req.body.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (req.body.content) post.content = req.body.content;
    if (req.body.category) post.category = req.body.category;

    // Replace image if new one uploaded
    if (req.file) {
      if (post.image) {
        const publicId = post.image.split("/").pop().split(".")[0];
        await cloudinary.uploader.destroy(`news_portal/${publicId}`);
      }

      post.image = req.file.path;
    }

    const updatedPost = await post.save();

    res.json(updatedPost);

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Update failed" });
  }
});


// =======================
// DELETE POST (Admin)
// =======================
router.delete("/:id", auth, async (req, res) => {
  try {
    if (req.user.role !== "admin")
      return res.status(403).json({ msg: "Access denied" });

    const post = await Post.findById(req.params.id);

    if (!post)
      return res.status(404).json({ msg: "Post not found" });

    // Delete image from Cloudinary
    if (post.image) {
      const publicId = post.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`news_portal/${publicId}`);
    }

    await post.deleteOne();

    res.json({ msg: "Post deleted successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Delete failed" });
  }
});

module.exports = router;