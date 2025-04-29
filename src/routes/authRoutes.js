import express from 'express';
import { register, login, addToFavorites } from '../controllers/middlewares/authController.js';
import { protect } from '../middlewares/auth.js'; 

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.put('/favorites', protect, addToFavorites);

router.get('/profile', protect, (req, res) => {
    res.json(req.user);
  });
export default router;