const router = require('express').Router();
const transactionController = require('../controllers/transactionController');

router.post('/', transactionController.addTransaction);
router.get('/', transactionController.getAllTransactions);
router.get('/:id', transactionController.getOneTransaction);
router.get('/getByUserId/:id', transactionController.getAllTransactionsByUserId);

router.put('/:id', transactionController.updateTransaction);
router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;