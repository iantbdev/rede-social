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

export const getUsersByName = (req, res) => {
  console.log("Buscando usuário com nome:", req.query.name);
  
  const q = `SELECT * FROM usuario WHERE username LIKE ?;`;

  const userName = `%${req.query.name}%`;

  console.log("Buscando usuário com nome:", userName);

  db.query(q, [userName], (err, data) => {
    if (err) {
      console.error("Erro na consulta ao banco de dados:", err);
      return res.status(500).send(err);
    }
    if (data.length === 0)
      return res.status(404).send("Usuário não encontrado.");

    // Map over the data array to exclude the senha property from each user object
    const usersInfo = data.map(({ senha, ...info }) => info);

    return res.send(usersInfo);
  });
};



export const getSuggestions = (req, res) => {
  const userId = req.params.id;
  const limit = parseInt(req.query.limit, 10) || 3; 

  const q = `
    SELECT * FROM usuario
    WHERE id != ? LIMIT ?; 
  `;

  db.query(q, [userId, limit], (err, data) => {
    if (err) {
      console.error("Erro na consulta ao banco de dados:", err);
      return res.status(500).send(err);
    }
    return res.status(200).send(data);
  });
};
