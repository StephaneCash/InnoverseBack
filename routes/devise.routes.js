const router = require('express').Router();
const deviseController = require('../controllers/deviseController');

router.post('/', deviseController.addDevise);
router.get('/', deviseController.getAllDevises);
router.get('/:id', deviseController.getOneDevise);
router.put('/:id', deviseController.updateDevise);
router.delete('/:id', deviseController.deleteUser);

router.post("/findDevisesByCompteId", deviseController.findDevisesByCompteId);

module.exports = router;