import express from "express";
import {
  createStockTransfer,
  getAllTransfers,
} from "../controllers/stockTransferController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken);

router.post("/", createStockTransfer);
router.get("/", getAllTransfers);

export default router;
