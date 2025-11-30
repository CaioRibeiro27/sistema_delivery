require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// --- CONEXÃO COM O BANCO ---
const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.getConnection((err, connection) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco de dados:", err);
    return;
  }
  console.log("✅ Conectado ao banco de dados MySQL!");
  connection.release();
});

// ==========================================
// ROTAS DE AUTENTICAÇÃO (LOGIN & REGISTER)
// ==========================================

// Rota de Cadastro de USUÁRIO
app.post("/api/register", async (req, res) => {
  const { nome, telefone, senha, email, cpf } = req.body;
  const hashedPassword = await bcrypt.hash(senha, 10);

  const sql =
    "INSERT INTO usuario (nome, telefone, senha, email, cpf) VALUES (?, ?, ?, ?, ?)";

  db.query(sql, [nome, telefone, hashedPassword, email, cpf], (err, result) => {
    if (err) {
      if (err.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          success: false,
          message:
            "Não foi possível concluir o cadastro com os dados informados.",
        });
      }
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Erro ao registrar usuário." });
    }
    res
      .status(201)
      .json({ success: true, message: "Usuário registrado com sucesso!" });
  });
});

// Rota de Cadastro de RESTAURANTE
app.post("/api/register-restaurant", async (req, res) => {
  const {
    nome,
    email,
    senha,
    telefone,
    cnpj, // Dados do restaurante
    estado,
    cidade,
    cep,
    bairro,
    rua,
    numero, // Dados do endereço
  } = req.body;

  const hashedPassword = await bcrypt.hash(senha, 10);

  // Inserir Endereço do Restaurante
  const sqlAddress =
    "INSERT INTO endereco (rua, numero, cep, cidade, bairro) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sqlAddress,
    [rua, numero, cep, cidade, bairro],
    (err, resultAddr) => {
      if (err)
        return res
          .status(500)
          .json({ success: false, message: "Erro ao salvar endereço." });

      const id_endereco = resultAddr.insertId;
      const sqlRest =
        "INSERT INTO restaurante (nome, telefone, cnpj, id_endereco, email, senha) VALUES (?, ?, ?, ?, ?, ?)";

      db.query(
        sqlRest,
        [nome, telefone, cnpj, id_endereco, email, hashedPassword],
        (errRest, resultRest) => {
          if (errRest) {
            if (errRest.code === "ER_DUP_ENTRY") {
              return res.status(400).json({
                success: false,
                message: "Restaurante já cadastrado.",
              });
            }
            console.error(errRest);
            return res
              .status(500)
              .json({ success: false, message: "Erro ao salvar restaurante." });
          }
          res
            .status(201)
            .json({ success: true, message: "Restaurante cadastrado!" });
        }
      );
    }
  );
});

// Rota de login unificada
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  const sqlUser = "SELECT * FROM usuario WHERE email = ?";

  db.query(sqlUser, [email], async (err, resultsUser) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Erro no servidor." });

    if (resultsUser.length > 0) {
      const user = resultsUser[0];
      const isMatch = await bcrypt.compare(password, user.senha);

      if (isMatch) {
        return res.status(200).json({
          success: true,
          message: "Login bem-sucedido!",
          type: "usuario", // Identificador
          user: { id: user.id_usuario, nome: user.nome, email: user.email },
        });
      } else {
        return res
          .status(401)
          .json({ success: false, message: "Email ou senha inválidos." });
      }
    }

    const sqlRest = "SELECT * FROM restaurante WHERE email = ?";

    db.query(sqlRest, [email], async (errRest, resultsRest) => {
      if (errRest)
        return res
          .status(500)
          .json({ success: false, message: "Erro no servidor." });

      if (resultsRest.length > 0) {
        const rest = resultsRest[0];
        const isMatch = await bcrypt.compare(password, rest.senha);

        if (isMatch) {
          return res.status(200).json({
            success: true,
            message: "Login bem-sucedido!",
            type: "restaurante", // Identificador
            user: {
              id: rest.id_restaurante,
              nome: rest.nome,
              email: rest.email,
            },
          });
        }
      }

      return res
        .status(401)
        .json({ success: false, message: "Email ou senha inválidos." });
    });
  });
});

// ==========================================
// ROTAS DE CARTÕES (CRUD)
// ==========================================

// Buscar cartões
app.get("/api/cards/:userId", (req, res) => {
  const { userId } = req.params;
  const sql =
    "SELECT id_cartao, numero_cartao, bandeira, nome_titular, data_vencimento FROM cartao WHERE id_usuario = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error("Erro ao buscar cartões:", err);
      return res
        .status(500)
        .json({ success: false, message: "Erro no servidor." });
    }
    res.status(200).json({ success: true, cards: results });
  });
});

// Adicionar cartão
app.post("/api/cards", (req, res) => {
  const { numero_cartao, bandeira, nome_titular, data_vencimento, id_usuario } =
    req.body;
  const sql =
    "INSERT INTO cartao (numero_cartao, bandeira, nome_titular, data_vencimento, id_usuario) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [numero_cartao, bandeira, nome_titular, data_vencimento, id_usuario],
    (err, result) => {
      if (err) {
        if (err.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            success: false,
            message: "Este número de cartão já está cadastrado.",
          });
        }
        console.error("Erro ao salvar cartão:", err);
        return res
          .status(500)
          .json({ success: false, message: "Erro ao salvar cartão." });
      }
      res.status(201).json({
        success: true,
        message: "Cartão adicionado!",
        cardId: result.insertId,
      });
    }
  );
});

