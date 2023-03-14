const mongoose = require('mongoose');

const PayementQR = new mongoose.Schema(
    {
        numeroCompe: {
            type: Number,
            required: true,
        },
        url: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        userId: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('payementQrCode', PayementQR);