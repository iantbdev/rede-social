import express from "express";
import {
  createCommunity,
  getCommunities,
  addParticipant,
} from "../controllers/communityController.js";

const router = express.Router();

router.post("/create", createCommunity);
router.post("/add-participant", addParticipant);
router.get("/all", getCommunities);

export default router;
