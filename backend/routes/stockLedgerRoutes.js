import express from "express";
import { getStockLedger } from "../controllers/stockLedgerController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken); // 🔒 al

router.get("/", getStockLedger);

export default router;
