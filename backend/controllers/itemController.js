import Item from "../models/Item.js";

// Create item
export const createItem = async (req, res) => {
  try {
    const newItem = await Item.create(req.body);
    res
      .status(201)
      .json({ message: "Item created successfully", item: newItem });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "This model number already exists for the selected company.",
      });
    }

    console.error("Error creating item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all items
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
