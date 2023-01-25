const mongoose = require('mongoose');

const DeviseSchema = new mongoose.Schema(
    {
        montant: {
            type: Number,
            required: true,
        },
        nom: {
            type: String,
            trim: true,
            maxlength: 500,
        },
        compteId: {
            type: String
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('devise', DeviseSchema);