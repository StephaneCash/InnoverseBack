const compteModel = require('../models/compteModel');
const userModel = require('../models/userModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllComptes = async (req, res) => {
    const comptes = await compteModel.find();
    res.status(200).json(comptes);
};


module.exports.addCompe = async (req, res) => {
    const comptes = await compteModel.create(req.body);
    res.status(201).json(comptes);
};

module.exports.configCompte = async (req, res) => {
    if (!ObjectID.isValid(req.body.compteId)) {
        return res.status(400).send('ID inconnu : ' + req.body.compteId)
    } else {
        try {
            let compteConfig = "";
            console.log(req.body)
            for (let i = 0; i < req.body.devise.length; i++) {
                compteConfig = await compteModel.findByIdAndUpdate(
                    req.body.compteId,
                    {
                        type: req.body.type,
                        isValid: true,
                        $push: {
                            devises: {
                                compteId: req.body.compteId,
                                nom: req.body.nom,
                                montant: 0,
                                devise: req.body.devise[i]
                            }
                        },
                    },
                    { new: true }
                );
            }

            if (compteConfig) {
                res.status(200).json({ message: "Compte configuré avec succès", data: compteConfig })
            } else {
                return res.status(400).json({ message: "Le compte n'a pas été configuré" })
            }

        } catch (error) {
            return res.status(500).json({ error });
        }
    }
}

module.exports.getOneCompte = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        compteModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                res.status(404).json('ID inconnu : ' + err);
            }
        });
    }
};

module.exports.getOneCompteByUserId = async (req, res) => {
    if (!ObjectID.isValid(req.body.userId)) {
        return res.status(400).json({ message: `Id inconnu ${req.body.userId}` })
    } else {
        try {
            const data = await compteModel.findOne({ userId: new RegExp('^' + req.body.userId + '$', "i") });
            if (data) {
                res.status(200).json({ message: "Compte user bien trouvé", data: data });
            } else {
                return res.status(400).json({ message: 'Compte non trouvé, vérifier bien vos données' })
            }
        } catch (error) {
            return res.status(500).json({ message: error })
        }
    }
};

module.exports.updateCompte = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await compteModel.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json({
                        docs, message: 'Compte updated'
                    })
                })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
};

module.exports.deleteCompte = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let compteDeleted = await compteModel.deleteOne({ _id: req.params.id }).exec();
            if (compteDeleted.deletedCount === 1) {
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            } else {
                res.status(404).json({ message: 'Compte non trouvé.' });
            }
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}

module.exports.getCompteByNumber = async (req, res) => {
    try {
        let compteFind = await compteModel.findOne({ numero: req.params.id }).exec();
        if (compteFind) {
            const user = await userModel.findOne({ _id: compteFind.userId });
            res.status(200).json({ message: 'Compte trouvé avec succès', compte: compteFind, user: user });
        } else {
            res.status(404).json({ message: 'Compte non trouvé.' });
        }
    } catch (err) {
        return res.status(500).json({ message: err })
    }
}

