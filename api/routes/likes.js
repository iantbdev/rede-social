import express from "express";
import {getLiked,getLikes,addLike} from "../controllers/likeController.js";

const router = express.Router();

router.get("/liked/:postagem_id",getLiked);
router.get("/:postagem_id",getLikes);
router.post("/",addLike);
export default router;
