import express from 'express';
import { signup, login } from './authService.js';
import { signup, login } from '../Services/authService.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  try {
    const user = await signup(req.body);
    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const data = await login(req.body);
    res.json(data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});
import express from 'express';




router.post('/signup', signup);
router.post('/login', login);

export default router;




