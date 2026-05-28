// Force Node to use a public DNS that handles SRV records properly
import dns from "node:dns"
dns.setServers(["8.8.8.8", "8.8.4.4"])


import express from "express"
import cors from "cors"
import customerRouter from "./routers/customerRouter"
import userRouter from "./routers/userRouters"
import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const PORT = process.env.PORT || 5000
const DB_URL = process.env.DB_URL || "mongodb://localhost:27017/customer_db"

const app = express()
app.use(cors())

app.use(express.json())

app.use("/api/v1/customer", customerRouter)
app.use("/api/v1/auth",userRouter)
app.use("/api/v1/auth/login",userRouter)

// app.use("/api/v1/item", itemRouter)    

mongoose.connect(DB_URL)
.then(()=>{
    //For only DB connect server start
//     app.listen(5000,() => {
//     console.log("Server is running on port : 5000")
// })

console.log("DB connected successfully")
})
.catch((err)=>{
    console.error(err)
})

app.listen(PORT,() => {
    console.log("Server is running on port : " + PORT)
})