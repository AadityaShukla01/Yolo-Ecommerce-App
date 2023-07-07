import express from 'express';
const router = express.Router();
import { createProduct, createProductReview, deleteProduct, getProductById, getProducts, getTopProducts, updateProduct } from '../controllers/productController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';


router.get('/top', getTopProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/:id/reviews', protect, createProductReview);
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', deleteProduct);

export default router;