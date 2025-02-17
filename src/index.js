import express from "express";
import cors from "cors";
import fs from 'fs';
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Lire le fichier JSON
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const pokemonsList = JSON.parse(fs.readFileSync(path.join(__dirname, './data/pokemons.json'), 'utf8'));

const app = express();
const PORT = 3000;

// Middleware pour CORS
app.use(cors());

// Middleware pour parser le JSON
app.use(express.json());

// Middleware pour servir des fichiers statiques
// 'app.use' est utilisé pour ajouter un middleware à notre application Express
// '/assets' est le chemin virtuel où les fichiers seront accessibles
// 'express.static' est un middleware qui sert des fichiers statiques
// 'path.join(__dirname, '../assets')' construit le chemin absolu vers le dossier 'assets'
app.use("/assets", express.static(path.join(__dirname, "../assets")));

// Route GET de base
app.get("/api/pokemons", (req, res) => {
  res.status(200).send({
    pokemons: pokemonsList,
  });
});

app.get("/", (req, res) => {
  res.send("bienvenue sur l'API Pokémon");
});

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
app.get("/api/pokemons/:id", (req, res) => {
  const pokemonId = parseInt(req.params.id); // Récupère l'ID depuis l'URL et le convertit en nombre
  const pokemon = pokemonsList.find((p) => p.id === pokemonId); // Recherche du Pokémon par ID

  if (pokemon) {
    res.status(200).send(pokemon); // Envoie le Pokémon trouvé
  } else {
    res.status(404).send({ message: "Pokémon non trouvé" }); // Envoie une erreur si l'ID est introuvable
  }
});


app.post("/api/pokemons", (req, res) => {
  const newPokemon = req.body; // Les données du nouveau Pokémon envoyées dans le corps de la requête
  pokemonsList.push(newPokemon);// Ajouter le nouveau Pokémon à la liste

  try {// Réécrire le fichier pokemons.json
    fs.writeFileSync(path.join(__dirname, './data/pokemons.json'), JSON.stringify(pokemonsList, null, 2), 'utf8');///maj fichier json
    res.status(201).send({ message: "Pokémon ajouté", pokemon: newPokemon });
  } catch (error) {
    console.error("Erreur lors de l'écriture dans le fichier pokemons.json :", error);
    res.status(500).send({ message: "Erreur interne du serveur" });
  }
});



app.delete("/api/pokemons/:id", (req, res) => {
  const pokemonId = parseInt(req.params.id); 
  const pokemonIndex = pokemonsList.findIndex((p) => p.id === pokemonId); // Utilisation de findIndex pour obtenir l'index du Pokémon
  //const pokemon = pokemonsList.find((p) => p.id === pokemonId); ne fonctionne pas car on lui dit de supprimer un index dans la liste et non un objet pokemon

  if (pokemonIndex !== -1) {
    const deletedPokemon = pokemonsList.splice(pokemonIndex, 1); // Suppression du Pokémon
    
    // Réécriture du fichier pokemons.json avec la liste mise à jour
    try {
      fs.writeFileSync(path.join(__dirname, './data/pokemons.json'), JSON.stringify(pokemonsList, null, 2), 'utf8');
      res.status(200).send({ message: "Pokémon supprimé", pokemon: deletedPokemon });
    } catch (error) {
      console.error("Erreur lors de l'écriture dans le fichier pokemons.json :", error);
      res.status(500).send({ message: "Erreur interne du serveur" });
    }
  } else {
    res.status(404).send({ message: "Pokémon non trouvé" });
  }
});

app.put("/api/pokemons/:id", (req, res) => {
  const pokemonId = parseInt(req.params.id); // ID du Pokémon à mettre à jour
  const updatedPokemon = req.body; // Données du Pokémon mises à jour
  const pokemonIndex = pokemonsList.findIndex((p) => p.id === pokemonId);

  if (pokemonIndex !== -1) {
    // Mise à jour du Pokémon dans la liste
    pokemonsList[pokemonIndex] = { ...pokemonsList[pokemonIndex], ...updatedPokemon };

    fs.writeFileSync(path.join(__dirname, './data/pokemons.json'), JSON.stringify(pokemonsList, null, 2), 'utf8');

    // Retourner une réponse indiquant que l'update a réussi
    res.status(200).send({ message: "Pokémon mis à jour", pokemon: pokemonsList[pokemonIndex] });
  } else{
    return res.status(404).send({ message: "Pokémon non trouvé" });
  }


});



// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
