const express = require('express');
const cors = require('cors');
const app = express();
const fileUpload = require("express-fileupload");

const userRoutes = require('./routes/user.routes');
const deviseRoutes = require("./routes/devise.routes");
const comptesRoutes = require("./routes/comptes.routes");
const transactionsRoutes = require("./routes/transactions.routes");
const categoriesRoutes = require("./routes/categories.routes");
const infosUserRoutes = require('./routes/infosUser.routes');
const photoUserRoutes = require('./routes/photoUser.routes');

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
app.get('/api/jwtid', requireAuth, (req, res) => {
    res.status(200).send(res.locals.user._id);
});

app.use('/api/users', userRoutes);
app.use('/api/devises', deviseRoutes);
app.use("/api/comptes", comptesRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use('/api/categories', categoriesRoutes);
app.use("/api/user/infos", infosUserRoutes);
app.use("/api/user", photoUserRoutes);

app.listen(process.env.PORT, () => {
    console.log(`App écoute sur le port ${process.env.PORT}`)
});
