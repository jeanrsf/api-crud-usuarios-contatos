const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const { json } = require('express');
const jwtSecrets = 'Meu futuro'

const verificaLogin = async(req, res, next) => {

    const { authorization } = req.headers

    if (!authorization) {
        return res.status(401).json({ mensagem: "Usuario não esta autenticado" })
    }

    try {
        const token = authorization.replace('Bearer', '').trim();
        console.log(token);
        const { id } = jwt.verify(token, jwtSecrets);

        const query = 'SELECT * FROM usuarios WHERE id =$1'
        const { rows, rowCount } = await conexao.query(query, [id])

        if (rowCount === 0) {
            return res.status(404).json({ mensagem: 'Usuario nao encontrado' })
        }

        const { senha, ...usuario } = rows[0];

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

module.exports = verificaLogin