const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes for Product Management
router.get('/', productController.getProductPage);
router.post('/add', productController.addProduct);
router.get('/edit/:id', productController.getEditProductPage);
router.post('/update/:id', productController.updateProduct);
router.get('/delete/:id', productController.deleteProduct);

module.exports = router;
