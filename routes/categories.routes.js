const router = require('express').Router();
const categorieController = require('../controllers/categorieController');

router.post('/', categorieController.addCategorie);
router.get('/', categorieController.getAllCategories);
router.get('/:id', categorieController.getOneCategorie);
router.put('/:id', categorieController.updateCategorie);
router.delete('/:id', categorieController.deleteCategorie);

module.exports = router;