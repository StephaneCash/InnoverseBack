const router = require('express').Router();
const infosUserController = require('../controllers/infosUserController');

router.post('/', infosUserController.addInfosUser);
router.get('/', infosUserController.getAllInfosUser);
router.get('/:id', infosUserController.getOneInfosUser);
router.put('/:id', infosUserController.updateInfosUser);
router.delete('/:id', infosUserController.deleteInfosUser);

module.exports = router;