const Category = require('../models/categorymodel');

// Get Category Page
exports.getCategoryPage = async (req, res) => {
    try {
        const categories = await Category.find();
        res.render('category/index', { 
            title: 'Categories', 
            categories,
            error: req.query.error || null,  // Ensure error is always passed
            success: req.query.success || null // Ensure success is always passed
        });
    } catch (error) {
        res.status(500).render('category/index', { 
            title: 'Categories', 
            categories: [],
            error: "Error fetching categories",
            success: null
        });
    }
};


// Add New Category
exports.addCategory = async (req, res) => {
    try {
        const { name, image, description } = req.body;

        if (!name || !image) {
            return res.redirect('/categories?error=All fields are required!');
        }

        const newCategory = new Category({ name, image, description });
        await newCategory.save();
        
        res.redirect('/categories?success=Category added successfully!');
    } catch (error) {
        res.status(500).redirect('/categories?error=Error adding category');
    }
};

// Get Edit Category Page
exports.getEditCategoryPage = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.redirect('/categories?error=Category not found');
        }
        res.render('category/edit', { 
            title: 'Edit Category', 
            category,
            error: null,
            success: null
        });
    } catch (error) {
        res.redirect('/categories?error=Error loading category');
    }
};

// Update Category
exports.updateCategory = async (req, res) => {
    try {
        const { name, image, description } = req.body; // Destructure to include description
        await Category.findByIdAndUpdate(req.params.id, { name, image, description }); // Update all fields
        res.redirect('/categories?success=Category updated successfully'); // Redirect with success message
    } catch (error) {
        res.redirect(`/categories/edit/${req.params.id}?error=Error updating category`); // Redirect with error message
    }
};

// Delete Category
exports.deleteCategory = async (req, res) => {
    try {
        await Category.findByIdAndDelete(req.params.id);
        res.redirect('/categories?success=Category deleted!');
    } catch (error) {
        res.status(500).redirect('/categories?error=Error deleting category');
    }
};
