const mongoose = require('mongoose');

const CompteSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        numero: {
            type: String,
            trim: true,
            maxlength: 500,
            unique: true
        },
        deviseId: {
            type: String,
        },
        type: {
            type: String,
        },
        idCategorie: {
            type: String,
        },
        isValid: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('compte', CompteSchema);