import express from "express";
import { getComments, addComments } from "../controllers/commentsController.js";

const router = express.Router();

router.get("/", getComments);
router.post("/", addComments);
export default router;
