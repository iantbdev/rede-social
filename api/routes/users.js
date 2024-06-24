import express from "express";
import { getUser, getSuggestions } from "../controllers/userController.js";

const router = express.Router();

router.get("/find/:id", getUser);
router.get("/suggestions/:id", getSuggestions);
export default router;
