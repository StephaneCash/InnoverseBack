const mongoose = require('mongoose');

const PassUserSchema = new mongoose.Schema(
    {
        idUser: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        isChange: {
            type: Boolean
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('passTransactUsers', PassUserSchema);