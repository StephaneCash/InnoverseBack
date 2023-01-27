const router = require('express').Router();
const modePaiementController = require('../controllers/modePaiementController');

router.post('/', modePaiementController.addModePaiement);
router.patch('/', modePaiementController.getAllModepaiement);
router.get('/:id', modePaiementController.getOneModePaiement);
router.put('/:id', modePaiementController.updateModePaiement);
router.delete('/:id', modePaiementController.deleteModePaiement);

module.exports = router;