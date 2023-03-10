const PassModel = require('../models/passUserTransacModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllPassUsers = async (req, res) => {
    try {
        const passUsers = await PassModel.find();
        res.status(200).json({ data: passUsers, taille: passUsers.length });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

module.exports.addPass = async (req, res) => {
    try {
        let Pass = await PassModel.create(req.body);
        if (Pass) {
            res.status(201).json({ message: "Password user créé avec succès", data: Pass });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

module.exports.getOnePass = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        PassModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.json({
                    data: docs,
                    message: docs ? "PassWord user trouvé avec succès" : "Aucun password user trouvé"
                });
            } else {
                console.log('ID inconnu : ' + err);
            }
        });
    }
};

module.exports.updatePass = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await PassModel.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json({
                        docs, message: 'Pass updated'
                    })
                })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
};

module.exports.deletePass = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let PassDeleted = await PassModel.deleteOne({ _id: req.params.id }).exec();
            if (PassDeleted.deletedCount === 1) {
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            } else {
                res.status(404).json({ message: 'Pass non trouvé.' });
            }
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}
