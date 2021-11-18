const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const schemaAtualizarUsuario = require('../validacoes/usuarios/schemaAtualizarUsuario');
const schemaCadastroUsuario = require('../validacoes/usuarios/schemaCadastroUsuario');
const schemaLogin = require('../validacoes/login/schemaLogin');
const knex = require('../conexao');

const cadastroUsuario = async(req, res) => {
    const { nome, email, senha, nome_loja } = req.body;

    try {
        await schemaCadastroUsuario.validate(req.body);

        const verificaEmail = await knex('usuarios').where('email', email).first();

        if (verificaEmail) {
            return res.status(400).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const cadastro = await knex('usuarios').insert({
            nome,
            email,
            senha: senhaCriptografada,
            nome_loja,
        });

        return res.sendStatus(201);
    } catch (error) {
        return res.status(400).json(error.mensage);
    }
};

const login = async(req, res) => {
    const { email, senha } = req.body;

    try {
        await schemaLogin.validate(req.body);

        const verificaUsuario = await knex('usuarios').where('email', email).first();
        if (!verificaUsuario) {
            return res.status(400).json({ mensagem: 'Usuario não encontrado' });
        }
        const senhaVerificada = await bcrypt.compare(senha, verificaUsuario.senha);

        if (!senhaVerificada) {
            return res.status(400).json({ mensagem: 'email e senha não confere' });
        }
        const token = jwt.sign({ id: verificaUsuario.id }, process.env.JWT_SECRET, { expiresIn: '5d' });

        const { senha: senhaUsuario, ...dadosUsuario } = verificaUsuario;

        return res.status(200).json({
            usuario: dadosUsuario,
            token,
        });
    } catch (error) {
        return res.status(400).json(error.message);
    }
};

const dadosUsuario = async(req, res) => {
    const { usuario } = req;

    try {
        const verificaUsuario = await knex('usuarios').where('id', usuario.id).first();

        if (!verificaUsuario) {
            return res.status(404).json({ mensagem: 'Não foi possivel encontrar esse usuario' });
        }
        const { senha, ...dadosUsuario } = verificaUsuario;

        res.status(200).json(dadosUsuario);
    } catch (error) {
        res.status(401).json(error.message);
    }
};

const atualizarUsuario = async(req, res) => {
    const { nome, email, senha, nome_loja } = req.body;
    const { usuario } = req;

    try {
        await schemaAtualizarUsuario.validate(req.body);

        const verificaEmail = await knex('usuarios').where('email', email).andWhere('id', '<>', usuario.id).first();

        if (verificaEmail) {
            return res.status(401).json({ mensagem: 'Já existe usuário cadastrado com o e-mail informado.' });
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const atualizar = await knex('usuarios')
            .update({
                nome,
                email,
                senha: senhaCriptografada,
                nome_loja,
            })
            .where('id', usuario.id);

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json(error.message);
    }
};
module.exports = {
    cadastroUsuario,
    login,
    dadosUsuario,
    atualizarUsuario,
};