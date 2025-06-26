import express from "express";
import {
  createWarehouse,
  getAllWarehouses,
} from "../controllers/warehouseController.js";

const router = express.Router();

router.post("/", createWarehouse);
router.get("/", getAllWarehouses);

export default router;
