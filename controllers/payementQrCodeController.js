const compteModel = require('../models/compteModel');
const transactionModel = require('../models/transactionModel');

const createPayementByQrCode = async (req, res) => {
    console.log(req.body)
    try {
        const transaction = await transactionModel.create({
            userId: req.body.userId,
            compteId: req.body.compteId,
            motif: req.body.motif,
            montant: req.body.montant,
            status: true,
            devise: req.body.devise,
            nomClient: req.body.nomUserTransfere
        });

        if (transaction) {
            return compteModel.findOne(
                { _id: req.body.compteId },
                (err, docs) => {
                    const repComment = docs.devises.find((comment) =>
                        comment.devise === req.body.devise ? true : false
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
        }
    } catch (err) {
        return res.status(500).json({ err })
    }
};

module.exports = {
    createPayementByQrCode
}
