CREATE TABLE usuarios(
id SERIAL PRIMARY KEY,
nome TEXT NOT NULL,
nome_loja TEXT,
email TEXT UNIQUE NOT NULL,
senha TEXT NOT NULL
);

CREATE TABLE produtos(
id SERIAL PRIMARY KEY,
usuario_id INT,
nome TEXT NOT NULL,
quantidade INT,
categoria TEXT,
preco DECIMAL,
descricao TEXT,
imagem TEXT
);