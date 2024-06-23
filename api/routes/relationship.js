import express from "express";
import {
  getRealtionship,
  addRelationship,
  deleteRelationship,
} from "../controllers/realtionshipController.js";

const router = express.Router();

router.get("/", getRealtionship);
router.post("/", addRelationship);
router.delete("/", deleteRelationship);
export default router;
