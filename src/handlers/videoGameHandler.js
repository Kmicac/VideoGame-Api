const {  getAllVideogames } = require('../controllers/videoGameControllers');
const { getVideoById } = require('../controllers/videoGameIDControllers');
const { Videogame, Genres } = require('../db');

const videoGamesHandler = async (req, res) => {
    const { search: name } = req.query;
    try {
        if (name){
            let fifteenGames = await getAllVideogames();
            const filteredGames = fifteenGames.filter(game => 
                game.name.toLowerCase().includes(name.toLowerCase()));
                const slicedGames = filteredGames.slice(0, 15);
                res.status(200).json(slicedGames);
                
            } else {
            const allGames = await getAllVideogames();
            return res.status(200).json(allGames);
        }
    } catch (error) {
        console.log(error);
      return res.status(400).json({ error: message });
    }
  };
  

const gamesByIdHandler = async (req, res) => {
const { id } = req.params;
    
    try{
        if(!isNaN(id)){
            let getGames = await getVideoById(id);
           return res.status(200).json(getGames);
        }
        else{
            const game = await Videogame.findByPk(id, {
                include: [{
                    model: Genres,
                    attributes: ['name'],
                    through : {
                        attributes: [],
                    }
                }]
            });
            res.status(200).json(game);
        }
    }
    catch(e){
        res.status(404).send({ error: 'Sorry we could not find the game with the' +' '+ id +' '+ 'ID, please entry a validate ID..'});
    };
};
 

module.exports = {
    videoGamesHandler,
    gamesByIdHandler
}
