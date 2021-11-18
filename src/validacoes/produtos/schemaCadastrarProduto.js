const yup = require('../configuracoes');

const schemaCadastrarProduto = yup.object().shape({
    nome: yup.string().required(),
    quantidade: yup.number().integer().required().min(1),
    categoria: yup.string().required(),
    preco: yup.number().required().moreThan(0),
    descricao: yup.string().required(),
    imagem: yup.string().required(),
});

module.exports = schemaCadastrarProduto;