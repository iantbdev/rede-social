import { useState } from "react";
import { Link } from "react-router-dom";
import "./register.scss";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    senha: "",
    nome_completo: "",
    data_de_nascimento: "",
  });
  const [err, setErr] = useState(null);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
    } catch (err) {
      setErr(err.response.data);
    }
  };

  console.log(err);

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>E C H O </h1>
          <p>
            Estamos muito felizes por você se juntar a nós em nossa comunidade
            de amantes da música! TuneTown é o lugar onde você pode compartilhar
            suas músicas favoritas, descobrir novas faixas e conectar-se com
            outros amantes de música.
          </p>
          <span>Você já tem uma conta?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="senha"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="nome_completo"
              onChange={handleChange}
            />
            <input
              type="date"
              placeholder="Data de nascimento"
              name="data_de_nascimento"
              onChange={handleChange}
            />
            {err && err}
            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
