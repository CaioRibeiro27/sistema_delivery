#Banco de dados do sistema de delivery
create table endereco(
	id_endereco int AUTO_INCREMENT PRIMARY KEY,
	rua varchar(100) NOT NULL,
    numero int NOT NULL,
	cep varchar(10) NOT NULL,
    cidade varchar(100) NOT NULL,
    bairro varchar(50) NOT NULL
);

create table usuario(
	id_usuario int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(100) NOT NULL,
    telefone varchar(20) NOT NULL UNIQUE,
    senha varchar(50) NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    cpf char(14) UNIQUE NOT NULL
);

create table usuario_endereco(
    localizacao varchar(30),
	id_usuario int NOT NULL,
    id_endereco int NOT NULL,
    
    PRIMARY KEY(id_usuario, id_endereco),
    FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY(id_endereco) REFERENCES endereco(id_endereco)
);

create table restaurante(
	id_restaurante int AUTO_INCREMENT PRIMARY KEY,
    nome varchar(50) NOT NULL,
    telefone varchar(20) NOT NULL UNIQUE,
    cnpj char(18) UNIQUE NOT NULL,
    email varchar(100) UNIQUE NOT NULL,
    senha varchar(50) NOT NULL,
    id_endereco int NOT NULL,
    
    FOREIGN KEY(id_endereco) REFERENCES endereco(id_endereco)
);

create table cardapio(
	id_cardapio int AUTO_INCREMENT PRIMARY KEY,
    nome_produto varchar(50) NOT NULL,
    descricao varchar(100) NOT NULL,
    preco decimal(6, 2) NOT NULL,
    id_restaurante int NOT NULL,
    
    FOREIGN KEY(id_restaurante) REFERENCES restaurante(id_restaurante)
);

create table entregador(
	id_entregador int AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(200) NOT NULL UNIQUE,
    senha VARCHAR(100) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    cnh varchar(20) NOT NULL UNIQUE,
    placa varchar(10) NOT NULL UNIQUE
);

create table cartao(
	id_cartao int AUTO_INCREMENT PRIMARY KEY,
    numero_cartao VARCHAR(16) UNIQUE NOT NULL,
    bandeira VARCHAR(20) NOT NULL,
    nome_titular VARCHAR(100) NOT NULL,
    data_vencimento varchar(10) NOT NULL,
    id_usuario int NOT NULL,
    
    FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario)
);

create table pedido(
	id_pedido int AUTO_INCREMENT PRIMARY KEY,
    valor_total decimal (6, 2) NOT NULL,
    data_pedido datetime NOT NULL,
    statusPedido ENUM('Em_andamento', 'A_caminho', 'Entregue', 'Cancelado', 'Aceito') NOT NULL,
    id_usuario int NOT NULL,
    id_restaurante int NOT NULL,
    id_entregador int NULL,
    
    FOREIGN KEY(id_usuario) REFERENCES usuario(id_usuario),
    FOREIGN KEY(id_restaurante) REFERENCES restaurante(id_restaurante),
    FOREIGN KEY(id_entregador) REFERENCES entregador(id_entregador)
		ON DELETE SET NULL
);

create table pedido_itens(
	id_pedido_item int AUTO_INCREMENT PRIMARY KEY,
    quantidade int NOT NULL,
    preco_unitario decimal(6,2) NOT NULL,
    id_pedido int NOT NULL,
    id_cardapio int NOT NULL,
    
    FOREIGN KEY (id_pedido) REFERENCES pedido(id_pedido),
    FOREIGN KEY (id_cardapio) REFERENCES cardapio(id_cardapio)
);

create table cupom(
    id_cupom int AUTO_INCREMENT PRIMARY KEY,
    codigo varchar(20) UNIQUE NOT NULL,
    tipo ENUM('PERCENTUAL', 'FIXO') NOT NULL,
    valor decimal(6, 2) NOT NULL,
    data_validade date,
    ativo boolean DEFAULT true
);