import  express  from "express";
import { getPosts, addPost } from "../controllers/posts.js";
import { authenticateUser } from "../middlewares.js";

const router = express.Router()

router.get("/", authenticateUser, getPosts)
router.post("/", authenticateUser, addPost)

export default router