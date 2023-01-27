const mongoose = require('mongoose');

const ModePaiement = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
            unique: true
        },
        airtel: {
            type: String,
            trim: true,
        },
        mpsa: {
            type: String,
            trim: true,
        },
        americainExpress: {
            type: String,
            required: true,
        },
        bitcoin: {
            type: String,
            required: true,
        },
        orange: {
            type: String,
            required: true,
        },
        africell: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('mode_paiement', ModePaiement);