import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import itemRoutes from "./routes/itemRoutes.js";
import warehouseRoutes from "./routes/warehouseRoutes.js";
import stockInRoutes from "./routes/stockInRoutes.js";
import stockOutRoutes from "./routes/stockOutRoutes.js";
import stockLedgerRoutes from "./routes/stockLedgerRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import currentStockRoutes from "./routes/currentStockRoutes.js";
import demoReturnRoutes from "./routes/demoReturnRoutes.js";
import stockTransferRoutes from "./routes/stockTransferRoutes.js";

// Load env vars
dotenv.config();

// Init app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect DB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/items", itemRoutes);
app.use("/api/warehouses", warehouseRoutes);
app.use("/api/stock-in", stockInRoutes);
app.use("/api/stock-out", stockOutRoutes);
app.use("/api/stock-ledger", stockLedgerRoutes);
app.use("/api/current-stock", currentStockRoutes);
app.use("/api/demo-returns", demoReturnRoutes);
app.use("/api/stock-transfers", stockTransferRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
