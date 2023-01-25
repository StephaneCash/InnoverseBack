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
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send('ID inconnu : ' + req.params.id)
        } else {
            try {
                deviseModel.findById(req.params.id, (err, docs) => {
                    if (!err) {
                        if (docs.montant && docs.montant > req.body.montant) {
                            transactionModel.create({
                                userId: req.body.userId,
                                compteId: req.body.compteId,
                                motif: req.body.motif,
                                deviseId: req.body.deviseId,
                                montant: req.body.montant,
                                nomsUserTransfere: req.body.nomsUserTransfere
                            });
                            deviseModel.findOneAndUpdate(
                                { _id: docs._id },
                                { montant: docs.montant - req.body.montant },
                                { new: true, upsert: true, setDefaultsOnInsert: true }
                            )
                                .then((resp) => {
                                    res.status(201).json({ message: "Transaction effectuée avec succès" });
                                })
                                .catch((err) => { return res.status(500).send({ message: err }) })
                        } else {
                            return res.status(400).json({ message: "Votre solde est insufisant" });
                        }
                    } else {
                        console.log('ID inconnu : ' + err);
                    }
                });
            } catch (err) {
                return res.stats(500).json(err);
            }
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
