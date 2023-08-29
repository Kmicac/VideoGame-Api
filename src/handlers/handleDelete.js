const {deleteGame} = require('../controllers/videoGameIDControllers')


const handleDelete = async (req, res) => {
    let { id } = req.params;
    const saveId = id;
    try {
      const deleteId = await deleteGame(id);
     return res.status(200).json({"ID" : + saveId + "Is been deleted"});
    } catch (error) {
      console.log(error);
    }
  };

  module.exports = handleDelete;