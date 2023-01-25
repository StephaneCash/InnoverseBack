const mongoose = require('mongoose');

const InfosUserSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        AdresseDomicile: {
            type: String,
            trim: true,
        },
        typePieceIdentite: {
            type: String,
        },
        photoPieceIdentite: {
            type: String,
        },
        numeroPieceIdentie: {
            type: String,
            required: true,
        },
        numeroTel: {
            type: String,
            required: true,
        },
        nationalite: {
            type: String,
            required: true,
        },
        autreNoms: {
            type: String,
            required: true,
        },
        profession: {
            type: String,
            required: true,
        },
        gradeProfession: {
            type: String,
            required: true,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('infos_supplementaires', InfosUserSchema);