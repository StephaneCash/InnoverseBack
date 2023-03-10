const mongoose = require('mongoose');

const PassUserSchema = new mongoose.Schema(
    {
        idUser: {
            type: String,
            required: true,
        },
        password: {
            type: String,
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('passTransactUsers', PassUserSchema);