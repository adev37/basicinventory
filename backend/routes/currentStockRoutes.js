import express from "express";
import {
  getCurrentStock,
  getDashboardStats,
} from "../controllers/currentStockController.js";

const router = express.Router();

router.get("/", getCurrentStock);
router.get("/summary", getDashboardStats); // ⬅️ dashboard stats

export default router;