// Atualizar cartão
app.put("/api/cards/:cardId", (req, res) => {
  const { cardId } = req.params;
  const { nome_titular, data_vencimento } = req.body;
  const sql =
    "UPDATE cartao SET nome_titular = ?, data_vencimento = ? WHERE id_cartao = ?";

  db.query(sql, [nome_titular, data_vencimento, cardId], (err, result) => {
    if (err) {
      console.error("Erro ao atualizar cartão:", err);
      return res
        .status(500)
        .json({ success: false, message: "Erro ao atualizar cartão." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cartão não encontrado." });
    }
    res
      .status(200)
      .json({ success: true, message: "Cartão atualizado com sucesso!" });
  });
});

// Deletar cartão
app.delete("/api/cards/:cardId", (req, res) => {
  const { cardId } = req.params;
  const sql = "DELETE FROM cartao WHERE id_cartao = ?";

  db.query(sql, [cardId], (err, result) => {
    if (err) {
      console.error("Erro ao deletar cartão:", err);
      return res
        .status(500)
        .json({ success: false, message: "Erro ao deletar cartão." });
    }
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Cartão não encontrado." });
    }
    res
      .status(200)
      .json({ success: true, message: "Cartão removido com sucesso!" });
  });
});

// ==========================================
// ROTAS DE USUÁRIO (PERFIL)
// ==========================================

// Buscar dados do perfil
app.get("/api/users/:userId", (req, res) => {
  const { userId } = req.params;
  const sql =
    "SELECT id_usuario, nome, email, telefone, cpf FROM usuario WHERE id_usuario = ?";

  db.query(sql, [userId], (err, results) => {
    if (err) return res.status(500).json({ success: false });
    if (results.length === 0) return res.status(404).json({ success: false });
    res.status(200).json({ success: true, user: results[0] });
  });
});

// Atualizar perfil (telefone, email ou senha)
app.put("/api/users/:userId", async (req, res) => {
  const { userId } = req.params;
  const { telefone, email, novaSenha } = req.body;

  let sql = "";
  let params = [];

  if (telefone) {
    sql = "UPDATE usuario SET telefone = ? WHERE id_usuario = ?";
    params = [telefone, userId];
  } else if (email) {
    sql = "UPDATE usuario SET email = ? WHERE id_usuario = ?";
    params = [email, userId];
  } else if (novaSenha) {
    const hashedPassword = await bcrypt.hash(novaSenha, 10);
    sql = "UPDATE usuario SET senha = ? WHERE id_usuario = ?";
    params = [hashedPassword, userId];
  } else {
    return res
      .status(400)
      .json({ success: false, message: "Nenhum dado para atualizar." });
  }

  db.query(sql, params, (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Erro ao atualizar dados." });
    }
    res
      .status(200)
      .json({ success: true, message: "Dados atualizados com sucesso!" });
  });
});

// Deletar conta de usuário
app.delete("/api/users/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = "DELETE FROM usuario WHERE id_usuario = ?";

  db.query(sql, [userId], (err, result) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Erro ao excluir conta." });
    res
      .status(200)
      .json({ success: true, message: "Conta excluída com sucesso." });
  });
});

// ==========================================
// ROTAS DE ENDEREÇO (CRUD)
// ==========================================

// Buscar endereços do usuário
app.get("/api/addresses/:userId", (req, res) => {
  const { userId } = req.params;
  const sql = `
    SELECT e.id_endereco, e.rua, e.numero, e.cep, e.cidade, e.bairro, ue.localizacao 
    FROM endereco e
    JOIN usuario_endereco ue ON e.id_endereco = ue.id_endereco
    WHERE ue.id_usuario = ?
  `;

  db.query(sql, [userId], (err, results) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Erro ao buscar endereços." });
    res.status(200).json({ success: true, addresses: results });
  });
});

// Adicionar endereço
app.post("/api/addresses", (req, res) => {
  const { rua, numero, cep, cidade, bairro, localizacao, id_usuario } =
    req.body;

  // 1. Inserir Endereço
  const sqlAddress =
    "INSERT INTO endereco (rua, numero, cep, cidade, bairro) VALUES (?, ?, ?, ?, ?)";

  db.query(sqlAddress, [rua, numero, cep, cidade, bairro], (err, result) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Erro ao salvar dados do endereço." });
    }

    const id_endereco = result.insertId;

    // 2. Vincular ao Usuário
    const sqlLink =
      "INSERT INTO usuario_endereco (id_usuario, id_endereco, localizacao) VALUES (?, ?, ?)";

    db.query(
      sqlLink,
      [id_usuario, id_endereco, localizacao],
      (errLink, resultLink) => {
        if (errLink) {
          console.error(errLink);
          return res
            .status(500)
            .json({ success: false, message: "Erro ao vincular endereço." });
        }
        res
          .status(201)
          .json({ success: true, message: "Endereço adicionado!" });
      }
    );
  });
});

