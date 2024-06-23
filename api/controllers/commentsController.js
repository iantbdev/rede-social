import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getComments = (req, resp) => {
  const q = `
    SELECT 
      ucp.*,
      u.profilePic,
      u.nome_completo,
      p.id_postagem
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
      console.error("Erro na consulta ao banco de dados:", err);
      return resp.status(500).send(err); // Retornar erro 500 em caso de falha na consulta
    }
    return resp.status(200).send(data); // Retornar os dados corretamente se não houver erros
  });
};
export const addComments = (req, resp) => {
  const token = req.cookies.accessToken;
  if (!token) return resp.status(401).send("Não está logado.");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return resp.status(403).send("Token não é válido.");

    const q2 = `
      INSERT INTO usuario_comenta_postagem (c_conteudo, data, usuario_id, postagem_id_postagem)
      VALUES (?, ?, ?, ?)
    `;
    const values = [
      req.body.conteudo,
      moment().format("YYYY-MM-DD HH:mm:ss"),
      userInfo.id,
      req.body.postagem_id_postagem,
    ];

    db.query(q2, values, (err, data) => {
      if (err) {
        console.error("Erro ao adicionar comentário:", err);
        return resp.status(500).send(err); // Retornar erro 500 em caso de falha na inserção
      }
      return resp.status(200).send("Comentário criado com sucesso!");
    });
  });
};
