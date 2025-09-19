const Comment = require("../models/Comment");

// reader+ can submit → pending
exports.addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { text } = req.body;
    const comment = await Comment.create({
      postId,
      author: req.user.id,
      text
    });
    res.status(201).json({ message: "comment submitted (pending)", comment });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// public: list approved
exports.listComments = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await Comment.find({ postId, status: "approved" })
      .populate("author", "email");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

// editor/admin: approve
exports.approveComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment) return res.status(404).json({ message: "comment not found" });

    comment.status = "approved";
    await comment.save();

    res.json({ message: "comment approved", comment });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
exports.listPendingForPost = async (req, res) => {
    const { postId } = req.params;
    const comments = await Comment.find({ postId, status: "pending" }).populate("author","email");
    res.json(comments);
  };    