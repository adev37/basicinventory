import express from "express";
import {
  createInvoice,
  getAllInvoices,
} from "../controllers/salesInvoiceController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createInvoice);
router.get("/", protect, getAllInvoices);

export default router;
