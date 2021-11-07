const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const jwtSecrets = 'Meu futuro'
const bcrypt = require('bcryptjs')

const cadastroUsuario = async(req, res) => {
    const { nome, email, senha, nome_loja } = req.body

    try {
        if (!nome || !email || !senha || !nome_loja) {
            return res.status(400).json({ mensagem: 'É necessario preencher todos os campos' })
        }
        const queryVerificaEmail = 'SELECT * FROM usuarios WHERE email = $1'
        const verificaEmail = await conexao.query(queryVerificaEmail, [email])

        if (verificaEmail.rowCount > 0) {
            return res.status(400).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." })
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const query = 'INSERT INTO usuarios(nome, email, senha,nome_loja)VALUES($1, $2, $3,$4)'

        await conexao.query(query, [nome, email, senhaCriptografada, nome_loja])
        return res.sendStatus(204)

    } catch (error) {
        return res.status(400).json(error.mensage)
    }

}

const login = async(req, res) => {
    const { email, senha } = req.body

    try {
        if (!email || !senha) {
            return res.status(400).json({ mensagem: 'Necessario preencher os campos de email e senha' })
        }
        const queryVerificaEmail = 'SELECT * FROM usuarios WHERE email = $1'
        const verificaEmail = await conexao.query(queryVerificaEmail, [email])

        if (verificaEmail.rowCount === 0) {
            return res.status(400).json({ mensagem: "Usuario não encontrado" })
        }

        const usuario = verificaEmail.rows[0]
        const senhaCriptografada = await bcrypt.hash(senha, 10)
        const senhaVerificada = await bcrypt.compare(senha, usuario.senha)


        if (!senhaVerificada) {
            return res.status(400).json({ mensagem: "email e senha não confere" })
        }

        const token = jwt.sign({ id: usuario.id }, jwtSecrets, { expiresIn: '5d' })

        const { senha: senhaUsuario, ...dadosUsuario } = usuario


        return res.status(200).json({
            usuario: dadosUsuario,
            token
        })

    } catch (error) {
        return res.status(400).json(error.message)
    }
}

const dadosUsuario = async(req, res) => {
    const { token } = req.headers
    const { authorization } = req.headers


    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, jwtSecrets);

        const queryDados = 'SELECT * FROM usuarios WHERE id =$1'
        const dados = await conexao.query(queryDados, [id])


        if (dados.rowCount === 0) {
            return res.status(404).json({ mensagem: 'Não foi possivel encontrar esse usuario' })
        }
        const { senha, ...usuario } = dados.rows[0]

        res.status(200).json(usuario)

    } catch (error) {
        res.status(401).json(error.message)
    }
}

const atualizarUsuario = async(req, res) => {
    const { nome, email, senha, nome_loja } = req.body
    const { authorization } = req.headers


    try {
        const token = authorization.replace('Bearer', '').trim();

        const { id } = jwt.verify(token, jwtSecrets);

        if (!nome || !email || !senha || !nome_loja) {
            return res.status(400).json({ mensagem: 'É necessario preencher todos os campos' })
        }
        const queryVerificaEmail = 'SELECT * FROM usuarios WHERE email = $1 AND id != $2'
        const verificaEmail = await conexao.query(queryVerificaEmail, [email, id])

        if (verificaEmail.rowCount > 0) {
            return res.status(401).json({ mensagem: "Já existe usuário cadastrado com o e-mail informado." })
        }
        const senhaCriptografada = await bcrypt.hash(senha, 10)

        const queryAtualiza = `UPDATE usuarios SET nome=$1, email=$2, senha=$3, nome_loja=$4 WHERE id=$5`
        const atualiza = await conexao.query(queryAtualiza, [nome, email, senhaCriptografada, nome_loja, id])

        return res.status(200).json();

    } catch (error) {
        return res.status(400).json(error.message)
    }

}
module.exports = {
    cadastroUsuario,
    login,
    dadosUsuario,
    atualizarUsuario
}