const db = require('../connect');

exports.uploadMusic = (req, res) => {
  const { genero_musical, compositor, nome, usuario_id } = req.body;
  const musicPath = req.file.path;

  // Primeiro, criar uma nova postagem
  const createPostQuery = 'INSERT INTO postagem (data) VALUES (CURDATE())';
  
  db.query(createPostQuery, (err, result) => {
    if (err) {
      console.error('Error creating post:', err);
      return res.status(500).json({ error: 'Unable to create post' });
    }

    const postagem_id = result.insertId;

    // Em seguida, inserir a música associada à postagem
    const musicQuery = 'INSERT INTO musica (genero_musical, compositor, nome, postagem_id) VALUES (?, ?, ?, ?)';
    const musicValues = [genero_musical, compositor, nome, postagem_id];

    db.query(musicQuery, musicValues, (err, result) => {
      if (err) {
        console.error('Error saving music to the database:', err);
        return res.status(500).json({ error: 'Unable to save music' });
      }

      // Associar a postagem ao usuário que a fez
      const userPostQuery = 'INSERT INTO usuario_posta_postagem (usuario_id, postagem_id_postagem, conteudo, link) VALUES (?, ?, ?, ?)';
      const userPostValues = [usuario_id, postagem_id, nome, musicPath];

      db.query(userPostQuery, userPostValues, (err, result) => {
        if (err) {
          console.error('Error associating post with user:', err);
          return res.status(500).json({ error: 'Unable to associate post with user' });
        }

        res.status(201).json({ id: postagem_id, genero_musical, compositor, nome, musicPath });
      });
    });
  });
};