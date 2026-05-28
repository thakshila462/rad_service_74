//customer.router.ts
//customerRouter.ts

import {Router} from "express"
import { getAllCustomer, saveCustomer } from "../controllers/customerController"

const router = Router()

router.post("/",saveCustomer)
router.get("/",getAllCustomer)

export default router