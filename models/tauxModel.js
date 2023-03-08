const mongoose = require('mongoose');

const tauxModel = mongoose.Schema(
    {
        tauxCDF: {
            type: Number
        },
        tauxEuro: {
            type: Number
        },
        tauxUS: {
            type: Number
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('taux', tauxModel);