const { Router } = require('express');
const { getAllGenre } = require('../controllers/genresControllers');

const router = Router();

router.get('/', getAllGenre);

module.exports = router;