import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getPosts = (req, resp) => {
  const token = req.cookies.accessToken;
  if (!token) return resp.status(401).send("Não está logado.");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return resp.status(403).send("Token não é válido.");

    // mostra apenas seus posts ou dos seus amigos
    const q = `SELECT 
                *
               FROM 
                 usuario_posta_postagem upp
               JOIN 
                 usuario u ON upp.usuario_id = u.id
               JOIN 
                 postagem p ON upp.postagem_id_postagem = p.id_postagem
               LEFT JOIN
                 usuario_segue_usuario usu ON upp.usuario_id = usu.usuario_id_seguindo WHERE usu.usuario_id_seguidores= ? OR upp.usuario_id=? 
                 ORDER BY p.data DESC;
               `;

    db.query(q, [userInfo.id, userInfo.id], (err, data) => {
      if (err) return resp.status(500).send(err);
      return resp.status(200).send(data);
    });
  });
};

export const addPost = (req, resp) => {
  const token = req.cookies.accessToken;
  if (!token) return resp.status(401).send("Não está logado.");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return resp.status(403).send("Token não é válido.");

    // primeira consulta: inserir na tabela 'postagem'
    const q1 = `INSERT INTO postagem (data) VALUES (?)`;
    const postData = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");

    db.query(q1, [postData], (err, result) => {
      if (err) return resp.status(500).send(err);

      const postagemId = result.insertId;

      // segunda consulta: inserir na tabela 'usuario_posta_postagem'
      const q2 = `INSERT INTO usuario_posta_postagem (conteudo, link, usuario_id, postagem_id_postagem) VALUES (?, ?, ?, ?)`;
      const values = [
        req.body.conteudo,
        req.body.link,
        userInfo.id,
        postagemId,
      ];

      db.query(q2, values, (err, data) => {
        if (err) return resp.status(500).send(err);
        return resp.status(200).send("Post criado com sucesso!");
      });
    });
  });
};
