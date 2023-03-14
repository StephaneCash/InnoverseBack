const mongoose = require('mongoose');

const CompteSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true
        },
        numero: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        type: String,
        dataQrCode: {
            type: String,
            required: true
        },
        urlQR: {
            type: String,
            required: true
        },
        devises: {
            type: [
                {
                    nom: String,
                    montant: Number,
                    devise: String,
                    compteId: String
                }
            ]
        },
        isValid: Boolean
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('compteUser', CompteSchema);