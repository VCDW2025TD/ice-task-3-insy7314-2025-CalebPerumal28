const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { requireAnyRole } = require("../middleware/roles");
const {
  addComment, listComments, approveComment
} = require("../controllers/commentController");
const { listPendingForPost } = require("../controllers/commentController");
const router = express.Router({ mergeParams: true });

// Add comment: reader+ (reader/author/editor/admin)
router.post("/", protect, requireAnyRole(["reader", "author", "editor", "admin"]), addComment);

// Public list approved
router.get("/", listComments);

// Approve: editor/admin
router.post("/:commentId/approve", protect, requireAnyRole(["editor", "admin"]), approveComment);
router.get("/pending", protect, requireAnyRole(["editor","admin"]), listPendingForPost);

module.exports = router;
