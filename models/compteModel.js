const mongoose = require('mongoose');

const CompteSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
        },
        numero: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        type: String,
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