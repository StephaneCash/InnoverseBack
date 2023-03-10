const router = require('express').Router();
const TauxController = require('../controllers/tauxController');

router.post('/', TauxController.addTaux);
router.get('/', TauxController.getAlltaux);
router.get('/:id', TauxController.getOneTaux);
router.put('/:id', TauxController.updateTaux);
router.delete('/:id', TauxController.deleteTaux);

router.post('/convert', TauxController.convertDevise);

module.exports = router;