import React from "react";
import { useQuery } from "@tanstack/react-query";
import { sendRequest } from "../../axios";
import comunidade from "./comunidade.scss";

const Comunidade = () => {
  return (
    <div className="comunidade">
      <button>Entrar em comunidade</button>
    </div>
  );
};

export default Comunidade;
