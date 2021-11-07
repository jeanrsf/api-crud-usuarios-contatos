const conexao = require('../conexao');
const jwt = require('jsonwebtoken');
const jwtSecrets = 'Meu futuro'


const listarProdutos = async(req, res) => {

    const { usuario } = req
    try {

        const query = 'SELECT * FROM produtos WHERE usuario_id = $1'
        const listarProdutos = await conexao.query(query, [usuario.id])

        return res.status(200).json(listarProdutos.rows)
    } catch (error) {
        return res.status(400).json({ mensagem: "Para acessar este recurso um token de autenticação válido deve ser enviado." })
    }


}
const obterProduto = async(req, res) => {
    const { usuario } = req
    const { id } = req.params


    try {
        const queryProdutos = 'SELECT * FROM produtos WHERE id =$1'
        const produtos = await conexao.query(queryProdutos, [id])

        if (produtos.rowCount === 0) {
            return res.status(404).json({ mensagem: `Não existe produto cadastrado com ID ${id}.` })
        }
        const produtoEncontrado = produtos.rows[0]

        if (produtoEncontrado.usuario_id !== usuario.id) {
            return res.status(401).json({ mensagem: "O usuário logado não tem permissão para acessar este produto." })
        }

        return res.status(200).json(produtoEncontrado)

    } catch (error) {
        return res.status(400).json({ mensagem: "Ocorreu um erro ao recuperar o produto", error: error.message })
    }
}

const cadastrarProduto = async(req, res) => {
    const { nome, quantidade, categoria, preco, descricao, imagem } = req.body
    const { usuario } = req

    try {

        if (!nome || (quantidade === null || quantidade === undefined) || !categoria || (preco === null || preco === undefined) || !descricao) {
            return res.status(400).json({ mensagem: "É necessario preencher todos os campos" })
        }

        if (quantidade <= 0) {
            return res.status(400).json({ mensagem: "A quantidade de produtos tem que ser maior que zero" })
        }


        const queryCadastro = `INSERT INTO produtos(nome,usuario_id, quantidade,categoria,preco,descricao,imagem)
    VALUES($1, $2, $3,$4,$5,$6,$7)`
        await conexao.query(queryCadastro, [nome, usuario.id, quantidade, categoria, preco, descricao, imagem])

        return res.status(201).json()

    } catch (error) {
        return res.status(400).json({ mensagem: "Ocorreu um erro ao cadastrar o produto", error: error.message })

    }

}
const atualizarProduto = async(req, res) => {
    const { nome = null, quantidade = null, categoria = null, preco = null, descricao = null, imagem = null } = req.body
    const { usuario } = req
    const { id } = req.params

    try {
        const queryProdutos = 'SELECT * FROM produtos WHERE id =$1'
        const produtos = await conexao.query(queryProdutos, [id])

        if (produtos.rowCount === 0) {
            return res.status(404).json({ mensagem: `Não existe produto cadastrado com ID ${id}.` })
        }
        const produtoEncontrado = produtos.rows[0]

        if (produtoEncontrado.usuario_id !== usuario.id) {
            return res.status(401).json({ mensagem: "O usuário logado não tem permissão para acessar este produto." })
        }

        if (!nome || !quantidade || !categoria || !preco || !descricao || !imagem) {
            return res.status(400).json({ mensagem: "É necessario preencher todos os campos" })
        }

        if (quantidade <= 0) {
            return res.status(400).json({ mensagem: "A quantidade de produtos tem que ser maior que zero" })
        }


        const queryAtualiza = `UPDATE produtos SET nome=$1, quantidade=$2, categoria=$3, preco=$4, descricao=$5, imagem=$6 WHERE id=$7`
        const atualiza = await conexao.query(queryAtualiza, [nome, quantidade, categoria, preco, descricao, imagem, id])

        return res.status(200).json()

    } catch (error) {
        return res.status(400).json({ mensagem: "Ocorreu um erro ao atualizar o produto", error: error.message })

    }

}

const deletarProduto = async(req, res) => {
    const { usuario } = req
    const { id } = req.params

    try {
        const queryProdutos = 'SELECT * FROM produtos WHERE id =$1'
        const produtos = await conexao.query(queryProdutos, [id])

        if (produtos.rowCount === 0) {
            return res.status(404).json({ mensagem: `Não existe produto cadastrado com ID ${id}.` })
        }
        const produtoEncontrado = produtos.rows[0]

        if (produtoEncontrado.usuario_id !== usuario.id) {
            return res.status(401).json({ mensagem: "O usuário logado não tem permissão para apagar este produto." })
        }

        const queryDeletar = `DELETE FROM produtos WHERE id=$1`
        const deletar = await conexao.query(queryDeletar, [id])

        return res.status(200).json()

    } catch (error) {
        return res.status(400).json({ mensagem: "Ocorreu um erro ao apagar o produto", error: error.message })

    }
}
module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    deletarProduto
}