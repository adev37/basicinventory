import express from "express";
import {
  createStockIn,
  getAllStockIns,
} from "../controllers/stockInController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken); // 🔒 all routes below require token

router.post("/", createStockIn); // ➕ Create
router.get("/", getAllStockIns); // 📃 List

export default router;
