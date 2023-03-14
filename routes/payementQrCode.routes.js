const router = require('express').Router();
const PayementByQRCODE = require('../controllers/payementQrCodeController');

router.post('/', PayementByQRCODE.createPayementByQrCode);

module.exports = router;