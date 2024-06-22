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
                 postagem p
                LEFT JOIN
                 usuario_segue_usuario usu ON p.usuario_id = usu.usuario_id_seguindo 
                WHERE usu.usuario_id_seguidores= ? 
                OR p.usuario_id=? 
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

    const postData = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
      //inserir na tabela 'usuario_posta_postagem'
      const q = `INSERT INTO postagem (usuario_id,conteudo,data,link) VALUES (?, ?, ?)`;
      const values = [
        userInfo.id,
        req.body.conteudo,
        postData,
        req.body.link,
      ];

      db.query(q, values, (err, data) => {
        if (err) return resp.status(500).send(err);
        return resp.status(200).send("Post criado com sucesso!");
      });
  });
};
