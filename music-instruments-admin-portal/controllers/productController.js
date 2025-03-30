const Product = require('../models/productmodel');
const Category = require('../models/categorymodel');

// Get Product Page
exports.getProductPage = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        const categories = await Category.find();
        res.render('product/index', { 
            title: 'Products', 
            products,
            categories,
            error: req.query.error || null,  
            success: req.query.success || null 
        });
    } catch (error) {
        res.status(500).render('product/index', { 
            title: 'Products', 
            products: [],
            categories: [],
            error: "Error fetching products",
            success: null
        });
    }
};

// Add New Product
exports.addProduct = async (req, res) => {
    try {
        const { name, description, category, quantity, price, image } = req.body;

        if (!name || !category || !quantity || !price || !image) {
            return res.redirect('/products?error=All fields are required!');
        }

        const newProduct = new Product({ name, description, category, quantity, price, image });
        await newProduct.save();
        
        res.redirect('/products?success=Product added successfully!');
    } catch (error) {
        res.redirect('/products?error=Error adding product');
    }
};

// Get Edit Product Page
exports.getEditProductPage = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        const categories = await Category.find();
        if (!product) {
            return res.redirect('/products?error=Product not found');
        }
        res.render('product/edit', { 
            title: 'Edit Product', 
            product,
            categories,
            error: null,
            success: null
        });
    } catch (error) {
        res.redirect('/products?error=Error loading product');
    }
};

// Update Product
exports.updateProduct = async (req, res) => {
    try {
        const { name, description, category, quantity, price, image } = req.body;

        await Product.findByIdAndUpdate(req.params.id, { name, description, category, quantity, price, image });
        res.redirect('/products?success=Product updated successfully');
    } catch (error) {
        res.redirect(`/products/edit/${req.params.id}?error=Error updating product`);
    }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products?success=Product deleted!');
    } catch (error) {
        res.redirect('/products?error=Error deleting product');
    }
};
