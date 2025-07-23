require('dotenv').config({ path: "../.env" })
const express = require('express');
const cors = require('cors')
const mysql = require('mysql2/promise');
const cookieParser = require('cookie-parser')
const app = express();

const port = 8080;

const bodyParser = require('body-parser');

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use(bodyParser.json());
app.use(cookieParser())

const signUpRoute = require('./routes/SignUp');
const loginRoute = require('./routes/LogIn')
const userRoute = require('./routes/user')

app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});

app.use('/sign-up', signUpRoute);
app.use('/login', loginRoute);
app.use('/user', userRoute)

app.listen(port, () => {
    console.log(`API server listening at http://localhost:${port}`);
});
