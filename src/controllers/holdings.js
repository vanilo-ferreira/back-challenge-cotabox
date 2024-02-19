const conexao = require('../conexao');

const addParticipation = async (req, res) => {
  const { company } = req;
  const { first_name, last_name, participation } = req.body;

  if (!first_name) {
    return res.status(404).json('O campo first_name é obrigatório');
  }

  if (!last_name) {
    return res.status(404).json('O campo last_name é obrigatório');
  }

  if (!participation) {
    return res.status(404).json('O campo participation é obrigatório');
  }

  try {
    const query = 'insert into holdings (company_id, first_name, last_name, participation) values ($1, $2, $3, $4)';
    const addedParticipation = await conexao.query(query, [company.id, first_name, last_name, participation]);

    if (addedParticipation.rowCount == 0) {
      return res.status(404).json('A participation não foi cadastrada!');
    }

    return res.status(201).json('A participation foi adicionada com sucesso!');
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  addParticipation
}