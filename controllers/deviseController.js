const deviseModel = require('../models/deviseModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllDevises = async (req, res) => {
    const devises = await deviseModel.find();
    res.status(200).json(devises);
};

module.exports.addDevise = async (req, res) => {
    try {
        let devise = await deviseModel.create(req.body);
        if (devise) {
            res.status(201).json({ message: "Devise créée avec succès", data: devise });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

module.exports.getOneDevise = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        deviseModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('ID inconnu : ' + err);
            }
        });
    }
};

module.exports.updateDevise = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await deviseModel.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json({
                        docs, message: 'Devise updated'
                    })
                })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
};

module.exports.deleteUser = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let deviseDeleted = await deviseModel.deleteOne({ _id: req.params.id }).exec();
            if (deviseDeleted.deletedCount === 1) {
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            } else {
                res.status(404).json({ message: 'Devise non trouvée.' });
            }
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}

module.exports.findDevisesByCompteId = (req, res) => {
    if (!ObjectID.isValid(req.body.compteId)) {
        return res.status(400).json({message: `Id Inconnu ${req.body.compteId}`})
    } else {
        deviseModel.find({ compteId: new RegExp('^' + req.body.compteId + '$', "i") }, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                res.status(404).json('ID inconnu : ' + err);
            }
        });
    }
};
