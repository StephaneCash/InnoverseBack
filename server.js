const express = require('express');
const cors = require('cors');
const app = express();
const fileUpload = require("express-fileupload");

const userRoutes = require('./routes/user.routes');
const comptesRoutes = require("./routes/comptes.routes");
const transactionsRoutes = require("./routes/transactions.routes");
const infosUserRoutes = require('./routes/infosUser.routes');
const photoUserRoutes = require('./routes/photoUser.routes');
const modePaiementRoutes = require('./routes/modePaiement.routes');
const pretRoutes = require('./routes/prets.routes');
const cartesRoutes = require('./routes/cartesVirtuelles.routes');
const tauxRoutes = require('./routes/tauxConvert.routes');
const passwordUserTransaction = require('./routes/passwordTransaction.routes');
const payementQrCodeRoutes = require('./routes/payementQrCode.routes');

require('dotenv').config({ path: './config/.env' })
require('./config/db')
const bodyParser = require('body-parser')
const coockieParser = require('cookie-parser');
const { checkUser, requireAuth } = require('./middleware/authMiddleware');

const corsOptions = {
    origin: process.env.CLIENT_URL,
    credentials: true,
    'allowedHeaders': ['sessionId', 'Content-Type'],
    'exposedHeaders': ['sessionId'],
    'methods': 'GET, HEAD, PUT, PATCH, POST, DELETE',
    'preflightContinue': false
};

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(coockieParser());
app.use(
    fileUpload({
        createParentPath: true
    })
);

// jwt authentication
app.get('*', checkUser);
app.get('/api/jwtid/:token', requireAuth);

app.use('/api/users', userRoutes);
app.use("/api/comptes", comptesRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/user/infos", infosUserRoutes);
app.use("/api/user", photoUserRoutes);
app.use("/api/compte/modes-paiement", modePaiementRoutes);
app.use('/api/prets', pretRoutes);
app.use("/api/cartes-virtuelles", cartesRoutes);
app.use("/api/taux", tauxRoutes);
app.use('/api/passwords_user_transactions', passwordUserTransaction);
app.use('/api/payementbyqrcode', payementQrCodeRoutes);

app.listen(process.env.PORT, () => {
    console.log(`App écoute sur le port ${process.env.PORT}`)
});
