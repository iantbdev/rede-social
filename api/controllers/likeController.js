import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getLiked = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return resp.status(401).send("Não está logado.");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return resp.status(403).send("Token não é válido.");
    //mostra se o usuario logado deu like
    const q = `SELECT uc.like FROM usuario_curte uc WHERE uc.postagem_id = ? AND uc.usuario_id = ?`;
    db.query(q, [req.body.postId, userInfo.id], (err, data) => {
      if (err) return resp.status(500).send(err);
      return resp.status(200).send(data);
    });
  });
};

export const getLikes = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return resp.status(401).send("Não está logado.");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return resp.status(403).send("Token não é válido.");
    //mostra o total de likes
    const q = `SELECT count(uc.like) as likes FROM usuario_curte uc
              INNER JOIN postagem p ON p.id_postagem = uc.postagem_id
              WHERE uc.like IS TRUE AND uc.postagem_id = ?`;
    db.query(q, [req.body.postId], (err, data) => {
      if (err) return resp.status(500).send(err);
      return resp.status(200).send(data);
    });
  });
};

// Add a like
export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return resp.status(401).send("Não está logado.");
  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return resp.status(403).send("Token não é válido.");
    let like_ou_dislike = getLike(req, res);
    //inserir na tabela 'usuario_curte'
    const q = `INSERT INTO usuario_curte (usuario_id,postagem_id,like) VALUES (?, ?, ?)`;
    const values = [userInfo.id, req.body.postId, like_ou_dislike];
    db.query(q, values, (err, data) => {
      if (err) return resp.status(500).send(err);
      return resp.status(200).send("Curti!");
    });
  });
};
