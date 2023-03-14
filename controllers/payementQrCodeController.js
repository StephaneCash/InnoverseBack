const PayementQrModel = require('../models/payementQrCodeModel');
const QRCode = require('qrcode');

const createPayementByQrCode = async (req, res) => {
    try {
        const url = req.body.url;
        if (url.length === 0) {
            res.status(400).json({ message: "Veuillez entrer une donnée svp" })
        } else {
            QRCode.toDataURL(url, (err, url) => {
                if (err) {
                    return res.status(500).json({ err })
                } else {
                    res.status(201).json({ message: "Data saved", data: url })
                }
            })
        }
    } catch (err) {
        return res.status(500).json({ err })
    }
};

module.exports = {
    createPayementByQrCode
}
