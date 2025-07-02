/* eslint-disable no-console */

import { useState, useEffect } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import api from "../../services/api";
import { useAuth } from "../../contexts";

import Button from "../../components/Button";
import * as Styles from "./styles";

interface CampaignProps {
  id: number;
  name: string;
  description: string;
  user_id: number;
}

interface CampaignFormData {
  name: string;
  description: string;
}

export default function Campaign() {
  const { user } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CampaignFormData>();

  const [campaigns, setCampaigns] = useState<CampaignProps[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadCampaigns() {
      try {
        setLoading(true);
        const response = await api.get<CampaignProps[]>("campaigns");
        setCampaigns(response.data);
      } catch (error) {
        console.error("Erro ao carregar campanhas:", error);
      } finally {
        setLoading(false);
      }
    }

    loadCampaigns();
  }, []);

  const onSubmit: SubmitHandler<CampaignFormData> = async (data) => {
    try {
      setLoading(true);
      const response = await api.post<CampaignProps>("campaigns", {
        name: data.name,
        description: data.description,
        user_id: user?.id,
      });

      setCampaigns((prevCampaigns) => [response.data, ...prevCampaigns]);
      reset();
    } catch (error) {
      console.error("Erro ao salvar campanha:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Styles.Container>
      <h2>Cadastro de Campanhas</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Styles.FormContainer>
          <div>
            <input
              {...register("name", { required: true })}
              placeholder="Informe o nome da Campanha"
            />
            {errors.name && <span>Essa informação é obrigatória</span>}
          </div>

          <div>
            <input
              {...register("description", { required: true })}
              placeholder="Informe uma breve descrição"
            />
            {errors.description && <span>Essa informação é obrigatória</span>}
          </div>

          <Button type="submit" loading={loading ? 1 : 0} TextButton="Gravar" />
        </Styles.FormContainer>
      </form>

      <Styles.ListItens>
        {campaigns.map((campaign) => (
          <ul key={campaign.id}>
            <li>{campaign.name.toUpperCase()}</li>
          </ul>
        ))}
      </Styles.ListItens>
    </Styles.Container>
  );
}
