const router = require('express').Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router.post('/', authController.signUp);
router.post('/login', authController.signIn);
router.get('/logout', authController.deconnexion);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getOneUser);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);

module.exports = router;