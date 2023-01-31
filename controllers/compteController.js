const compteModel = require('../models/compteUser');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllComptes = async (req, res) => {
    const comptes = await compteModel.find();
    res.status(200).json(comptes);
};

module.exports.addCompte = async (req, res) => {
    try {
        let chars = "0123456789";
        let codeLength = 20;
        let codeSplit = "";

        for (let i = 0; i <= codeLength; i++) {
            let randomNumber = Math.floor(Math.random() * chars.length);
            codeSplit += chars.substring(randomNumber, randomNumber + 1);
        }

        let tab = codeSplit.split('');

        tab[17] = '-';

        let codeGenere = tab.join().replace(/[,]/g, '');
        let compte = await compteModel.create({
            userId: req.body.userId,
            numero: codeGenere,
            type: req.body.type,
            deviseId: req.body.deviseId
        });
        if (compte) {
            res.status(201).json({ message: "Compte créé avec succès", data: compte });
        }
    } catch (error) {
        return res.status(500).json({ error });
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

module.exports.getOneCompteByUserId = (req, res) => {
    if (!ObjectID.isValid(req.body.userId)) {
        return res.status(400).json({ message: `Id inconnu ${req.body.userId}` })
    } else {
        compteModel.findOne({ userId: new RegExp('^' + req.body.userId + '$', "i") }, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                res.status(404).json('ID inconnu : ' + err);
            }
        });
    }
};

module.exports.getOneCompteByNumCompte = (req, res) => {
    try {
        compteModel.findOne({ numero: new RegExp('^' + req.body.numCompte + '$', "i") }, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                res.status(404).json('ID inconnu : ' + err);
            }
        });
    } catch (error) {
        return res.status(500).json({ message: error })
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
