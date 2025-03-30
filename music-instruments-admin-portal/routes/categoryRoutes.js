const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');

// Routes
router.get('/', categoryController.getCategoryPage);
router.post('/add', categoryController.addCategory);
router.get('/delete/:id', categoryController.deleteCategory);
router.get('/edit/:id', categoryController.getEditCategoryPage);
router.post('/edit/:id', categoryController.updateCategory);

module.exports = router;
