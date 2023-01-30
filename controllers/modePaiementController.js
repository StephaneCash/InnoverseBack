const ModePaiement = require('../models/modelPaiementUser');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllModepaiement = async (req, res) => {
    try {
        const data = await ModePaiement.find({ userId: req.body.userId });
        if (data) {
            res.status(200).json(data);
        } else {
            return res.status(400).json(data);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
};

module.exports.addModePaiement = async (req, res) => {
    try {
        let modePaiement = await ModePaiement.create(req.body);
        if (modePaiement) {
            res.status(201).json({ message: "modePaiement créé avec succès", data: modePaiement });
        }
    } catch (error) {
        if (error && error.code && error.code === 11000) {
            if (!ObjectID.isValid(req.body.id)) {
                return res.status(400).send('ID inconnu : ' + req.body.id)
            } else {
                try {
                    await ModePaiement.findOneAndUpdate(
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

module.exports.getOneModePaiement = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        ModePaiement.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('ID inconnu : ' + err);
            }
        });
    }
};

module.exports.updateModePaiement = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await ModePaiement.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json({
                        docs, message: 'ModePaiement updated'
                    })
                })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
};

module.exports.deleteModePaiement = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let modePaiement = await ModePaiement.deleteOne({ _id: req.params.id }).exec();
            if (modePaiement.deletedCount === 1) {
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            } else {
                res.status(404).json({ message: 'Devise non trouvée.' });
            }
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}
