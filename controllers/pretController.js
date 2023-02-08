const PretModel = require('../models/pretModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllprets = async (req, res) => {
    try {
        const prets = await PretModel.find();
        res.status(200).json({ data: prets, taille: prets.length });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

module.exports.addPret = async (req, res) => {
    try {
        let pret = await PretModel.create(req.body);
        if (pret) {
            res.status(201).json({ message: "Pret créé avec succès", data: pret });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

module.exports.getOnepret = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        PretModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('ID inconnu : ' + err);
            }
        });
    }
};

module.exports.updatepret = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await PretModel.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json({
                        docs, message: 'Pret updated'
                    })
                })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
};

module.exports.deletepret = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let pretDeleted = await PretModel.deleteOne({ _id: req.params.id }).exec();
            if (pretDeleted.deletedCount === 1) {
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            } else {
                res.status(404).json({ message: 'Pret non trouvé.' });
            }
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}
