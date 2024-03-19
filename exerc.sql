-- Lista 1 - a) Faça os scripts para a criação das tabelas, sem as constraints.

create table SUPPLIER (
	CDSUPPLIER INT NOT NULL,
	NMSUPPLIER VARCHAR(255),
	NRFONE NUMERIC(12),
)

CREATE TABLE PRODUCT (
	CDPRODUCT INT NOT NULL,
	NMPRODUCT VARCHAR(255),
	CDSUPPLIER INT NOT NULL,
	VLPRICE NUMERIC (10,2),
	QTSTOCK INT,
)

CREATE TABLE CUSTOMER(
	CDCUSTOMER INT NOT NULL,
	NMCUSTOMER VARCHAR(255),
	NRFONE NUMERIC(12),
	DSADRESS VARCHAR(255)
)

CREATE TABLE REQUEST (
  DTREQUEST DATE,
  CDREQUEST INT NOT NULL,
  CDCUSTOMER INT NOT NULL,
  DTDELIVER DATE,
  VLTOTAL NUMERIC(10 , 2)
)

CREATE TABLE PRODUCTREQUEST (
  CDREQUEST INT NOT NULL,
  CDPRODUCT INT NOT NULL,
  QTAMOUNT INT,
  VLUNITARY NUMERIC(10, 2)
)

-- Lista 1 - b) Faça um script para a criação das chaves primárias das tabelas criadas.

ALTER TABLE SUPPLIER ADD PRIMARY KEY (CDSUPPLIER)

ALTER TABLE PRODUCT ADD PRIMARY KEY (CDPRODUCT)

ALTER TABLE CUSTOMER ADD PRIMARY KEY (CDCUSTOMER)
	
ALTER TABLE REQUEST ADD PRIMARY KEY (CDREQUEST)

ALTER TABLE PRODUCTREQUEST ADD PRIMARY KEY (CDREQUEST, CDPRODUCT)


-- Lista 1 - c) Faça um script para criação das chaves secundárias das tabelas criadas.

ALTER TABLE PRODUCT ADD FOREIGN KEY (CDSUPPLIER) REFERENCES SUPPLIER(CDSUPPLIER)

ALTER TABLE REQUEST ADD FOREIGN KEY (CDCUSTOMER) REFERENCES CUSTOMER(CDCUSTOMER)
	
ALTER TABLE PRODUCTREQUEST ADD FOREIGN KEY (CDREQUEST) REFERENCES REQUEST(CDREQUEST) 

ALTER TABLE PRODUCTREQUEST ADD FOREIGN KEY (CDPRODUCT) REFERENCES PRODUCT(CDPRODUCT) 

-- Lista 1 - d) Crie um índice para chave estrangeira da tabela de produtos.

CREATE INDEX IDX_SUPPLIER ON PRODUCT(CDSUPPLIER)
	
-- Lista 1 - e) Crie um índice para chave estrangeira da tabela de pedidos.

CREATE INDEX IDX_CUSTOMER ON REQUEST(CDCUSTOMER)

-- Lista 1) - f) Adicione o campo endereço na tabela de fornecedores.

ALTER TABLE SUPPLIER ADD DSADRESS VARCHAR(255)

-- Lista 1) - g) Faça inserção de um novo cliente.

INSERT INTO CUSTOMER(CDCUSTOMER, NMCUSTOMER, NRFONE, DSADRESS) VALUES (1, 'Fabiano', 99879375, 'Rua Tijucas, 110, Centro, Joinville – S.C')

-- Lista 1) - h) Faça a inserção de um novo pedido com os seguintes dados.

INSERT INTO REQUEST (DTREQUEST, CDREQUEST, CDCUSTOMER, DTDELIVER, VLTOTAL) VALUES ('2008-01-31', 3, 1, '2008-02-05', 54.00)

-- Lista 1) - i) Atualize o telefone do cliente Fabiano.

UPDATE CUSTOMER SET NRFONE=99012567 WHERE CDCUSTOMER=1

-- Lista 1) - j) Apague as inserções feitas nos exercícios i e j.

DELETE FROM REQUEST

DELETE FROM CUSTOMER

-- Lista 1) - k) Faça o script para excluir todas as tabelas criadas no exercício a

DROP TABLE PRODUCTREQUEST

DROP TABLE PRODUCT

DROP TABLE SUPPLIER

DROP TABLE REQUEST

DROP TABLE CUSTOMER
