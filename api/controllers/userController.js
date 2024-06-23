import { response } from "express";
import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req, res) => {
  const q = "SELECT * FROM usuario WHERE id=?";

  const userId = req.params.id;

  console.log("Buscando usuário com id:", userId);

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Erro na consulta ao banco de dados:", err);
      return res.status(500).send(err);
    }
    if (data.length === 0)
      return res.status(404).send("Usuário não encontrado.");
    const { senha, ...info } = data[0];
    console.log("Usuário encontrado:", info);
    return res.send(info);
  });
};
