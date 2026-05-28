import {Router} from "express"
import { getAllUser , saveUser } from "../controllers/userController"
import { login } from "../controllers/userController"
import { authenticate } from "../middleware/auth"
import { requireRole } from "../middleware/role"
import { UserRole } from "../model/userModel"


const router = Router()

//PUBLIC
router.post("/register",saveUser)
router.post("/login",login)
router.get("/users",getAllUser)

//PROTECTED
router.get(
    "/me",authenticate,getAllUser
)

// ADMIN ONLY
router.post("/admin/register",requireRole([UserRole.ADMIN]),()=>{})

// ADMIN & MANAGER
router.post("/manager/register",requireRole([UserRole.ADMIN,UserRole.MANAGER]),()=>{})

export default router