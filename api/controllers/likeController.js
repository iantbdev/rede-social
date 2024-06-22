import { db } from "../connect.js";
import jwt from "jsonwebtoken";


export const getLiked = (req, res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send("Não está logado.");
    
        jwt.verify(token, "secretkey", (err, userInfo) => {
        if (err) return res.status(403).send("Token não é válido.");
    
        //mostra se o usuario logado deu like
        const q = 'SELECT uc.`like` FROM usuario_curte uc WHERE uc.postagem_id = ? AND uc.usuario_id = ?';
        
        
        db.query(q, [req.params.postagem_id, userInfo.id], (err, data) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(data);
        });
    });
};
    
export const getLikes = (req, res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).send("Não está logado.");
    
    jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).send("Token não é válido.");
  
      //mostra o total de likes
      const q = 'SELECT count(uc.`like`) as likes FROM usuario_curte uc ' +
                'INNER JOIN postagem p ON p.id_postagem = uc.postagem_id ' +
                'WHERE uc.like IS TRUE AND uc.postagem_id = ?;';
      
      db.query(q, [req.query.postagem_id], (err, data) => {
        if (err) return res.status(500).send(err);
        return res.status(200).send(req.params.postagem_id);
      });
    });
  };

// Add a like
export const addLike = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).send("Não está logado.");

  jwt.verify(token, "secretkey", (err, userInfo) => {
      if (err) return res.status(403).send("Token não é válido.");

      
      // Check if like already exists
      const checkQuery = `SELECT * FROM usuario_curte WHERE usuario_id = ? AND postagem_id = ?;`;
      const checkValues = [userInfo.id, req.body.postagem_id];

      db.query(checkQuery, checkValues, (err, result) => {
          if (err) return res.status(500).send(err);

          if (result.length > 0) {
              // Like already exists, update it
              const updateQuery = 'UPDATE usuario_curte SET `like` = ? WHERE usuario_id = ? AND postagem_id = ?;';
              const updateValues = [req.body.like, userInfo.id, req.body.postagem_id];

              db.query(updateQuery, updateValues, (err, data) => {
                  if (err) return res.status(500).send(err);
                  return res.status(200).send("Like atualizado!");
              });
          } else {
              // Like does not exist, insert new like
              const insertQuery = 'INSERT INTO usuario_curte (usuario_id, postagem_id, `like`) VALUES (?, ?, ?);';
              const insertValues = [userInfo.id, req.body.postagem_id, req.body.like];
              db.query(insertQuery, insertValues, (err, data) => {
                  if (err) return res.status(500).send(err);
                  return res.status(200).send("Curti!");
              });
          }
      });
  });
};



