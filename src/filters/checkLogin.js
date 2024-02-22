const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const checkLogin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json("Não autorizado!");
  }

  try {
    const token = authorization.replace('Bearer ', '').trim();

    const { id } = jwt.verify(token, process.env.SENHA_HASH);

    const query = 'select * from companies where id = $1';

    const { rows, rowCount } = await conexao.query(query, [id])

    if (rowCount == 0) {
      return res.status(404).json("Empresa não encontrada!");
    }

    const { password, ...company } = rows[0];

    req.company = company;

    next();
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = checkLogin;