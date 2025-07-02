/* eslint-disable no-console */

import React, { useState } from "react";
import { toast } from "react-toastify";

import api from "../../../services/api";

import * as Styles from "./styles";
import { useAuth } from "../../../contexts";

type DiceSides = 4 | 6 | 8 | 10 | 12 | 20;

export default function Dices() {
  const [multiplier, setMultiplier] = useState<number>(1);
  const { user } = useAuth();

  const handleCalculateTotal = async (sides: DiceSides): Promise<void> => {
    try {
      let calc = 0;
      const random = (): number => {
        return Math.floor(Math.random() * sides) + 1;
      };

      const validMultiplier = Math.max(1, Math.min(10, multiplier));

      for (let i = 0; i < validMultiplier; i++) {
        calc += random();
      }

      const rolled = `Rolou ${validMultiplier} x d${sides} com resultado: ${calc}`;

      if (!user) {
        throw new Error("User not authenticated");
      }

      await api.post("combats", {
        id: user.id,
        user_id: user.id,
        user: user.name,
        message: rolled,
        result: calc,
        type: 2,
      });
    } catch (error) {
      console.error("Erro ao enviar rolagem de dados:", error);
      toast.error("Erro ao enviar rolagem de dados");
    }
  };

  const handleMultiplierChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value)) {
      setMultiplier(1);
    } else {
      setMultiplier(Math.max(1, Math.min(10, value)));
    }
  };

  return (
    <Styles.Container>
      <h2>Rolagem de Dados</h2>
      <Styles.InputMulti
        className="multiplier"
        type="number"
        min="1"
        max="10"
        placeholder="1"
        value={multiplier}
        onChange={handleMultiplierChange}
      />
      <Styles.DiceContainer>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(4);
          }}
        >
          <strong>d4</strong>
        </Styles.Dice>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(6);
          }}
        >
          <strong>d6</strong>
        </Styles.Dice>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(8);
          }}
        >
          <strong>d8</strong>
        </Styles.Dice>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(10);
          }}
        >
          <strong>d10</strong>
        </Styles.Dice>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(12);
          }}
        >
          <strong>d12</strong>
        </Styles.Dice>
        <Styles.Dice
          onClick={() => {
            handleCalculateTotal(20);
          }}
        >
          <strong>d20</strong>
        </Styles.Dice>
      </Styles.DiceContainer>
    </Styles.Container>
  );
}
