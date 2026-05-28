// src/controllers/blogController.ts

import { Request, Response } from "express"
import cloudinary from "../config/cloudinary"
import { BlogModel } from "../model/blogModel"
import { AuthRequest } from "../middleware/auth"
import axios from "axios"
import dotenv from "dotenv"

dotenv.config()

// CREATE BLOG
export const saveBlog = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body

  try {
    let imageUrl = ""

    // upload image to cloudinary
    if (req.file) {
      const result: any = await new Promise((resolve, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: "blog" },
          (error, result) => {
            if (error) {
              return reject(error)
            }

            resolve(result)
          }
        )

        upload_stream.end(req.file!.buffer)
      })

      imageUrl = result.secure_url
    }

    const newBlog = new BlogModel({
      title,
      content,
      imageURL: imageUrl,
      author: req.user.sub
    })

    await newBlog.save()

    res.status(201).json({
      message: "Blog created successfully",
      data: newBlog
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: "Failed to create blog"
    })
  }
}

// GET ALL BLOGS
export const getAllBlogs = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10

  const skip = (page - 1) * limit

  try {
    const blogs = await BlogModel.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalDataCount = await BlogModel.countDocuments()

    res.status(200).json({
      message: "Blogs fetched successfully",
      data: blogs,
      totalPage: Math.ceil(totalDataCount / limit),
      totalDataCount,
      page
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: "Failed to fetch blogs"
    })
  }
}

// GET MY BLOGS
export const getMyBlogs = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10

  const skip = (page - 1) * limit

  try {
    const blogs = await BlogModel.find({
      author: req.user.sub
    })
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalDataCount = await BlogModel.countDocuments({
      author: req.user.sub
    })

    res.status(200).json({
      message: "My blogs fetched successfully",
      data: blogs,
      totalPage: Math.ceil(totalDataCount / limit),
      totalDataCount,
      page
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: "Failed to fetch my blogs"
    })
  }
}

// GOOGLE GEMINI API KEY
const API_KEY = process.env.GOOGLE_API_KEY

// GENERATE AI CONTENT
export const generateContent = async (req: Request, res: Response) => {
  const { text, maxToken } = req.body

  try {
    const aiResponse = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
      {
        contents: [
          {
            parts: [{ text }]
          }
        ],
        generationConfig: {
          maxOutputTokens: maxToken || 150
        }
      },
      {
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": API_KEY
        }
      }
    )

    const generatedContent =
      aiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No generated content"

    res.status(200).json({
      message: "Content generated successfully",
      data: generatedContent
    })
  } catch (err) {
    console.error(err)

    res.status(500).json({
      message: "Failed to generate content"
    })
  }
}