import express from "express";
import { createItem, getAllItems } from "../controllers/itemController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken); // 🔒 all routes below require token

router.post("/", createItem);
router.get("/", getAllItems);

export default router;
