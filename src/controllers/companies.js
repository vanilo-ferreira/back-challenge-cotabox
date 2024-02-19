const conexao = require('../conexao');
const bcrypt = require('bcrypt');

const registerCompany = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name) {
    return res.status(404).json("O campo name é obrigatório");
  }

  if (!email) {
    return res.status(404).json("O campo email é obrigatório");
  }

  if (!password) {
    return res.status(404).json("O campo password é obrigatório");
  }

  try {

    const { rowCount: quantidadeEmpresas } = await conexao.query('select * from companies where email = $1', [email]);

    if (quantidadeEmpresas > 0) {
      return res.status(400).json("O email já existe!");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const query = 'insert into companies(name, email, password) values($1, $2, $3)';
    const empresa = await conexao.query(query, [name, email, encryptedPassword]);

    if (empresa.rowCount === 0) {
      return res.status(400).json("A empresa não foi cadastrada.");
    }

    return res.status(201).json("A empresa foi cadastrada com sucesso!");

  } catch (error) {
    return res.status(400).json(error.message);
  }

}

module.exports = {
  registerCompany
}