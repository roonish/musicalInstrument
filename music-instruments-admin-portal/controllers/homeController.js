const Product = require('../models/productmodel');
const Category = require('../models/categorymodel');

exports.getHomePage = async (req, res) => {
    try {
        const products = await Product.find().populate('category');
        const categories = await Category.find();

        res.render('home', { 
            title: 'Home', 
            products, 
            categories, 
            error: req.query.error || null,
            success: req.query.success || null
        });
    } catch (error) {
        res.status(500).render('home', { 
            title: 'Home', 
            products: [], 
            categories: [], 
            error: 'Error loading data', 
            success: null 
        });
    }
};


