const Category = require("../models/CategoryModel");

const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({}).sort({ name: "asc" }).orFail();
    res.json(categories);
  } catch (error) {
    next(error);
  }
};

const newCategory = async (req, res, next) => {
  try {
    const { category } = req.body;
    if (!category) {
      throw new Error("Category input is required");
    }
    res.send(category);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, newCategory };
