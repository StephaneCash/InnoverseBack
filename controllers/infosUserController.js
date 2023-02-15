const infoSupplementaireModel = require('../models/InfosUserModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllInfosUser = async (req, res) => {
    try {
        const infosUser = await infoSupplementaireModel.findOne({ userId: req.body.userId });
        if (infosUser) {
            res.status(200).json(infosUser);
        } else {
            return res.status(400).json(infosUser);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports.addInfosUser = async (req, res) => {
    try {
        let infosUser = await infoSupplementaireModel.create(req.body);
        if (infosUser) {
            res.status(201).json({ message: "InfosUser créé avec succès", data: infosUser });
        }
    } catch (error) {
        if (error && error.code && error.code === 11000) {
            if (!ObjectID.isValid(req.body.id)) {
                return res.status(400).send('ID inconnu : ' + req.body.id)
            } else {
                try {
                    await infoSupplementaireModel.findOneAndUpdate(
                        { _id: req.body.id },
                        req.body,
                        { new: true, upsert: true, setDefaultsOnInsert: true }
                    )
                        .then((docs) => {
                            res.status(200).json({
                                docs, message: 'InfosUser updated'
                            })
                        })
                        .catch((err) => { return res.status(500).send({ message: err }) })
                } catch (err) {
                    return res.status(500).json({ message: err })
                }
            }
        } else {
            return res.status(500).json(error);
        }
    }
}

module.exports.getOneInfosUser = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        infoSupplementaireModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('ID inconnu : ' + err);
            }
        });
    }
};

module.exports.updateInfosUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await infoSupplementaireModel.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json({
                        docs, message: 'InfosUser updated'
                    })
                })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
};

module.exports.deleteInfosUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let infosUserDeleted = await infoSupplementaireModel.deleteOne({ _id: req.params.id }).exec();
            if (infosUserDeleted.deletedCount === 1) {
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            } else {
                res.status(404).json({ message: 'InfosUser non trouvée.' });
            }
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}
