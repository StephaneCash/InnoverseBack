const mongoose = require('mongoose');

const PhotoUser = new mongoose.Schema(
    {
        userId: {
            type: String,
            required: true,
        },
        url: {
            type: String,
        },
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('photo_user', PhotoUser);