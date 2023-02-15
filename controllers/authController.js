const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errorsUtiles')
const compteModel = require('../models/compteModel');
const bcrypt = require('bcrypt');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge })
};

const signUp = async (req, res) => {

    let chars = "0123456789";
    let codeLength = 11;
    let codeSplit = "";

    for (let i = 0; i <= codeLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        codeSplit += chars.substring(randomNumber, randomNumber + 1);
    }

    let tab = codeSplit.split('');

    tab[8] = '-';

    let codeGenere = tab.join().replace(/[,]/g, '');

    const { pseudo, email, password } = req.body;

    try {
        userModel.findOne({ email: email })
            .then(async resp => {
                if (resp) {
                    res.status(400).json({ message: 'Cette adresse eamil est déjà prise' });
                } else {
                    if (password.length < 8 && password !== "") {
                        return res.status(400).json({ message: "Votre mot de passe doit avoir au minimum 8 caractères" });
                    } else {
                        const salt = await bcrypt.genSalt();
                        const passHash = await bcrypt.hash(password, salt);
                        const user = await userModel.create({ pseudo, email, password: passHash });

                        compteModel.create({
                            userId: user._id,
                            numero: "A" + codeGenere,
                            isValid: false,
                            devises: []
                        })
                            .then(() => {
                                res.status(201).json({ message: 'Utilisateur créé avec succès' });
                            })
                            .catch(error => {
                                return res.status(500).json(error)
                            })
                    }
                }
            }).catch(err => {
                console.log(err)
            })
    }
    catch (err) {
        res.status(500).send({ err });
    }

}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        userModel.findOne({ email: email })
            .then(async resp => {
                if (resp) {
                    bcrypt.compare(password, resp.password)
                        .then(isValid => {
                            if (!isValid) {
                                res.status(401).json({ message: "Le mot de passe est incorrect" });
                            } else {
                                const token = createToken(resp._id);
                                if (token) {
                                    res.cookie('jwt', token, { httpOnly: false, maxAge });
                                    res.status(200).json({ "message ": 'Utilisateur connecté avec succès', user: resp._id, token })
                                }
                            }
                        })
                        .catch(err => {
                            return res.status(500).json({ err })
                        })
                } else {
                    return res.status(400).json({ message: "L'utilisateur n'existe pas", })
                }
            })
            .catch(err => {
                return res.status(500).json({ err })
            })
    } catch (err) {
        const errors = signInErrors(err)
        return res.status(500).json({ errors });
    }
}

const deconnexion = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    return res.json({ Logout: true })
}

module.exports = {
    signUp,
    signIn,
    deconnexion
}    