const yup = require('../configuracoes');

const schemaAtualizarProduto = yup.object().shape({
    nome: yup.string(),
    quantidade: yup.number().integer().min(1),
    categoria: yup.string(),
    preco: yup.number().moreThan(0),
    descricao: yup.string(),
    imagem: yup.string(),
});

module.exports = schemaAtualizarProduto;