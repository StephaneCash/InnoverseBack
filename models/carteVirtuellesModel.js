const mongoose = require('mongoose');

const CartesVirtuelles = new mongoose.Schema(
    {
        numero: {
            type: Number,
            required: true,
        },
        idObjectUser: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        compteId: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('cartesVirtuelles', CartesVirtuelles);