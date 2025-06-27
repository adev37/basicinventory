import express from "express";
import {
  getPendingDemoReturns,
  returnDemoItem,
  getAllDemoReturns,
  getDemoReturnReport,
} from "../controllers/demoController.js";

import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

router.use(verifyToken); // 🔒 all routes below require token

router.get("/", getPendingDemoReturns);
router.post("/return/:id", returnDemoItem);
router.get("/completed", getAllDemoReturns);
router.get("/report", getDemoReturnReport); //

export default router;
