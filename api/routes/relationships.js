import  Express  from "express";
import { getRelationship, addRelationship, deleteRelationship } from "../controllers/relationships.js";
import { authenticateUser } from "../middlewares.js";

const router = Express.Router()

router.get("/", getRelationship)
router.post("/", authenticateUser, addRelationship)
router.delete("/", authenticateUser, deleteRelationship)

export default router