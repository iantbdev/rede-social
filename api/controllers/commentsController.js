import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, resp) => {
  const q = `SELECT 
                  *
                 FROM 
                   usuario_comenta_postagem ucp
                 JOIN 
                   usuario u ON ucp.usuario_id = u.id
                 JOIN 
                   postagem p ON ucp.postagem_id_postagem = p.id_postagem
                 WHERE
                   ucp.postagem_id_postagem = ?
                   ORDER BY ucp.data DESC;
                 `;

  db.query(q, [req.query.id_postagem], (err, data) => {
    if (err) {
      return resp.status(500).send(err);
    }
    return resp.status(200).send(data);
  });
};

export const addComments = (req, resp) => {
  const token = req.cookies.accessToken;
  if (!token) return resp.status(401).send("Não está logado.");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return resp.status(403).send("Token não é válido.");

    const q2 = `INSERT INTO usuario_comenta_postagem (c_conteudo, data, usuario_id, postagem_id_postagem) VALUES (?, ?, ?, ?)`;
    const values = [
      req.body.c_conteudo,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postagem_id_postagem,
    ];

    // console.log("VALORES DOS COMENTARIOS:", values);

    db.query(q2, values, (err, data) => {
      if (err) {
        return resp.status(500).send(err);
      }
      return resp.status(200).send("Comentário criado com sucesso!");
    });
  });
};
