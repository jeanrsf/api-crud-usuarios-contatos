const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const jwtSecrets = 'Meu futuro';
const knex = require('../conexao');

const verificaLogin = async(req, res, next) => {
    const { authorization } = req.headers;

    if (!authorization) {
        return res.status(401).json({ mensagem: 'Usuario não esta autenticado' });
    }

    try {
        const token = authorization.replace('Bearer', '').trim();
        const { id } = jwt.verify(token, jwtSecrets);

        const verificaEmail = await knex('usuarios').where('id', id).first();

        if (!verificaEmail) {
            return res.status(404).json({ mensagem: 'Usuario nao encontrado' });
        }

        const { senha, ...usuario } = verificaEmail;

        req.usuario = usuario;

        next();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

module.exports = verificaLogin;