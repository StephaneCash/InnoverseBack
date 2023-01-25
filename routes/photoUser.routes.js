const router = require('express').Router();
const photoUserController = require('../controllers/photoUserController');

router.post('/upload', photoUserController.addPhotoUser);
router.get('/', photoUserController.getAllPhotoUser);


router.get('/:id', photoUserController.getOnePhotoUser);
/*router.put('/:id', deviseController.updateDevise);
router.delete('/:id', deviseController.deleteUser);

router.post("/findDevisesByCompteId", deviseController.findDevisesByCompteId);*/

module.exports = router;