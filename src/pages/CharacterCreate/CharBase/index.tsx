/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useRef, useCallback, useState } from "react";
import { useAuth } from "../../../contexts";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router";
import { toast } from "react-toastify";

import { useCharacterCreation } from "../../../contexts";
import api from "../../../services/api";

import SelectAlignment from "../../../components/SelectAlignment";
import SelectDivinity from "../../../components/SelectDivinity";
import SelectRace from "../../../components/SelectRace";
import SelectLevel from "../../../components/SelectLevel";
import SelectGender from "../../../components/SelectGender";
import SelectSize from "../../../components/SelectSize";

import ButtonPrev from "../../../components/ButtonPrev";
import ButtonNext from "../../../components/ButtonNext";

import * as Styles from "./styles";

interface FormData {
  name: string;
  age: string;
  height: string;
  weight: string;
  hair: string;
  eye: string;
  skin: string;
  level: string;
  size: string;
  gender: string;
  divinity: string;
  alignment: string;
  race: string;
  is_ativo: boolean;
  user_id: number;
}

interface Option {
  value: string;
  label: string;
}

export default function CharBase() {
  const { state, actions } = useCharacterCreation();

  // Dados do usuário ainda vêm do Redux
  const { user } = useAuth();
  const userId = user?.id;

  const formRef = useRef<HTMLFormElement | null>(null);

  // Estados para carregar dados dos selects
  const [alignments, setAlignments] = useState<Option[]>([]);
  const [races, setRaces] = useState<Option[]>([]);
  const [divinities, setDivinities] = useState<Option[]>([]);
  const [levels, setLevels] = useState<Option[]>([]);
  const [genders, setGenders] = useState<Option[]>([]);
  const [sizes, setSizes] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
    watch,
    reset,
  } = useForm<FormData>({
    defaultValues: {
      name: "",
      age: "",
      height: "",
      weight: "",
      hair: "",
      eye: "",
      skin: "",
      level: "",
      size: "",
      gender: "",
      divinity: "",
      alignment: "",
      race: "",
      is_ativo: true,
      user_id: userId,
    },
    mode: "onChange",
  });

  // Carregar dados dos selects
  const loadSelectData = useCallback(async () => {
    try {
      setLoading(true);

      const [
        alignmentsRes,
        racesRes,
        divinitiesRes,
        levelsData,
        gendersData,
        sizesData,
      ] = await Promise.all([
        api.get("/alignments"),
        api.get("/races"),
        api.get("/divinities"),
        // Criar dados estáticos para level, gender e size
        Promise.resolve({
          data: Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            name: `${i + 1}`,
          })),
        }),
        Promise.resolve({
          data: [
            { id: "M", name: "Masculino" },
            { id: "F", name: "Feminino" },
            { id: "N", name: "Não-binário" },
          ],
        }),
        Promise.resolve({
          data: [
            { id: "Minúsculo", name: "Minúsculo" },
            { id: "Diminuto", name: "Diminuto" },
            { id: "Miúdo", name: "Miúdo" },
            { id: "Pequeno", name: "Pequeno" },
            { id: "Médio", name: "Médio" },
            { id: "Grande", name: "Grande" },
            { id: "Enorme", name: "Enorme" },
            { id: "Imenso", name: "Imenso" },
            { id: "Colossal", name: "Colossal" },
          ],
        }),
      ]);

      // Converter dados para formato Option
      setAlignments(
        alignmentsRes.data.map((item: any) => ({
          value: item.id.toString(),
          label: item.name,
        }))
      );

      setRaces(
        racesRes.data.map((item: any) => ({
          value: item.id.toString(),
          label: item.name,
        }))
      );

      setDivinities(
        divinitiesRes.data.map((item: any) => ({
          value: item.id.toString(),
          label: item.name,
        }))
      );

      setLevels(
        levelsData.data.map((item: any) => ({
          value: item.id.toString(),
          label: item.name,
        }))
      );

      setGenders(
        gendersData.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        }))
      );

      setSizes(
        sizesData.data.map((item: any) => ({
          value: item.id,
          label: item.name,
        }))
      );
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar dados dos selects");
    } finally {
      setLoading(false);
    }
  }, []);

  // Carregar dados dos selects quando componente monta
  useEffect(() => {
    loadSelectData();
  }, [loadSelectData]);

  // Carregar dados do contexto quando componente monta OU quando state.base muda
  useEffect(() => {
    if (
      state.base &&
      Object.keys(state.base).some(
        (key) => state.base[key as keyof typeof state.base]
      )
    ) {
      reset({
        ...state.base,
        is_ativo: true,
        user_id: userId,
      });
    }
  }, [state.base, reset, userId]); // Incluir state.base para recarregar quando mudar

  // Função para salvar dados no contexto (só quando clica Next)
  const onSubmit = useCallback(
    (data: FormData) => {
      actions.setBaseData(data);
      toast.success("Dados básicos salvos com sucesso!");
    },
    [actions]
  );

  const handleSave = useCallback(() => {
    // Em vez de dispatch event, vamos pegar os dados atuais e chamar onSubmit diretamente
    const formData = watch(); // Pega todos os dados atuais do formulário

    // Validar se campos obrigatórios estão preenchidos
    const requiredFields = [
      "name",
      "age",
      "height",
      "weight",
      "hair",
      "eye",
      "skin",
      "level",
      "size",
      "gender",
      "alignment",
      "race",
      "divinity",
    ];
    const emptyFields = requiredFields.filter(
      (field) => !formData[field as keyof FormData]
    );

    if (emptyFields.length > 0) {
      toast.error(`Preencha os campos obrigatórios: ${emptyFields.join(", ")}`);
      return;
    }

    // Se tudo estiver preenchido, salvar
    onSubmit(formData as FormData);
  }, [watch, onSubmit]);

  if (loading) {
    return (
      <Styles.Container>
        <div style={{ textAlign: "center", padding: "50px" }}>
          <p>Carregando dados...</p>
        </div>
      </Styles.Container>
    );
  }

  return (
    <Styles.Container>
      <ButtonPrev linkto="/charactercreate" display="show" />

      <Styles.ContentContainer>
        <h1>Cadastro de Personagem - DADOS BÁSICOS</h1>
        <Styles.FormContainer>
          <form onSubmit={handleSubmit(onSubmit)} ref={formRef}>
            <Styles.InputContainer>
              <div>
                <label htmlFor="name">Nome</label>
                <Styles.InputLarge
                  {...register("name", {
                    required: "Essa informação é obrigatória",
                    minLength: {
                      value: 2,
                      message: "Nome deve ter pelo menos 2 caracteres",
                    },
                  })}
                  placeholder="Nome"
                />
                {errors.name && <span>{errors.name.message}</span>}
              </div>

              <div>
                <label htmlFor="age">Idade</label>
                <Styles.InputMed
                  {...register("age", {
                    required: "Essa informação é obrigatória",
                    pattern: {
                      value: /^\d+$/,
                      message: "Idade deve ser um número",
                    },
                  })}
                  placeholder="Idade"
                />
                {errors.age && <span>{errors.age.message}</span>}
              </div>

              <div>
                <label htmlFor="height">Altura</label>
                <Styles.InputMed
                  {...register("height", {
                    required: "Essa informação é obrigatória",
                  })}
                  placeholder="Altura"
                />
                {errors.height && <span>{errors.height.message}</span>}
              </div>

              <div>
                <label htmlFor="weight">Peso</label>
                <Styles.InputMed
                  {...register("weight", {
                    required: "Essa informação é obrigatória",
                  })}
                  placeholder="Peso"
                />
                {errors.weight && <span>{errors.weight.message}</span>}
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="skin">Pele</label>
                <Styles.InputLarge
                  {...register("skin", {
                    required: "Essa informação é obrigatória",
                  })}
                  placeholder="Pele"
                />
                {errors.skin && <span>{errors.skin.message}</span>}
              </div>
              <div>
                <label htmlFor="eye">Olhos</label>
                <Styles.InputLarge
                  {...register("eye", {
                    required: "Essa informação é obrigatória",
                  })}
                  placeholder="Olhos"
                />
                {errors.eye && <span>{errors.eye.message}</span>}
              </div>
              <div>
                <label htmlFor="hair">Cabelos</label>
                <Styles.InputLarge
                  {...register("hair", {
                    required: "Essa informação é obrigatória",
                  })}
                  placeholder="Cabelos"
                />
                {errors.hair && <span>{errors.hair.message}</span>}
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="level">Level</label>
                <Controller
                  name="level"
                  control={control}
                  rules={{ required: "Level é obrigatório" }}
                  render={({ field }) => (
                    <SelectLevel
                      value={field.value}
                      changeLevel={field.onChange}
                      levels={levels}
                    />
                  )}
                />
                {errors.level && <span>{errors.level.message}</span>}
              </div>

              <div>
                <label htmlFor="size">Tamanho</label>
                <Controller
                  name="size"
                  control={control}
                  rules={{ required: "Tamanho é obrigatório" }}
                  render={({ field }) => (
                    <SelectSize
                      value={field.value}
                      changeSize={field.onChange}
                      sizes={sizes}
                    />
                  )}
                />
                {errors.size && <span>{errors.size.message}</span>}
              </div>

              <div>
                <label htmlFor="gender">Sexo</label>
                <Controller
                  name="gender"
                  control={control}
                  rules={{ required: "Sexo é obrigatório" }}
                  render={({ field }) => (
                    <SelectGender
                      value={field.value}
                      changeGender={field.onChange}
                      genders={genders}
                    />
                  )}
                />
                {errors.gender && <span>{errors.gender.message}</span>}
              </div>
            </Styles.InputContainer>

            <Styles.InputContainer>
              <div>
                <label htmlFor="alignment">Alinhamento</label>
                <Controller
                  name="alignment"
                  control={control}
                  rules={{ required: "Alinhamento é obrigatório" }}
                  render={({ field }) => (
                    <SelectAlignment
                      value={field.value}
                      changeAlignment={field.onChange}
                      alignments={alignments}
                    />
                  )}
                />
                {errors.alignment && <span>{errors.alignment.message}</span>}
              </div>

              <div>
                <label htmlFor="race">Raça</label>
                <Controller
                  name="race"
                  control={control}
                  rules={{ required: "Raça é obrigatória" }}
                  render={({ field }) => (
                    <SelectRace
                      value={field.value}
                      changeRace={field.onChange}
                      races={races}
                    />
                  )}
                />
                {errors.race && <span>{errors.race.message}</span>}
              </div>

              <div>
                <label htmlFor="divinity">Divindade</label>
                <Controller
                  name="divinity"
                  control={control}
                  rules={{ required: "Divindade é obrigatória" }}
                  render={({ field }) => (
                    <SelectDivinity
                      value={field.value}
                      changeDivinity={field.onChange}
                      divinities={divinities}
                    />
                  )}
                />
                {errors.divinity && <span>{errors.divinity.message}</span>}
              </div>
            </Styles.InputContainer>
          </form>
        </Styles.FormContainer>

        <Styles.DivPage>
          <Link to="charactercreate">
            <Styles.Page />
          </Link>

          <Link to="charbase">
            <Styles.ActivePage />
          </Link>

          <Link to="charclass">
            <Styles.Page />
          </Link>

          <Link to="charattributes">
            <Styles.Page />
          </Link>

          <Link to="charpreview">
            <Styles.Page />
          </Link>
        </Styles.DivPage>
      </Styles.ContentContainer>

      <ButtonNext linkto="/charclass" display="show" handleSave={handleSave} />
    </Styles.Container>
  );
}
