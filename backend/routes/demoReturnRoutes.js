import express from "express";
import {
  getPendingDemoReturns,
  returnDemoItem,
  getAllDemoReturns,
  getDemoReturnReport,
} from "../controllers/demoController.js";

const router = express.Router();

router.get("/", getPendingDemoReturns);
router.post("/return/:id", returnDemoItem);
router.get("/completed", getAllDemoReturns);
router.get("/report", getDemoReturnReport); //

export default router;
