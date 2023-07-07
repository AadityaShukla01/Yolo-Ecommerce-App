import {
    authUser,
    registerUser,
    logoutUser,
    getUserById, getUserProfile,
    updateUser,
    updateUserProfile,
    deleteUser, getUsers
} from '../controllers/userController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';
import express from 'express';

const router = express.Router();

router.get('/', protect, admin, getUsers);// admin
router.post('/', registerUser);
router.post('/logout', logoutUser);
router.post('/auth', authUser);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/:id', protect, admin, deleteUser);// admin
router.get("/:id", protect, admin, getUserById);// admin
router.put('/:id', protect, admin, updateUser);// admin


export default router;