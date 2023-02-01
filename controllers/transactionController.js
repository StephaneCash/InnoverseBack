const transactionModel = require('../models/transactionModel');
const deviseModel = require('../models/deviseModel');
const ObjectID = require('mongoose').Types.ObjectId;
const { transactions } = require('../utils/errorsUtiles')

module.exports.getAllTransactions = async (req, res) => {
    const transactions = await transactionModel.find();
    res.status(200).json({ message: "La liste de transactions a été bien trouvée.", data: transactions });
};

module.exports.addTransaction = async (req, res) => {
    try {
        if (req.body.type === "epargne") {
            deviseModel.findOne({ compteId: req.body.compteId }, (err, resp) => {
                if (!err) {
                    return deviseModel.findById(
                        resp._id,
                        (err, response) => {
                            const dataCompte = {};
                            for (let i = 0; i < response.typeCompteEpargnes.length; i++) {
                                if (response.typeCompteEpargnes[i]._id.equals(req.body.deviseTypeId)) {
                                    dataCompte.compte = response.typeCompteEpargnes[i];
                                    response.typeCompteEpargnes[i].montant = response.typeCompteEpargnes[i].montant - req.body.montant
                                }
                            }

                            return response.save(err => {
                                if (!err) {
                                    res.status(200).json(response)
                                } else {
                                    return res.status(500).json("Données non enregistrées");
                                }
                            })
                        }
                    )
                }
            })
        } else if (req.body.type === "courant") {
            deviseModel.findOne({ compteId: req.body.compteId }, (err, resp) => {
                let valueMontant = 0;
                for (let i = 0; i < 1; i++) {
                    valueMontant = resp.montant
                }

                if (!err) {
                    deviseModel.findOneAndUpdate(
                        { _id: resp._id },
                        { montant: valueMontant - req.body.montant },
                        { new: true, upsert: true, setDefaultsOnInsert: true }
                    )
                        .then((docs) => {
                            res.status(200).json({
                                docs, message: 'Devise updated'
                            })
                        })
                        .catch((err) => { return res.status(500).send({ message: err }) })
                }
            })
        }
    } catch (error) {
        const erreurs = transactions(error)
        return res.stats(500).json(erreurs);
    }
}

/*

*/

module.exports.getOneTransaction = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        transactionModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                res.status(404).json('ID inconnu : ' + err);
            }
        });
    }
};

module.exports.updateTransaction = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await transactionModel.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json({
                        docs, message: 'Transaction updated'
                    })
                })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
};

module.exports.deleteTransaction = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let transactionDeleted = await transactionModel.deleteOne({ _id: req.params.id }).exec();
            if (transactionDeleted.deletedCount === 1) {
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            } else {
                res.status(404).json({ message: 'Transaction non trouvée.' });
            }
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}
