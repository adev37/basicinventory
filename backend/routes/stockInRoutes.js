import express from "express";
import {
  createStockIn,
  getAllStockIns,
} from "../controllers/stockInController.js";

const router = express.Router();

router.post("/", createStockIn); // ➕ Create
router.get("/", getAllStockIns); // 📃 List

export default router;
