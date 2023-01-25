const categorieModel = require('../models/categorieModel');
const ObjectID = require('mongoose').Types.ObjectId;

module.exports.getAllCategories = async (req, res) => {
    const devises = await categorieModel.find();
    res.status(200).json(devises);
};

module.exports.addCategorie = async (req, res) => {
    try {
        let categorie = await categorieModel.create(req.body);
        if (categorie) {
            res.status(201).json({ message: "Catégorie créée avec succès", data: categorie });
        }
    } catch (error) {
        return res.status(500).json({ error });
    }
}

module.exports.getOneCategorie = (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        categorieModel.findById(req.params.id, (err, docs) => {
            if (!err) {
                res.send(docs);
            } else {
                console.log('ID inconnu : ' + err);
            }
        });
    }
};

module.exports.updateCategorie = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            await categorieModel.findOneAndUpdate(
                { _id: req.params.id },
                req.body,
                { new: true, upsert: true, setDefaultsOnInsert: true }
            )
                .then((docs) => {
                    res.status(200).json({
                        docs, message: 'Catégorie updated'
                    })
                })
                .catch((err) => { return res.status(500).send({ message: err }) })
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
};

module.exports.deleteCategorie = async (req, res) => {
    if (!ObjectID.isValid(req.params.id)) {
        return res.status(400).send('ID inconnu : ' + req.params.id)
    } else {
        try {
            let categorieDeleted = await categorieModel.deleteOne({ _id: req.params.id }).exec();
            if (categorieDeleted.deletedCount === 1) {
                res.status(200).json({ message: 'Suppression effectuée avec succès' });
            } else {
                res.status(404).json({ message: 'Catégorie non trouvée.' });
            }
        } catch (err) {
            return res.status(500).json({ message: err })
        }
    }
}
