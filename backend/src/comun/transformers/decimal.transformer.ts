import { ValueTransformer } from 'typeorm';

export const decimalANumero: ValueTransformer = {
  to: (value) => value,
  from: (value) => (value === null || value === undefined ? value : Number(value)),
};
