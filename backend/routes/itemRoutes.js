import express from "express";
import { createItem, getAllItems } from "../controllers/itemController.js";

const router = express.Router();

router.post("/", createItem);
router.get("/", getAllItems);

export default router;
