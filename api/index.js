import express from "express"
import bodyParser from "body-parser"
import cors from "cors"
import cookieParser from "cookie-parser"
import dotenv from 'dotenv'

import userRoutes from "./routes/users.js"
import postRoutes from "./routes/posts.js"
import commentRoutes from "./routes/comments.js"
import likeRoutes from "./routes/likes.js"
import authRoutes from "./routes/auth.js"
import uploadRoute from "./routes/uploadFile.js"
import relationshipsRoute from "./routes/relationships.js"


dotenv.config()
const app = express()


//middlewares
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Credentials", true)
    next()
})
app.use(bodyParser.json())
app.use(cors({
    origin:"http://localhost:3000",
}))
app.use(cookieParser())

app.use("/api/upload", uploadRoute)
app.use("/api/auth", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/comments", commentRoutes)
app.use("/api/likes", likeRoutes)
app.use("/api/relationships",relationshipsRoute)

app.listen(8800)