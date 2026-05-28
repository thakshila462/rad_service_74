// src/routes/blogRouter.ts

import { Router } from "express"
import {
  getAllBlogs,
  getMyBlogs,
  saveBlog,
  generateContent
} from "../controllers/blogController"

import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../model/userModel"
import { upload } from "../middleware/upload"

const router = Router()

// CREATE BLOG
router.post(
  "/create",
  authenticate,
  requireRole([UserRole.ADMIN, UserRole.MANAGER]),
  upload.single("image"),
  saveBlog
)

// AI GENERATE CONTENT
router.post("/generate", generateContent)

// TEST ROUTE
router.get("/generate", (req, res) => {
  res.send("Generate route working")
})

// GET ALL BLOGS
router.get("/", getAllBlogs)

// GET MY BLOGS
router.get(
  "/me",
  authenticate,
  requireRole([UserRole.ADMIN, UserRole.MANAGER]),
  getMyBlogs
)

export default router