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
    try {
        if (ObjectID.isValid(req.body.idUser)) {

            let password = req.body.password;

            if (password.length < 6) {
                return res.status(400).json({ message: "Votre mot de passe doit avoir au minimum 6 caractères" });
            } else {
                if ((/[0-9]/g).test(password) && (/[a-z]/g).test(password) && (/[.;,@~#*éçà]/g).test(password)) {
                    const salt = await bcrypt.genSalt();
                    const passHash = await bcrypt.hash(password, salt);

                    let Pass = await PassModel.create({
                        idUser: req.body.idUser,
                        password: passHash
                    });
                    if (Pass) {
                        res.status(201).json({ message: "Password user créé avec succès", data: Pass });
                    }
                } else {
                    return res.status(400).json({
                        message: "Votre mot de passe doit avoir au minimum une lettre majuscule, minuscule, un chiffre et un caractère spécial"
                    });
                }
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
        PassModel.findById(req.params.id, (err, docs) => {
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

}
