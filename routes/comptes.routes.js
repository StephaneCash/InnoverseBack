const router = require('express').Router();
const compteController = require('../controllers/compteController');

router.post('/', compteController.addCompte);
router.get('/', compteController.getAllComptes);
router.get('/:id', compteController.getOneCompte);
router.put('/:id', compteController.updateCompte);
router.delete('/:id', compteController.deleteCompte);

router.post('/getCompteById', compteController.getOneCompteByUserId);

module.exports = router;