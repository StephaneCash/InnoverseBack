const compteModel = require('../models/compteModel');
const transactionModel = require('../models/transactionModel');

const createPayementByQrCode = async (req, res) => {
    try {
        return compteModel.findOne(
            { _id: req.body.compteId },
            async (err, docs) => {
                const response = docs.devises.find((devise) =>
                    devise.devise === req.body.devise ? true : false
                );
                if (response) {
                    if (response.montant > req.body.montant) {
                        response.montant = response.montant - req.body.montant;
                        await transactionModel.create({
                            userId: req.body.userId,
                            compteId: req.body.compteId,
                            motif: req.body.motif,
                            montant: req.body.montant,
                            status: true,
                            devise: req.body.devise,
                            nomClient: req.body.nomUserTransfere
                        });
                    } else {
                        return res.status(400).json({ message: "Votre solde est insuffisant" });
                    }
                } else {
                    return res.status(404).json({ message: 'Compte non trouvé ' + req.body.compteId });
                }

                return docs.save((err) => {
                    if (!err) {
                        return compteModel.findOne(
                            { _id: req.body.compteIdDest },
                            (err, docs) => {
                                const repComment = docs.devises.find((devise) =>
                                    devise.devise === req.body.devise ? true : false
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
    } catch (err) {
        return res.status(500).json({ err })
    }
};

module.exports = {
    createPayementByQrCode
}
