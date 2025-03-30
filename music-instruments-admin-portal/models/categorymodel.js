const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true }, // Image URL or file path
    description: { type: String }
});

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;
