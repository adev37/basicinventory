// backend/routes/stockRoutes.js
import express from "express";
import { getAllStock } from "../controllers/stockController.js";

const router = express.Router();

router.get("/", getAllStock);

export default router;
