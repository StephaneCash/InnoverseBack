const router = require('express').Router();
const PassWordTransaction = require('../controllers/passUserTransactController');

router.post('/', PassWordTransaction.addPass);
router.get('/', PassWordTransaction.getAllPassUsers);
router.get('/:id', PassWordTransaction.getOnePass);
router.put('/:id', PassWordTransaction.updatePass);
router.delete('/:id', PassWordTransaction.deletePass);

module.exports = router;