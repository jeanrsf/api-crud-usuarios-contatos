const schemaCadastrarProduto = require('../validacoes/produtos/schemaCadastrarProduto');
const schemaAtualizarProduto = require('../validacoes/produtos/schemaAtualizarProduto');
const knex = require('../conexao');

const listarProdutos = async(req, res) => {
    const { usuario } = req;
    try {
        const listarProdutos = await knex('produtos').where('usuario_id', usuario.id);

        return res.status(200).json(listarProdutos);
    } catch (error) {
        return res
            .status(400)
            .json({ mensagem: 'Ocorreu um erro ao recuperar os dados dos produtos.', mensagemErro: error.message });
    }
};
const obterProduto = async(req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where('id', id).andWhere('usuario_id', usuario.id).first();

        if (!produto) {
            return res.status(404).json({ mensagem: `Não existe produto cadastrado com ID ${id}.` });
        }

        return res.status(200).json(produto);
    } catch (error) {
        return res.status(400).json({ mensagem: 'Ocorreu um erro ao recuperar o produto', error: error.message });
    }
};

const cadastrarProduto = async(req, res) => {
    const { nome, quantidade, categoria, usuario_id, preco, descricao, imagem } = req.body;
    const { usuario } = req;

    try {
        await schemaCadastrarProduto.validate(req.body);

        const cadastro = await knex('produtos').insert({
            nome,
            usuario_id,
            quantidade,
            categoria,
            preco,
            descricao,
            imagem,
        });

        return res.status(201).json();
    } catch (error) {
        return res.status(400).json({ mensagem: 'Ocorreu um erro ao cadastrar o produto', error: error.message });
    }
};
const atualizarProduto = async(req, res) => {
    const {
        nome = null,
            quantidade = null,
            categoria = null,
            preco = null,
            descricao = null,
            imagem = null,
            usuario_id = null,
    } = req.body;
    const { usuario } = req;
    const { id } = req.params;

    try {
        await schemaAtualizarProduto.validate(req.body);

        const produto = await knex('produtos').where('id', id).andWhere('usuario_id', usuario.id).first();

        if (!produto) {
            return res.status(404).json({ mensagem: `Não existe produto cadastrado com ID ${id}.` });
        }
        const atualizar = await knex('produtos')
            .update({
                nome,
                usuario_id,
                quantidade,
                categoria,
                preco,
                descricao,
                imagem,
            })
            .where('id', id);

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json({ mensagem: 'Ocorreu um erro ao atualizar o produto', error: error.message });
    }
};

const deletarProduto = async(req, res) => {
    const { usuario } = req;
    const { id } = req.params;

    try {
        const produto = await knex('produtos').where('id', id).andWhere('usuario_id', usuario.id).first();

        if (!produto) {
            return res.status(404).json({ mensagem: `Não existe produto cadastrado com ID ${id}.` });
        }

        const deletar = await knex('produtos').where('id', id).delete();

        return res.status(200).json();
    } catch (error) {
        return res.status(400).json({ mensagem: 'Ocorreu um erro ao apagar o produto', error: error.message });
    }
};
module.exports = {
    listarProdutos,
    obterProduto,
    cadastrarProduto,
    atualizarProduto,
    deletarProduto,
};