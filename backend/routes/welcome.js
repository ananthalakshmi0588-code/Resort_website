const express = require ('express');
const router = express.Router();

const {createWelcome,getWelcome,updateWelcome,deleteWelcome} = require ('../controllers/welcomeController');

router.post('/' , createWelcome);
router.get('/' , getWelcome);
router.put('/:id' , updateWelcome);
router.delete('/:id' , deleteWelcome);


module.exports = router;
