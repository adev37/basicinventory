import express from "express";
import {
  createPurchaseOrder,
  getAllPOs,
} from "../controllers/purchaseOrderController.js";

const router = express.Router();

router.post("/", createPurchaseOrder);
router.get("/", getAllPOs);

export default router;
