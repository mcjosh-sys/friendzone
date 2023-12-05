import  Express  from "express";
import { addComment, getComments } from "../controllers/comments.js";
import { authenticateUser } from "../middlewares.js";

const router = Express.Router()

router.get("/", getComments)
router.post("/", authenticateUser, addComment)

export default router