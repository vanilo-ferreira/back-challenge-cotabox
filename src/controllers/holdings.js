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
    const participationLimit = 100;

    const { rows } = await conexao.query('select sum(participation) from holdings where company_id = $1', [company.id]);

    const total = rows[0].sum;

    if (total + participation >= participationLimit) {
      if (total >= participationLimit) {
        return res.status(404).json('Limite de participation alcançado, não é possível adicionar novas participações');
      }
      const exceeded = (participation - total);
      return res.status(404).json(`Excede o limite da participation, o limite é até ${exceeded}%`);
    }

    const query = 'insert into holdings (company_id, first_name, last_name, participation) values ($1, $2, $3, $4)';
    const addedParticipation = await conexao.query(query, [company.id, first_name, last_name, participation]);

    if (addedParticipation.rowCount == 0) {
      return res.status(404).json('A porcentagem da participation não foi adicionada!');
    }

    const newLimit = ((participationLimit - total) - participation);

    return res.status(201).json(`A porcentagem da participation foi adicionada com sucesso, restam ${newLimit}%!`);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  addParticipation
}