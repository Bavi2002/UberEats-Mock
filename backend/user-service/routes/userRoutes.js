import express from 'express';
import { verifyAuth, restrictTo } from '../middlewares/authMiddleware.js';
import {
  userProfile,
  getUserByparam,
  addToCart,
  getCart,
  updateUserDetails,
  deleteUser,
} from '../controllers/userController.js';
import { updateUserRole } from '../controllers/userController.js';

const router = express.Router();

router.get('/profile', verifyAuth, userProfile);

router.patch(
  '/:id/role',
  verifyAuth,
  restrictTo('system_admin'),
  updateUserRole
);

// Add item to cart (protected route)
router.post('/cart', verifyAuth, addToCart);

// Fetch user's cart (protected route)
router.get('/cart', verifyAuth, getCart);

// Added by Bavi for need in the Order Service
router.get('/:id', getUserByparam);

// Update user details (protected route)
router.patch('/update', verifyAuth, updateUserDetails);

// Delete user (protected route)
router.delete('/delete', verifyAuth, deleteUser);

//user profile route
router.get('/profile', verifyAuth, userProfile);

export default router;
