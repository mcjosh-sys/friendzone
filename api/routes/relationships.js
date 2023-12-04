import  Express  from "express";
import { getRelationship, addRelationship, deleteRelationship } from "../controllers/relationships.js";

const router = Express.Router()

router.get("/", getRelationship)
router.post("/", addRelationship)
router.delete("/", deleteRelationship)

export default router