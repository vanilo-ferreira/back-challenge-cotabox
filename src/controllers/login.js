const conexao = require('../conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(404).json("O campo email é obrigatório");
  }

  if (!password) {
    return res.status(404).json("O campo password é obrigatório");
  }

  try {
    const { rowCount, rows } = await conexao.query('select * from companies where email = $1', [email]);

    if (rowCount == 0) {
      return res.status(400).json("O email não foi encontrado!");
    }

    const company = rows[0];

    const correctPassword = await bcrypt.compare(password, company.password);

    if (!correctPassword) {
      return res.status(405).json("Email e password não confere!");
    }

    const token = jwt.sign({ id: company.id },
      process.env.SENHA_HASH,
      { expiresIn: '8h' });

    const { password: _, ...dataCompany } = company;

    return res.status(200).json({
      usuario: dataCompany,
      token
    });

  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  login
}