const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const { signUpErrors, signInErrors } = require('../utils/errorsUtiles')
const compteModel = require('../models/compteUser');

const maxAge = 3 * 24 * 60 * 60 * 1000;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.TOKEN_SECRET, { expiresIn: maxAge })
};

const signUp = async (req, res) => {

    let chars = "0123456789";
    let codeLength = 25;
    let codeSplit = "";

    for (let i = 0; i <= codeLength; i++) {
        let randomNumber = Math.floor(Math.random() * chars.length);
        codeSplit += chars.substring(randomNumber, randomNumber + 1);
    }

    let tab = codeSplit.split('');

    tab[22] = '-';

    let codeGenere = tab.join().replace(/[,]/g, '');

    const { pseudo, email, password } = req.body;

    try {
        const user = await userModel.create({ pseudo, email, password });
        compte = await compteModel.create({
            userId: user.id,
            numero: codeGenere,
        });
        res.status(201).json({ user: user.id ? message : '"User créé avec succès' });
    }
    catch (err) {
        const errors = signUpErrors(err)
        res.status(201).send({ errors });
    }

}

const signIn = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await userModel.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: false, maxAge });
        res.status(200).json({ "message ": 'Utilisateur connecté avec succès', user: user._id, token })
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