// Atualizar endereço
app.put("/api/addresses/:addressId", (req, res) => {
  const { addressId } = req.params;
  const { rua, numero, cep, cidade, bairro, localizacao, id_usuario } =
    req.body;

  // Atualiza tabela endereco
  const sqlAddress =
    "UPDATE endereco SET rua=?, numero=?, cep=?, cidade=?, bairro=? WHERE id_endereco=?";

  db.query(sqlAddress, [rua, numero, cep, cidade, bairro, addressId], (err) => {
    if (err)
      return res
        .status(500)
        .json({ success: false, message: "Erro ao atualizar endereço." });

    // Atualiza tabela de vinculo
    const sqlLink =
      "UPDATE usuario_endereco SET localizacao=? WHERE id_endereco=? AND id_usuario=?";
    db.query(sqlLink, [localizacao, addressId, id_usuario], (errLink) => {
      if (errLink) return res.status(500).json({ success: false });
      res.status(200).json({ success: true, message: "Endereço atualizado!" });
    });
  });
});

// Deletar endereço
app.delete("/api/addresses/:addressId", (req, res) => {
  const { addressId } = req.params;

  // 1. Deletar Vínculo
  const sqlLink = "DELETE FROM usuario_endereco WHERE id_endereco = ?";

  db.query(sqlLink, [addressId], (err, result) => {
    if (err) {
      console.error("Erro ao desvincular endereço:", err);
      return res
        .status(500)
        .json({ success: false, message: "Erro ao desvincular endereço." });
    }

    // 2. Deletar Endereço Físico
    const sqlAddress = "DELETE FROM endereco WHERE id_endereco = ?";

    db.query(sqlAddress, [addressId], (errAddress, resultAddress) => {
      if (errAddress) {
        console.error("Erro ao deletar endereço físico:", errAddress);
        return res.status(200).json({
          success: true,
          message: "Endereço desvinculado com sucesso.",
        });
      }

      res
        .status(200)
        .json({ success: true, message: "Endereço removido completamente!" });
    });
  });
});

// ==========================================
// Rotas de pedidos (Dashboard do restaurante)
// ==========================================

// Buscar pedidos de um restaurante específico
app.get("/api/restaurant/:restaurantId/orders", (req, res) => {
  const { restaurantId } = req.params;
  const sql = `
    SELECT 
      p.id_pedido, 
      p.valor_total, 
      p.statusPedido, 
      p.data_pedido,
      u.nome as nome_cliente,
      e.rua, e.numero, e.bairro -- Endereço do cliente
    FROM pedido p
    JOIN usuario u ON p.id_usuario = u.id_usuario
    JOIN usuario_endereco ue ON u.id_usuario = ue.id_usuario -- Pega o endereço principal
    JOIN endereco e ON ue.id_endereco = e.id_endereco
    WHERE p.id_restaurante = ?
    ORDER BY p.data_pedido DESC
  `;

  db.query(sql, [restaurantId], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Erro ao buscar pedidos." });
    }
    res.status(200).json({ success: true, orders: results });
  });
});

// Atualizar status do pedido
app.put("/api/orders/:orderId/status", (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const sql = "UPDATE pedido SET statusPedido = ? WHERE id_pedido = ?";

  db.query(sql, [status, orderId], (err, result) => {
    if (err) return res.status(500).json({ success: false });
    res.status(200).json({ success: true, message: "Status atualizado!" });
  });
});

// Buscar itens de um pedido específico
app.get("/api/orders/:orderId/items", (req, res) => {
  const { orderId } = req.params;
  const sql = `
    SELECT pi.quantidade, c.nome_produto, pi.preco_unitario
    FROM pedido_itens pi
    JOIN cardapio c ON pi.id_cardapio = c.id_cardapio
    WHERE pi.id_pedido = ?
  `;

  db.query(sql, [orderId], (err, results) => {
    if (err) return res.status(500).json({ success: false });
    res.status(200).json({ success: true, items: results });
  });
});

app.get("/api/menu/:restaurantId", (req, res) => {
  const { restaurantId } = req.params;
  const sql = "SELECT * FROM cardapio WHERE id_restaurante = ?";

  db.query(sql, [restaurantId], (err, results) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ success: false, message: "Erro ao buscar cardápio." });
    }
    res.status(200).json({ success: true, items: results });
  });
});

// Adicionar item ao cardápio
app.post("/api/menu", (req, res) => {
  const { nome_produto, descricao, preco, categoria, id_restaurante } =
    req.body;

  const sql =
    "INSERT INTO cardapio (nome_produto, descricao, preco, categoria, id_restaurante) VALUES (?, ?, ?, ?, ?)";

  db.query(
    sql,
    [nome_produto, descricao, preco, categoria, id_restaurante],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ success: false, message: "Erro ao adicionar item." });
      }
      res.status(201).json({ success: true, message: "Item adicionado!" });
    }
  );
});

app.listen(port, () => {
  console.log(`🚀 Servidor backend rodando na porta ${port}`);
});
