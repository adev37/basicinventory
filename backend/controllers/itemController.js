import Item from "../models/Item.js";
import Stock from "../models/Stock.js";

// @desc    Get all items
// @route   GET /api/items
// @access  Private
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find()
      .populate("category")
      .sort({ createdAt: -1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch items", error });
  }
};

// @desc    Get single item by ID
// @route   GET /api/items/:id
// @access  Private
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate("category");
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch item", error });
  }
};

// @desc    Add new item
// @route   POST /api/items
// @access  Private
export const createItem = async (req, res) => {
  try {
    const {
      name,
      sku,
      quantity,
      unit,
      category,
      description,
      pricePerUnit,
      lowStockThreshold,
      gst,
    } = req.body;

    const exists = await Item.findOne({ sku });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Item with this SKU already exists" });
    }

    const item = new Item({
      name,
      sku,
      quantity,
      unit,
      category,
      description,
      pricePerUnit,
      lowStockThreshold,
      gst,
      createdBy: req.user?._id || null,
    });

    const savedItem = await item.save();

    // ✅ Stock record with name of logged-in user
    await new Stock({
      item: savedItem._id,
      quantity: savedItem.quantity,
      lastUpdatedBy: req.user?.name || "System",
      remarks: "Initial quantity set during item creation",
    }).save();

    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: "Failed to create item", error });
  }
};

// @desc    Bulk add items
// @route   POST /api/items/bulk
// @access  Private
export const bulkCreateItems = async (req, res) => {
  try {
    const items = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No items provided" });
    }

    const skus = items.map((item) => item.sku);
    const existingItems = await Item.find({ sku: { $in: skus } });

    if (existingItems.length > 0) {
      const duplicates = existingItems.map((item) => item.sku);
      return res.status(400).json({
        message: "Duplicate SKUs found",
        duplicates,
      });
    }

    const enrichedItems = items.map((item) => ({
      ...item,
      createdBy: req.user?._id || null,
    }));

    const insertedItems = await Item.insertMany(enrichedItems);

    const stockEntries = insertedItems.map((item) => ({
      item: item._id,
      quantity: item.quantity || 0,
      lastUpdatedBy: req.user?.name || "Admin",
      remarks: "Initial stock from bulk add",
    }));

    await Stock.insertMany(stockEntries);

    res.status(201).json(insertedItems);
  } catch (error) {
    res.status(500).json({
      message: "Failed to insert bulk items",
      error: error.message,
    });
  }
};

// @desc    Update item
// @route   PUT /api/items/:id
// @access  Private
export const updateItem = async (req, res) => {
  try {
    const updated = await Item.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    if (!updated) return res.status(404).json({ message: "Item not found" });

    // ⚠️ Optional: add stock update logic here if needed

    res.status(200).json(updated);
  } catch (error) {
    res.status(500).json({ message: "Failed to update item", error });
  }
};

// @desc    Delete item
// @route   DELETE /api/items/:id
// @access  Private
export const deleteItem = async (req, res) => {
  try {
    const deleted = await Item.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Item not found" });

    await Stock.deleteOne({ item: req.params.id });

    res.status(200).json({ message: "Item and stock deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete item", error });
  }
};

// @desc    Get items with stock details
// @route   GET /api/items/with-stock
// @access  Private
export const getItemsWithStock = async (req, res) => {
  try {
    const items = await Item.find().populate("category");
    const stocks = await Stock.find();

    const stockMap = new Map();
    for (const stock of stocks) {
      stockMap.set(stock.item.toString(), stock);
    }

    const enrichedItems = items.map((item) => {
      const stock = stockMap.get(item._id.toString());
      return {
        ...item._doc,
        currentQty: stock?.quantity ?? item.quantity ?? 0,
        lastUpdatedBy: stock?.lastUpdatedBy || "-",
        remarks: stock?.remarks || "-",
      };
    });

    res.status(200).json(enrichedItems);
  } catch (error) {
    console.error("❌ getItemsWithStock error:", error);
    res.status(500).json({
      message: "Failed to load items with stock",
      error: error.message,
    });
  }
};
