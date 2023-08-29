const axios = require('axios');
const { Videogame, Genres } = require('../db')
const { API_KEY } = process.env;


const getGamesName = async (name) => {
    let games = [];
    
    try {
    const response = await axios.get(`https://api.rawg.io/api/games?search=${name}&key=${API_KEY}`);
    const results = response.data.results;
    
    results.forEach((game) => {
      gameObj = {
        id: game.id,
        name: game.name,
        image: game.background_image,
        released: game.released,
        rating: game.rating,
        platforms: game.platforms.map((platform) => platform.platform.name),
        genres: game.genres.map((genre) => genre.name),
      };
      
      games.push(gameObj);
    });
  } catch (error) {
    console.error('Error fetching game data:', error);
  }
  return games;
};

const getVideoGames = async () => {

    let arrayGames = [];
    let totalPages = 5;
    let i = 1;

try {

    for (let i = 1; i <= totalPages; i++) {
        const allVideoGames = await axios.get(`https://api.rawg.io/api/games?key=${API_KEY}&page=${i}`)
        .then(res => res.data);
        arrayGames.push(allVideoGames);
    }
    const response = await Promise.all(arrayGames);
    const allCleanGames = response.flatMap(response => { 
        return response.results.map(elem => ({
        id: elem.id,
        name: elem.name,
        released: elem.released, 
        genres: elem.genres.map(da => da.name),
        rating: elem.rating,
        platforms: elem.platforms.map(da => da.platform.name),
        image: elem.background_image,
        description: elem.description_raw

    })).reduce((acumulador, elems) => acumulador.concat(elems), [])
  
}); 
   return allCleanGames;

} catch (error) {
  res.status(500).json({ error: 'Error fetching games data.'});
}

};


const dataBaseGame = async() => {
    try {
        const gamesFromDb = await Videogame.findAll(
            {
                include: {
                    model: Genres,
                    attribute: ["name"],
                    through: {
                        attributes: [],
                        },
                    },
            });
        return gamesFromDb;
        
    } catch (error) {
        return res.status(400).json({ error:'Could not find Data'});
    }
}; 

const getAllVideogames = async() => {
    return (await getVideoGames()).concat(await dataBaseGame());
};

module.exports = {
    getVideoGames, 
    getGamesName,
    dataBaseGame,
    getAllVideogames
};