const yup = require('../configuracoes');

const schemaAtualizarUsuario = yup.object().shape({
    nome: yup.string(),
    email: yup.string().email(),
    senha: yup.string().min(5),
    nome_loja: yup.string(),
});

module.exports = schemaAtualizarUsuario;