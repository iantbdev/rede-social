import { db } from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";
import multer from "multer";

// Configurar o armazenamento do Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

export const upload = multer({ storage: storage }); // Exportar o middleware do Multer

export const uploadMusic = (req, resp) => {
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

      // segunda consulta: inserir na tabela 'musica'
      const q2 = `INSERT INTO musica (genero_musical, compositor, nome, postagem_id) VALUES (?, ?, ?, ?)`;
      const musicValues = [
        req.body.genero_musical,
        req.body.compositor,
        req.body.nome,
        postagemId
      ];

      db.query(q2, musicValues, (err, data) => {
        if (err) return resp.status(500).send(err);

        // terceira consulta: inserir na tabela 'usuario_posta_postagem'
        const q3 = `INSERT INTO usuario_posta_postagem (conteudo, link, usuario_id, postagem_id_postagem) VALUES (?, ?, ?, ?)`;
        const postValues = [
          req.body.conteudo,
          req.file.path,
          userInfo.id,
          postagemId
        ];

        db.query(q3, postValues, (err, data) => {
          if (err) return resp.status(500).send(err);
          return resp.status(200).send("Música carregada e post criada com sucesso!");
        });
      });
    });
  });
};
