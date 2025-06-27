// routes/stockOutRoutes.js
import express from "express";
import {
  createStockOut,
  getAllStockOuts,
  getPendingDemoReturns,
} from "../controllers/stockOutController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken); // 🔒 all routes below require token

router.post("/", createStockOut);
router.get("/", getAllStockOuts);
router.get("/demo-returns", getPendingDemoReturns);

export default router;
