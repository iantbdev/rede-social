import { db } from "../connect.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = (req, resp) => {
  //CHECA SE USUÁRIO EXISTE
  const q = "SELECT * FROM usuario WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return resp.status(500).send(err);
    if (data.length) return resp.status(409).send("Usuário já existe");
    //ENCONDE A SENHA
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.senha, salt);
    //CRIA NOVO USUARIO
    const q =
      "INSERT INTO usuario ( `username`, `email`, `senha`, `nome_completo`, `data_de_nascimento`) VALUES (?)";

    const values = [
      req.body.username,
      req.body.email,
      hashedPassword,
      req.body.nome_completo,
      req.body.data_de_nascimento,
    ];
    db.query(q, [values], (err, data) => {
      if (err) return resp.status(500).send(err);
      return resp.status(200).send("Usuário foi criado!");
    });
  });
};

export const login = (req, resp) => {
  const q = "SELECT * FROM usuario WHERE username = ?";

  db.query(q, [req.body.username], (err, data) => {
    if (err) return resp.status(500).send(err);

    if (data.lenght === 0)
      return resp.status(404).send("Usuário não encontrado.");

    const checkPassword = bcrypt.compareSync(req.body.senha, data[0].senha);

    if (!checkPassword)
      return resp.status(400).send("Senha ou username errados.");
    const token = jwt.sign({ id: data[0].id }, "secretkey");
    const { senha, ...others } = data[0];

    resp
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send(others);
  });
};

export const logout = (req, resp) => {
  resp
    .clearCookie("accessToken", {
      secure: true,
      sameSite: "none",
    })
    .status(200)
    .send("User fez logout.");
};
 
 


