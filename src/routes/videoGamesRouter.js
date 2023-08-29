const { Router } = require('express');
const { gamesByIdHandler, videoGamesHandler } = require('../handlers/videoGameHandler');
const { createVideoGame, deleteGame } = require('../controllers/videoGameIDControllers');
const handleDelete = require('../handlers/handleDelete');


const router = Router();

router.get('/', videoGamesHandler);

router.get('/:id', gamesByIdHandler);

router.post('/', createVideoGame);

router.delete("/videogames/:id", handleDelete)


module.exports = router;