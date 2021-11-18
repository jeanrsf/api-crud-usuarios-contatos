const { string } = require('yup');
const yup = require('../configuracoes');

const schemaLogin = yup.object().shape({
    email: string().required().email(),
    senha: string().required(),
});

module.exports = schemaLogin;