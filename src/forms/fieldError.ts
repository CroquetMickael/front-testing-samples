import { MessageTypes } from "@axa-fr/canopee-react/distributeur";
import type { FieldError } from "react-hook-form";

/** Maps a react-hook-form error to the AXA Field message props. */
export const fieldError = (error?: FieldError) =>
  error
    ? { message: error.message, messageType: MessageTypes.error, forceDisplayMessage: true }
    : {};

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PHONE_PATTERN = /^0[1-9](\s?\d{2}){4}$/;
export const POSTAL_CODE_PATTERN = /^\d{5}$/;

export const isPastDate = (value: string) => !value || new Date(value) <= new Date();

export const todayIso = () => new Date().toISOString().slice(0, 10);
