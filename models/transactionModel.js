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
        deviseId: {
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
        nomsUserTransfere: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('transaction', TransactionSchema);