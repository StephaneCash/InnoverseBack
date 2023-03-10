const compteModel = require('../models/compteModel');
const transactionModel = require('../models/transactionModel');
const userModel = require('../models/userModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await transactionModel.find();
        if (transactions) {
            res.status(200).json({ message: "La liste de transactions a été bien trouvée.", data: transactions, taille: transactions.length });
        } else {
            res.status(404).json({ message: "Aucune donnée trouvée.", data: transactions });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
};

module.exports.addTransaction = async (req, res) => {
    try {
        if (typeof (req.body.montant) === "object") {
            for (let i = 0; i < req.body.montant.length; i++) {

                await transactionModel.create({
                    userId: req.body.userId,
                    compteId: req.body.compteId,
                    motif: req.body.motif,
                    montant: req.body.montant[i],
                    status: true,
                    devise: req.body.deviseArr,
                    nomClient: req.body.nomUserTransfere[i]
                });
            }

            for (let i = 0; i < req.body.montant.length; i++) {
                return compteModel.findOne(
                    { _id: req.body.compteId },
                    (err, docs) => {
                        const repComment = docs.devises.find((comment) =>
                            comment._id.equals(req.body.idDevise)
                        );
                        if (repComment) {
                            repComment.montant = repComment.montant - req.body.montant[i];
                        } else {
                            return res.status(404).send('Compte non trouvé ' + req.body.compteId);
                        }

                        return docs.save((err) => {
                            if (!err) {
                                return compteModel.findOne(
                                    { _id: req.body.compteIdDest[i] },
                                    (err, docs) => {
                                        const repComment = docs.devises.find((devise) =>
                                            devise.devise === req.body.deviseArr ? true : false
                                        );

                                        if (repComment) {
                                            repComment.montant = repComment.montant + req.body.montant[i];
                                        } else {
                                            return res.status(404).send('Compte non trouvé ' + req.body.compteIdDest[i]);
                                        }

                                        return docs.save((err) => {
                                            if (!err) return res.status(200).send(docs);
                                            return res.status(500).send(err);
                                        })
                                    }
                                ).clone().catch(function (err) { console.log(err) })
                            }
                            return res.status(500).send(err);
                        })
                    }
                ).clone().catch(function (err) { console.log(err) })
            }

        } else {
            const transaction = await transactionModel.create({
                userId: req.body.userId,
                compteId: req.body.compteId,
                motif: req.body.motif,
                montant: req.body.montant,
                status: true,
                devise: req.body.deviseArr,
                nomClient: req.body.nomUserTransfere
            });

            if (transaction) {
                return compteModel.findOne(
                    { _id: req.body.compteId },
                    (err, docs) => {
                        const repComment = docs.devises.find((comment) =>
                            comment._id.equals(req.body.idDevise)
                        );
                        if (repComment) {
                            repComment.montant = repComment.montant - req.body.montant;
                        } else {
                            return res.status(404).send('Compte non trouvé ' + req.body.compteId);
                        }

                        return docs.save((err) => {
                            if (!err) {
                                return compteModel.findOne(
                                    { _id: req.body.compteIdDest },
                                    (err, docs) => {
                                        const repComment = docs.devises.find((devise) =>
                                            devise.devise === req.body.deviseArr ? true : false
                                        );

                                        if (repComment) {
                                            repComment.montant = repComment.montant + req.body.montant;
                                        } else {
                                            return res.status(404).send('Compte non trouvé ' + req.body.compteIdDest);
                                        }

                                        return docs.save((err) => {
                                            if (!err) return res.status(200).send(docs);
                                            return res.status(500).send(err);
                                        })
                                    }
                                ).clone().catch(function (err) { console.log(err) })
                            }

                            return res.status(500).send(err);
                        })
                    }
                ).clone().catch(function (err) { console.log(err) });
            }
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

module.exports.getOneTransaction = async (req, res) => {
    try {
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(400).send('ID inconnu : ' + req.params.id)
        } else {
            await transactionModel.findById(req.params.id, (err, docs) => {
                if (!err) {
                    res.send(docs);
                } else {
                    res.status(404).json('ID inconnu : ' + err);
                }
            });
        }
    } catch (error) {
        return res.status(500).json({ error })
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

module.exports.getAllTransactionsByUserId = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let transactions = await transactionModel.find({ userId: req.params.id });
            if (transactions) {
                res.status(200).json({
                    message: 'Transactions trouvées avec succès',
                    data: transactions, taille: transactions.length
                });
            } else {
                res.status(404).json({ message: 'Transactions non trouvées.' });
            }
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}