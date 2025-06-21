// === File: backend/routes/salesReturnRoutes.js ===
import express from "express";
import {
  createSalesReturn,
  getSalesReturns,
} from "../controllers/salesReturnController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createSalesReturn);
router.get("/", protect, getSalesReturns);

export default router;
