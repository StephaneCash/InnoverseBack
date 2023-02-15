const router = require('express').Router();
const compteController = require('../controllers/compteController');

router.post('/', compteController.addCompe);
router.post('/config', compteController.configCompte);
router.get('/', compteController.getAllComptes);
router.get('/:id', compteController.getOneCompte);
router.get('/getCompteByNum/:id', compteController.getCompteByNumber);

router.put('/:id', compteController.updateCompte);
router.delete('/:id', compteController.deleteCompte);

router.post('/getCompteById', compteController.getOneCompteByUserId);


module.exports = router;