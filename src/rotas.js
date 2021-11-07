const express = require('express');
const { listarProdutos, obterProduto, cadastrarProduto, atualizarProduto, deletarProduto } = require('./controladores/produtos');
const { cadastroUsuario, login, dadosUsuario, atualizarUsuario } = require('./controladores/usuario');
const verificaLogin = require('./filtros/verificaLogin');

const rotas = express.Router()


rotas.post('/login', login);

rotas.post('/usuarios', cadastroUsuario);

rotas.use(verificaLogin)

rotas.get('/usuarios', dadosUsuario)
rotas.put('/usuarios', atualizarUsuario);

rotas.get('/produtos', listarProdutos)
rotas.get('/produtos/:id', obterProduto)
rotas.post('/produtos', cadastrarProduto)
rotas.put('/produtos/:id', atualizarProduto)
rotas.delete('/produtos/:id', deletarProduto)


module.exports = {
    rotas
}