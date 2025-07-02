import React from "react";
import { Form, Input } from "@rocketseat/unform";

import { useAuth } from "../../contexts";
// import AvatarInput from './AvatarInput'

import { Container } from "./styles";

const Profile: React.FC = () => {
  const { user, updateProfile, signOut } = useAuth();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSubmit = (data: any): void => {
    const { name, email, oldPassword, password, confirmPassword, avatar_id } =
      data;
    updateProfile({
      name,
      email,
      oldPassword,
      password,
      confirmPassword,
      avatar_id,
    });
  };

  const handleSignOut = (): void => {
    signOut();
  };

  return (
    <Container>
      <Form initialData={user || undefined} onSubmit={handleSubmit}>
        {/* <AvatarInput name="avatar_id" /> */}
        <Input name="name" placeholder="Nome completo" />
        <Input type="email" name="email" placeholder="Seu e-mail" />
        <hr />
        <Input
          type="password"
          name="oldPassword"
          placeholder="Sua senha atual"
        />
        <Input type="password" name="password" placeholder="Nova Senha" />
        <Input
          type="password"
          name="confirmPassword"
          placeholder="Confirmação de senha"
        />

        <button type="submit">Atualizar perfil</button>
      </Form>

      <button type="button" onClick={handleSignOut}>
        Sair
      </button>
    </Container>
  );
};

export default Profile;
