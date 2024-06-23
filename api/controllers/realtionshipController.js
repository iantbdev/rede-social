import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const getRealtionship = (req, res) => {
  const q =
    "SELECT usuario_id_seguidores FROM usuario_segue_usuario WHERE  usuario_id_seguindo = ?";

  db.query(q, [req.query.usuario_id_seguindo], (err, data) => {
    if (err) return res.status(500).json(err);
    return res
      .status(200)
      .json(
        data.map(
          (usuario_segue_usuario) => usuario_segue_usuario.usuario_id_seguidores
        )
      );
  });
};

export const addRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "INSERT INTO usuario_segue_usuario (`usuario_id_seguindo`,`usuario_id_seguidores`) VALUES (?)";
    const values = [req.body.usuarioId, userInfo.id];

    db.query(q, [values], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Seguindo");
    });
  });
};

export const deleteRelationship = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in!");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Token is not valid!");

    const q =
      "DELETE FROM usuario_segue_usuario WHERE `usuario_id_seguindo` = ? AND `usuario_id_seguidores` = ?";

    db.query(q, [req.query.usuarioId, userInfo.id], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Parou de seguir");
    });
  });
};
