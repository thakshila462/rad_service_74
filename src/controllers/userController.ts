import { Request, Response } from "express"
import { IUser, User, UserRole } from "../model/userModel"
import bcrypt from "bcryptjs"
import { sign } from "node:crypto"
import { signAccessToken, signRefreshToken } from "../utils/token"

export const saveUser = async (req: Request, res: Response) => {

  const {
    name,
    email,
    password,
    roles = [UserRole.ADMIN],
    approved = true
  } = req.body

  try {

    const exUser = await User.findOne({ email })

    if (exUser) {
      return res.status(400).json({
        message: "User already exists..!"
      })
    }

    const salt = bcrypt.genSaltSync(10)

    const hashedPassword = bcrypt.hashSync(password, salt)

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      roles,
      approved
    })

    const savedUser = await newUser.save()

    res.status(201).json({
      message: "User registration successfully..!",
      data: {
        name: savedUser.name,
        email: savedUser.email,
        roles: savedUser.roles,
        approved: savedUser.approved,
        id: savedUser._id
      }
    })

  } catch (err) {

    console.error(err)

    res.status(500).json({
      message: "Internal server error while creating user..!"
    })

  }

}
// api/v1/auth/login
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const user: IUser | null = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials..!" })
    }

    const isValid = await bcrypt.compare(password, user?.password)
    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials..!" })
    }


    const accessToken = signAccessToken(user)
    const refreshToken = signRefreshToken(user)

    res.status(200).json({
      message: "Login Successfully...!",
      data: {
        email: user?.email,
        roles: user?.roles,
        accessToken,
        refreshToken
      }
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Internal server error while login..!"
    })
  }
}

export const getAllUser = async (req: Request, res: Response) => {
  try {
    const users = await User.find().select("-password")
    res.status(200).json({
      message: "Users retrieved successfully..!",
      data: users
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({
      message: "Internal server error while retrieving users..!"
    })
  }
}