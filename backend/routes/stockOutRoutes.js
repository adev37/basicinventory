// routes/stockOutRoutes.js
import express from "express";
import {
  createStockOut,
  getAllStockOuts,
  getPendingDemoReturns,
} from "../controllers/stockOutController.js";

const router = express.Router();

router.post("/", createStockOut);
router.get("/", getAllStockOuts);
router.get("/demo-returns", getPendingDemoReturns);

export default router;
