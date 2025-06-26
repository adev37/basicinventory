import express from "express";
import { getStockLedger } from "../controllers/stockLedgerController.js";

const router = express.Router();

router.get("/", getStockLedger);

export default router;
