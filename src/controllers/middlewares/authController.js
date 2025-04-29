import User from '../../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const generateToken = (userId, role) => {
  return jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
};

export const register = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;
    
    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).json({ message: 'Email ou nom d\'utilisateur déjà utilisé' });
    }

    const user = new User({ username, email, password, role });
    await user.save();

    // Génération du token JWT
    const token = generateToken(user._id, user.role);

    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = generateToken(user._id, user.role);

    res.json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addToFavorites = async (req, res) => {
    const userId = req.user.id;
    const pokemonId = req.body.pokemonId; // Pas besoin de Number() si ton front envoie déjà un nombre
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Utilisateur non trouvé' });
      }
  
      // Trouve l'index du pokemonId dans le tableau
      const index = user.favoritePokemons.indexOf(pokemonId);
      
      if (index > -1) {
        // Si présent, le retire
        user.favoritePokemons.splice(index, 1);
      } else {
        // Sinon l'ajoute
        user.favoritePokemons.push(pokemonId);
      }
  
      await user.save();
      res.status(200).json({ 
        success: true,
        isFavorite: index === -1, // true si ajouté, false si retiré
        favoritePokemons: user.favoritePokemons 
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };