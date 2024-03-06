import { Sexo } from '../enums/register.enum';

export interface IUsuarioUpdate {
  id?: number;
  avatar: string;
  userName: string;
  nombre: string;
  email: string;
  primerApellido: string;
  segundoApellido: string;
  sexo: Sexo;
  edad: number;
  peso: number;
  altura: number;
  actividad: string;
  tipoDiabetes: string;
  medicacion: string[];
  usuarioMedicacions?: any[];

  insulina: boolean;
}
