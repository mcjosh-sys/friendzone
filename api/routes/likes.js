import  Express  from "express";
import { getLikes, addLike, deleteLike } from "../controllers/likes.js";
import { authenticateUser } from "../middlewares.js";

const router = Express.Router()

router.get("/", getLikes)
router.post("/", authenticateUser, addLike)
router.delete("/", authenticateUser, deleteLike)

export default router