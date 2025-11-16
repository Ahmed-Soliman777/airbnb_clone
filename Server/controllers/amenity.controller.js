const Amenities = require("../models/Amenities.model");

// Create new amenity (only admin)
exports.createAmenity = async (req, res) => {
  try {
    const { name, icon, description } = req.body;

    if (!name || !icon) {
      return res.status(400).json({ message: "Name and icon are required" });
    }

    const newAmenity = new Amenities({ name, icon, description });
    await newAmenity.save();

    res
      .status(201)
      .json({ message: "Amenity created successfully", data: newAmenity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all amenities
exports.getAmenities = async (req, res) => {
  try {
    const amenities = await Amenities.find();
    res.status(200).json({ data: amenities });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update amenity (only admin)
exports.updateAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const updatedAmenity = await Amenities.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedAmenity)
      return res.status(404).json({ message: "Amenity not found" });

    res.status(200).json({ message: "Amenity updated", data: updatedAmenity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete amenity (only admin)
exports.deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedAmenity = await Amenities.findByIdAndDelete(id);

    if (!deletedAmenity)
      return res.status(404).json({ message: "Amenity not found" });

    res.status(200).json({ message: "Amenity deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
