const router = require('express').Router();
const CarteVirtuellesController = require('../controllers/cartesVirtuelles');

router.post('/', CarteVirtuellesController.createUserStripe);

/*
router.get('/', categorieController.getAllCategories);
router.get('/:id', categorieController.getOneCategorie);
router.put('/:id', categorieController.updateCategorie);
router.delete('/:id', categorieController.deleteCategorie);*/

module.exports = router;