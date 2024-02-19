const express = require('express');
const companies = require('./controllers/companies');
const login = require('./controllers/login')

const rotas = express();

rotas.post('/companies', companies.registerCompany);

rotas.post('/login', login.login);


module.exports = rotas;