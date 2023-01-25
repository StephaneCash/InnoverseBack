const PhotoUser = require('../models/photoUserModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllPhotoUser = async (req, res) => {
    const photoUser = await PhotoUser.find();
    res.status(200).json(photoUser);
};

module.exports.addPhotoUser = async (req, res) => {
    try {
        const photo = req.files.image;
        photo.mv('../InnoverseAdminFront/public/' + photo.name);
        let photoUser = await PhotoUser.create({
            url: photo.name,
            userId: req.body.userId
        });
        if (photoUser) {
            res.status(201).json({ message: "Photo ajoutée avec succès", data: photoUser });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

module.exports.getOnePhotoUser = (req, res) => {
    try {
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send('ID inconnu : ' + req.params.id)
        } else {
            PhotoUser.find({ userId: req.params.id }, (err, docs) => {
                if (!err) {
                    res.status(200).json(docs[docs.length - 1]);
                } else {
                    res.status(404).json('ID inconnu : ' + err);
                }
            });
        }
    } catch (error) {
        return res.status(500).json(error)
    }
};

module.exports.updatePhotoUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await photoUser.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json({
                        docs, message: 'PhotoUser updated'
                    })
                })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
};

module.exports.deletePhotoUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let PhotoUserDeleted = await photoUser.deleteOne({ _id: req.params.id }).exec();
            if (PhotoUserDeleted.deletedCount === 1) {
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            } else {
                res.status(404).json({ message: 'PhotoUser non trouvée.' });
            }
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}
