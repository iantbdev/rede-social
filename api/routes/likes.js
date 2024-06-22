import express from "express";
import {getLiked,getLikes,addLike} from "../controllers/likeController.js";

const router = express.Router();

router.get("/liked/:postId",getLiked);
router.get("/:postId",getLikes);
router.post("/:postId",addLike);
export default router;
