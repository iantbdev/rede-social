import express from "express";
import {
  createCommunity,
  addParticipant,
  getUserCommunities,
} from "../controllers/communityController.js";

const router = express.Router();

router.post("/create", createCommunity);
router.post("/add-participant", addParticipant);
router.get("/user/:userId", getUserCommunities);

export default router;
