import express from "express";
import {
  getAllItems,
  getItemById,
  createItem,
  updateItem,
  deleteItem,
  bulkCreateItems,
  getItemsWithStock,
} from "../controllers/itemController.js";

const router = express.Router();

// router.use(protect); // Uncomment if using authentication

// ✅ 1. Static route first
router.get("/with-stock", getItemsWithStock);

// ✅ 2. Bulk insert must come early too
router.post("/bulk", bulkCreateItems);

// ✅ 3. Standard routes
router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/", createItem);
router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

export default router;
