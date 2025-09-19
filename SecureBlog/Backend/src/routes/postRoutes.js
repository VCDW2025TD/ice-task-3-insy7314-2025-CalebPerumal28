const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { requireAnyRole } = require("../middleware/roles");
const {
  createDraft, editDraft, publishPost, deletePost, listPosts, getPost
} = require("../controllers/postController");
const { listMyDrafts, listAllDrafts } = require("../controllers/postController");

const router = express.Router();

// Create draft: author+ (author/editor/admin)
router.post("/", protect, requireAnyRole(["author", "editor", "admin"]), createDraft);

// Edit own draft: author only (admins can bypass with a separate tool if needed)
router.put("/:postId", protect, requireAnyRole(["author"]), editDraft);

// Publish: editor/admin
router.post("/:postId/publish", protect, requireAnyRole(["editor", "admin"]), publishPost);

// Hard delete: admin
router.delete("/:postId", protect, requireAnyRole(["admin"]), deletePost);
router.get("/mine",   protect, requireAnyRole(["author"]),           listMyDrafts);
router.get("/drafts", protect, requireAnyRole(["editor","admin"]),   listAllDrafts);
// Public
router.get("/", listPosts);
router.get("/:postId", getPost);

module.exports = router;
