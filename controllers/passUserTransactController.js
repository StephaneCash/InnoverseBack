const PassModel = require('../models/passUserTransacModel');
const ObjectID = require('mongoose').Types.ObjectId;
const bcrypt = require('bcrypt');

module.exports.getAllPassUsers = async (req, res) => {
    try {
        const passUsers = await PassModel.find();
        res.status(200).json({ data: passUsers, taille: passUsers.length });
    } catch (error) {
        return res.status(500).json({ error });
    }
};

module.exports.addPass = async (req, res) => {
    const { ancienPin, password, idUser } = req.body;

    const salt = await bcrypt.genSalt();
    const passHash = await bcrypt.hash(password, salt);

    try {
        if (ObjectID.isValid(idUser)) {
            if (password) {
                let passUserExist = await PassModel.findOne({ idUser: idUser });
                if (passUserExist) {
                    if (ancienPin) {
                        bcrypt.compare(ancienPin, passUserExist.password)
                            .then(isValid => {
                                if (!isValid) {
                                    res.status(400).json({ message: "L'ancien mot de passe est incorrect" });
                                } else {
                                    PassModel.findOneAndUpdate(
                                        { _id: passUserExist._id },
                                        { password: passHash, isChange: true },
                                        { new: true, upsert: true, setDefaultsOnInsert: true }
                                    )
                                        .then((docs) => {
                                            res.status(200).json({
                                                docs, message: 'Votre PIN a été modifié avec succès'
                                            })
                                        })
                                        .catch((err) => { return res.status(500).send({ message: err }) })
                                }
                            })
                            .catch(err => {
                                return res.status(500).json({ err })
                            })
                    } else {
                        return res.status(400).json({ message: "Veuillez fournir votre ancien PIN" })
                    }
                }
            } else {
                return res.status(400).json({ message: "Veuillez fournir un mot de passe svp." })
            }
        } else {
            return res.status(400).json({ message: "L'identifiant de l'utilisateur n'est pas valide", data: req.body.idUser });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

module.exports.getOnePass = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        PassModel.findOne({ idUser: req.params.id }, (err, docs) => {
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

module.exports.decodePassword = async (req, res) => {
    try {
        if (!ObjectID.isValid(req.body.idUser)) {
            return res.status(400).json({ message: 'ID inconnu : ', data: req.body.idUser })
        } else {
            PassModel.findById(req.body.idUser, (err, docs) => {
                if (req.body.password) {
                    if (!err) {
                        bcrypt.compare(req.body.password, docs.password)
                            .then(isValid => {
                                if (!isValid) {
                                    res.status(401).json({ message: "Le mot de passe est incorrect" });
                                } else {
                                    res.status(200).json({ "message ": 'Mot de passe correct' })
                                }
                            })
                            .catch(err => {
                                return res.status(500).json({ err })
                            })
                    } else {
                        return res.status(404).json({ message: "User non trouvé", data: req.body.idUser });
                    }
                } else {
                    return res.status(400).json({ message: "Entrer votre mot de passe svp.", });
                }
            });
        }

    } catch (error) {
        return res.status(500).json({ error })
    }
}
