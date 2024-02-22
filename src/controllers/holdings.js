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

  if (typeof participation !== "number" || !participation) {
    return res.status(404).json('O campo participation é obrigatório e deve ser preeenchido com um número válido');
  }

  try {
    const participationLimit = 100;

    const { rows } = await conexao.query('select sum(participation) from holdings where company_id = $1', [company.id]);

    const total = parseFloat(rows[0].sum);

    if (total + participation > participationLimit) {
      if (total >= participationLimit) {
        return res.status(404).json('Limite de participation alcançado, não é possível adicionar novas participações');
      }
      const exceeded = (participation - total);
      return res.status(404).json(`Excede o limite da participation, o limite é até ${exceeded}%`);
    }

    const { rows: colaborador } = await conexao.query(`SELECT * FROM holdings WHERE first_name = $1 and last_name = $2;`, [first_name, last_name]);

    let text = "atualizada";

    if (colaborador.length === 0) {
      text = "adicionada";
      const query = 'insert into holdings (company_id, first_name, last_name, participation) values ($1, $2, $3, $4)';
      const addedParticipation = await conexao.query(query, [company.id, first_name, last_name, participation]);

      if (addedParticipation.rowCount == 0) {
        return res.status(404).json('A porcentagem da participation não foi adicionada!');
      }
    } else {
      const newParticipation = parseFloat(colaborador[0].participation) + participation;

      const queryAtualizacao = `update holdings set participation = $1 where id = $2`;

      const atualizado = await conexao.query(queryAtualizacao, [newParticipation, colaborador[0].id]);

      if (atualizado.rowCount == 0) {
        return res.status(404).json('A porcentagem da participation não foi atualizada!');
      }
    }

    const newLimit = ((participationLimit - total) - participation);

    return res.status(201).json(`A porcentagem da participation de ${first_name} ${last_name} foi ${text} com sucesso, restam ${newLimit}%!`);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

const obterParticipation = async (req, res) => {
  const { company } = req;

  try {

    const query = `select * from holdings where company_id = $1`;
    const { rows: holdings } = await conexao.query(query, [company.id]);

    return res.status(200).json(holdings);
  } catch (error) {
    return res.status(400).json(error.message);
  }
}

module.exports = {
  addParticipation,
  obterParticipation
}