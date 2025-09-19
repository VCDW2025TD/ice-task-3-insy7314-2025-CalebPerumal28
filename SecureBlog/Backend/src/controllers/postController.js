// src/controllers/postController.js
const Post = require("../models/Post");

// Author (author only) – create draft
exports.createDraft = async (req, res) => {
  try {
    const { title, body } = req.body;
    const post = await Post.create({ title, body, author: req.user.id });
    res.status(201).json({ message: "draft created", post });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Author can edit only own draft
exports.editDraft = async (req, res) => {
  try {
    const { postId } = req.params;
    const { title, body } = req.body;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "post not found" });

    if (post.status !== "draft")
      return res.status(400).json({ message: "cannot edit published post" });

    if (post.author.toString() !== req.user.id)
      return res.status(403).json({ message: "forbidden: not your draft" });

    if (title) post.title = title;
    if (body)  post.body  = body;
    await post.save();

    res.json({ message: "draft updated", post });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Editor/Admin – publish
exports.publishPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: "post not found" });

    post.status = "published";
    post.publishedAt = new Date();
    await post.save();

    res.json({ message: "post published", post });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Admin – hard delete
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const deleted = await Post.findByIdAndDelete(postId);
    if (!deleted) return res.status(404).json({ message: "post not found" });
    res.json({ message: "post deleted" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Public – list published
exports.listPosts = async (_req, res) => {
  try {
    const posts = await Post.find({ status: "published" }).populate("author", "email");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Public – read one published
exports.getPost = async (req, res) => {
  try {
    const { postId } = req.params;
    const post = await Post.findById(postId).populate("author", "email");
    if (!post || post.status !== "published")
      return res.status(404).json({ message: "post not found or not published" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Author – list my drafts
exports.listMyDrafts = async (req, res) => {
  try {
    const posts = await Post.find({ status: "draft", author: req.user.id });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// Editor/Admin – list all drafts
exports.listAllDrafts = async (_req, res) => {
  try {
    const posts = await Post.find({ status: "draft" }).populate("author", "email");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
