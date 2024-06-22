//import mysql from "mysql";
import mysql2 from "mysql2";

export const db = mysql2.createConnection({
  host: "localhost",
  user: "root",
  password: "123", //  password: "senha",
  database: "redesocial2",
});
