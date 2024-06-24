import express from "express";
import {
  createCommunity,
  addParticipant,
  getUserCommunities,
  getCommunityUsers,
  getUserCount,
} from "../controllers/communityController.js";

const router = express.Router();

router.post("/create", createCommunity);
router.post("/add-participant", addParticipant);
router.get("/user/:userId", getUserCommunities);
router.get("/users/:comunidadeId", getCommunityUsers);
router.get("/user-count/:comunidadeId", getUserCount);

export default router;
