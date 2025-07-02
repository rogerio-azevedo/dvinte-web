import React from "react";
import { Link } from "react-router";
import { Form, Input } from "@rocketseat/unform";
import * as Yup from "yup";
import { useAuth } from "../../contexts";

const schema = Yup.object().shape({
  email: Yup.string()
    .email("Insira um e-mail válido")
    .required("O e-mail é obrigatório"),

  password: Yup.string().required("A senha é obrigatória"),
});

const SignIn: React.FC = () => {
  const { signIn, loading } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubimit = (data: any): void => {
    const { email, password } = data;
    signIn({ email, password });
  };

  return (
    <>
      <Form schema={schema} onSubmit={handleSubimit}>
        <Input name="email" type="email" placeholder="E-mail" />
        <Input name="password" type="password" placeholder="Senha" />

        <button type="submit">{loading ? "Carregando..." : "Acessar"}</button>
        <Link to="/register">Criar conta gratuita</Link>
      </Form>
    </>
  );
};

export default SignIn;
