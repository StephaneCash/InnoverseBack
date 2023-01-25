const router = require('express').Router();
const transactionController = require('../controllers/transactionController');

router.patch('/:id', transactionController.addTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getOneTransaction);
router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;