const axios = require('axios');
const { Genres, Videogame } = require('../db');
const { API_KEY } = process.env;


const getVideoById = async (id) => {
  
  try {
    if (id) {
      const response = await axios.get(`https://api.rawg.io/api/games/${id}?key=${API_KEY}`);
      const gameData = response.data;
      
      const gameDetails = {
        id: gameData.id,
        name: gameData.name,
        image: gameData.background_image,
        platforms: gameData.platforms.map(pla => pla.platform.name),
        genres: gameData.genres.map(ge => ({ id: ge.id, name: ge.name })),
        released: gameData.released,
        updated: gameData.updated,
        rating: gameData.rating,
        website: gameData.website,
        description: gameData.description_raw,
      };

      return gameDetails;
    } else {
      return res.status(400).json({ error: 'Missing ID parameter' });
    }
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch game details.' });
  }
};

const createVideoGame = async (req, res) => {
  let {name, description, platforms, image, released, rating, genres, website} = req.body;
  
  try {
    let createGame = await Videogame.create({
      name, 
      description, 
      platforms: Array.isArray(platforms) ? platforms : [platforms], // Convierte el parametro obtenido en un array para que pueda ser registrado en la BDD..
      image, 
      released, 
      rating, 
      website,
    });
    
       let genreDb = await Genres.findAll({
         where: {
          name: Array.isArray(genres) ? genres : [genres]  // Si el parametro obtenido no es un array lo convierte para asegurarnos que el metodo findAll lo encuentre..
          }
      });
      await createGame.addGenres(genreDb);

      let gameCreated = await Videogame.findOne({
        attributes: ['name', 'id', 'description', 'platforms', 'image', 'released', 'rating', 'website'],
        where: { id: createGame.id },
        include: { model: Genres,
          attributes: ['name'],
          through: { attributes: [] }
        }
      });
      return res.status(201).json(gameCreated);
  } catch(error) {
    console.log(error);
    res.status(404).json({ error: error })
  };
};

const deleteGame = async (id) =>  {
  try {
    await Videogame.destroy({
      where: {
        id: id,
      },
    });
  } catch (error) {
    console.log('Error deleting video game:', error);
    throw error; // Re-throw the error to be caught by the caller (handleDelete)
  }
}


module.exports = {
  getVideoById,
  createVideoGame,
  deleteGame
};