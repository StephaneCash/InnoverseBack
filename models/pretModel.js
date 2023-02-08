const mongoose = require("mongoose");

const PretSchema = mongoose.Schema(
    {
        civilite: {
            type: String,
            required: true
        },
        prenom: {
            type: String,
            required: true
        },
        nom: {
            type: String,
            required: true
        },
        situationFamiliale: {
            type: String,
            required: true
        },
        nbreEnfants: {
            type: Number,
            required: true
        },
        niveauEducation: {
            type: String,
            required: true
        },
        localite: {
            type: String,
            required: true
        },
        adresse: {
            type: String,
            required: true
        },
        anneEntreeLogement: {
            type: String,
            required: true
        },
        situationLogement: {
            type: String,
            required: true
        },
        telephonePortable: {
            type: String,
            required: true
        },
        telephoneProfessionnel: {
            type: String,
            required: true
        },
        metier: {
            type: String,
            required: true
        },
        nomEntreprise: {
            type: String,
            required: true
        },
        poste: {
            type: String,
            required: true
        },
        adresseEntreprise: {
            type: String,
            required: true
        },
        montant: {
            type: String,
            required: true
        },
        duree: {
            type: String,
            required: true
        },
        motif: {
            type: String,
            required: true
        },
        userId: String,
        status: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('prets', PretSchema);
