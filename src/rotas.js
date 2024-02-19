const express = require('express');
const companies = require('./controllers/companies');
const login = require('./controllers/login');
const checkLogin = require('./filters/checkLogin');
const holdings = require('./controllers/holdings');

const rotas = express();

rotas.post('/companies', companies.registerCompany);

rotas.post('/login', login.login);

rotas.use(checkLogin);

rotas.post('/holdings', holdings.addParticipation);


module.exports = rotas;