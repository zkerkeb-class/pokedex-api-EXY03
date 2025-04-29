import mongoose from 'mongoose';

const pokemonSchema = new mongoose.Schema({
  id: {
    type: Number,
    required: true,
    unique: true
  },
  name: {
    type: Object,
    required: true
  },
  type: [{
    type: String,
    enum: [
      "fire", "water", "grass", "electric", "ice", "fighting",
      "poison", "ground", "flying", "psychic", "bug", "rock",
      "ghost", "dragon", "dark", "steel", "fairy"
    ]
  }],
  image: {
    type: String
  },
  base: {
    HP: Number,
    Attack: Number,
    Defense: Number,
    SpAttack: Number,
    SpDefense: Number,
    Speed: Number
  },
  evolutions: [{
    type: Number,
    ref: 'Pokemon'
  }]
}, {
  timestamps: true
});

const Pokemon = mongoose.model('pokemons', pokemonSchema);

export default Pokemon;
