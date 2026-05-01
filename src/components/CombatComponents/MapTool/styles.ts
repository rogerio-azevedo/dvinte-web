import styled, { css } from 'styled-components'
import { darken } from 'polished'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  h2 {
    margin-top: 20px;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100%;
  margin-top: 12px;

  @media (min-width: 360px) {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: stretch;
    justify-content: stretch;
    gap: 0.5rem;
  }
`

const buttonBase = css`
  flex: 1;
  min-width: 120px;
  min-height: 40px;
  text-align: center;
  font-weight: 600;
  font-size: 13px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.15s ease, color 0.15s ease, box-shadow 0.15s ease;
  padding: 0 12px;

  &:disabled {
    opacity: 0.55;
    cursor: not-allowed;
  }
`

export const ButtonPrimary = styled.button`
  ${buttonBase};
  border: none;
  background: #8e0e00;
  color: #fafaf9;

  &:hover:not(:disabled) {
    background: ${darken(0.06, '#8e0e00')};
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.12);
  }
`

export const ButtonSecondary = styled.button`
  ${buttonBase};
  background: white;
  color: #334155;
  border: 1px solid #d6d3d1;

  &:hover:not(:disabled) {
    background: #fafaf9;
    border-color: #a8a29e;
  }
`

const inputBase = css`
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  border: 1px solid #e7e5e4;
  border-radius: 8px;
  height: 38px;
  padding: 0 12px;
  color: #1e293b;
  font-weight: 400;
  font-size: 14px;
  margin-top: 6px;
  background: #fff;
  outline: none;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus-visible {
    border-color: #8e0e00;
    box-shadow: 0 0 0 3px rgba(142, 14, 0, 0.12);
  }
`

export const InputContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;

  padding-bottom: 14px;

  &:last-child {
    padding-bottom: 0;
  }

  > div {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  label {
    font-size: 12px;
    font-weight: 600;
    color: #57534e;
    letter-spacing: 0.01em;
    line-height: 1.3;
  }
`

export const InputLarge = styled.input`
  ${inputBase};
`

export const InputMed = styled.input`
  ${inputBase};
`

export const InputShort = styled.input`
  ${inputBase};
`

export const RangeInput = styled.input`
  width: 100%;
  max-width: 100%;
  height: 6px;
  border-radius: 5px;
  background: #e7e5e4;
  outline: none;
  margin-top: 10px;
  cursor: pointer;

  accent-color: #8e0e00;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #8e0e00;
    cursor: pointer;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2);

    &:hover {
      background: ${darken(0.06, '#8e0e00')};
    }
  }

  &::-moz-range-thumb {
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #8e0e00;
    cursor: pointer;
    border: none;
    box-shadow: 0 1px 3px rgba(15, 23, 42, 0.2);

    &:hover {
      background: ${darken(0.06, '#8e0e00')};
    }
  }
`

export const SelectMed = styled.select`
  ${inputBase};
`

export const PanelSection = styled.section`
  background: white;
  border: 1px solid #e7e5e4;
  border-radius: 10px;
  padding: 14px;
  margin-bottom: 12px;
  box-shadow: 0 1px 2px rgba(15, 23, 42, 0.05);
`

export const SectionHeading = styled.h3`
  margin: 0 0 14px;
  padding-bottom: 8px;
  border-bottom: 1px solid #f5f5f4;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #78716c;
`

export const ToggleRow = styled.div`
  display: flex;
  flex-wrap: nowrap;
  align-items: stretch;
  gap: 6px;

  margin-top: 14px;

  label {
    display: block;
    font-size: 11px;
    font-weight: 600;
    color: #57534e;
    line-height: 1.2;
  }
`

export const ToggleCell = styled.div`
  flex: 1 1 0;
  min-width: 0;

  label {
    margin-bottom: 6px;
  }
`
