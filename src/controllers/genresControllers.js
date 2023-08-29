const axios = require('axios');;
const { Genres } = require('../db');
const { API_KEY } = process.env;

/*
const getGenres = async (req, res) => {

    try {
      const response = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
      const genres = response.data.results.map(dato => dato.name);
       return res.status(200).json(genres);

    } catch (error) {
      throw new Error('Error getting genres from API.');
    }
  };
  */
  
  const getAllGenre = async (req, res) => {
    try {
      const response = await axios.get(`https://api.rawg.io/api/genres?key=${API_KEY}`);
      const genresToDb = response.data.results.map(dato => dato.name);
       genresToDb.forEach(ge => {
        Genres.findOrCreate({
          where: { 
            name: ge
          }
         })
        });
        const generoSaved = await Genres.findAll()
         return res.status(200).json(generoSaved);
    
    } catch (error) {
      return { error: error.message };
   };

  };


  module.exports = {
    getAllGenre
  };