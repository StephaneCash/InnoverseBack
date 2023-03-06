const router = require('express').Router();
const PretController = require('../controllers/pretController');

router.post('/', PretController.addPret);
router.get('/', PretController.getAllprets);
router.get('/:id', PretController.getOnepret);
router.put('/:id', PretController.updatepret);
router.delete('/:id', PretController.deletepret);

router.get('/v1/users/:id', PretController.getAllpretsByUserId);

module.exports = router;