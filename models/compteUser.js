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
        },
        deviseId: {
            type: String,
        },
        type: {
            type: String,
        },
        idCategorie: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('compte', CompteSchema);