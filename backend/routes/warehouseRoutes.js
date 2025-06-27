import express from "express";
import {
  createWarehouse,
  getAllWarehouses,
} from "../controllers/warehouseController.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken); // 🔒 all routes below require token

router.post("/", createWarehouse);
router.get("/", getAllWarehouses);

export default router;
