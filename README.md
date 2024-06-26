# rede-social
rede social feito com react, node.js e mysql

# instalação
cd api e cd client
`npm install` nas duas

# configuração
mude o arquivo connect.js na pasta api para as configurações do seu banco de dados

cd api
`nodemon index.js` para conferir a API
e
cd client
`npm start`


# OBS
Por algum motivo, a postagem de musica so funciona no google chrome (ou pelo menos nao funciona no firefox).
Então se for testar, use o google chrome. (Também é possivel que postar musica só funcione na segunda tentativa, não sei o motivo disso)

# PS
Professor, enviamos um arquivo .mwb levemente desatualizado onde o comunidade_id em postagens consta como not null mas contém o icone de primary key ainda, o que buga o foward engineering. Por favor, clique uma vez no ícone de primary key para que mude para o prisma branco com as bordas vermelhas.
