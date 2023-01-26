const mongoose = require('mongoose');

const InfosUserSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        adresse: {
            type: String,
            trim: true,
        },
        numTel: {
            type: String,
            required: true,
        },
        dateAniv: {
            type: String,
            required: true,
        },
        codePostal: {
            type: String,
            required: true,
        },
        ville: {
            type: String,
            required: true,
        },
        sexe: {
            type: String,
            required: true,
        },
        prenom: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('infos_supplementaires', InfosUserSchema);