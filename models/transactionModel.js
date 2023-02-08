const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        compteId: {
            type: String,
            required: true,
        },
        motif: {
            type: String,
            required: true,
        },
        montant: {
            type: Number,
            required: true,
        },
        nomClient: {
            type: String,
            required: true,
        },
        status: Boolean,
        deviseId: String
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('transaction', TransactionSchema);