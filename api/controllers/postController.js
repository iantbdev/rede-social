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
                 JOIN usuario u ON p.usuario_id = u.id
                LEFT JOIN musica m ON m.postagem_id = p.id_postagem
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
  console.log("ei");
  const token = req.cookies.accessToken;
  if (!token) return resp.status(401).send("Não está logado.");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return resp.status(403).send("Token não é válido.");

    const postData = moment(Date.now()).format("YYYY-MM-DD HH:mm:ss");
    //inserir na tabela 'usuario_posta_postagem'
    const q = `INSERT INTO postagem (usuario_id,conteudo,data, comunidade_id) VALUES (?, ?, ?, ?);`;
    const values = [
      userInfo.id,
      req.body.conteudo,
      postData,
      req.body.comunidade_id || null,
    ];

    db.query(q, values, (err, data) => {
      if (err) return resp.status(500).send(err);

      // Get the ID of the newly inserted post
      const lastIdQuery = `SELECT LAST_INSERT_ID() as id;`;
      db.query(lastIdQuery, (err, selectResult) => {
        if (err) return resp.status(500).send(err);
        const postId = selectResult[0].id;

        // Check if there's a link for musica to insert
        if (req.body.link) {
          console.log(req.body.link);
          const insertMusicQuery = `INSERT INTO musica (postagem_id, link) VALUES (?, ?);`;
          const musicValues = [postId, req.body.link];

          db.query(insertMusicQuery, musicValues, (err, musicResult) => {
            if (err) return resp.status(500).send(err);
            return resp.status(200).send("Post e música criados com sucesso!");
          });
        } else {
          console.log("NOPE!  ");
          return resp.status(200).send("Post criado com sucesso!");
        }
      });
    });
  });
};
