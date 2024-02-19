const express = require('express');
const companies = require('./controllers/companies')

const rotas = express();

rotas.post('/companies', companies.registerCompany);


module.exports = rotas;