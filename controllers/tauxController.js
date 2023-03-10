const tauxModel = require('../models/tauxModel');
const ObjectID = require('mongoose').Types.ObjectId;
const compteModel = require('../models/compteModel');

module.exports.getAlltaux = async (req, res) => {
    try {
        const taux = await tauxModel.find();
        res.status(200).json({ data: taux, taille: taux.length });
    } catch (error) {
        return res.status(500).json({ error });
    }
};


module.exports.addTaux = async (req, res) => {
    try {
        let taux = await tauxModel.create(req.body);
        if (taux) {
            res.status(201).json({ message: "Taux créé avec succès", data: taux });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

module.exports.getOneTaux = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        tauxModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.json({
                    data: docs,
                    message: docs ? "Taux trouvé avec succès" : "Aucun taux trouvé"
                });
            } else {
                console.log('ID inconnu : ' + err);
            }
        });
    }
};

module.exports.updateTaux = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await tauxModel.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json({
                        docs, message: 'Taux updated'
                    })
                })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
};

module.exports.deleteTaux = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let tauxDeleted = await tauxModel.deleteOne({ _id: req.params.id }).exec();
            if (tauxDeleted.deletedCount === 1) {
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            } else {
                res.status(404).json({ message: 'Taux non trouvé.' });
            }
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}

module.exports.convertDevise = async (req, res) => {
    return compteModel.findOne(
        { _id: req.body.compteId },
        (err, docs) => {
            const repCompte = docs.devises.find((compte) =>
                compte.devise === req.body.deviseDe ? true : false
            );
            if (repCompte) {
                repCompte.montant = repCompte.montant - req.body.montantAconvertir;

                const deviseConvertie = docs.devises.find((compte) =>
                    compte.devise === req.body.deviseVers ? true : false
                );
                if (deviseConvertie) {
                    deviseConvertie.montant = deviseConvertie.montant + req.body.montantConverti
                }
            } else {
                return res.status(404).send('Compte non trouvé ' + req.body.compteId);
            }

            return docs.save((err) => {
                if (!err) {
                    res.status(200).json({ message: "Opération effectuée avec succès", data: docs })
                } else {
                    return res.status(500).json(err);
                }
            })
        }
    ).clone().catch(function (err) { console.log(err) });
}
