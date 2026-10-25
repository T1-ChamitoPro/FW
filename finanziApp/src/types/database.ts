export type TipoTransaccion = 'INGRESO' | 'EGRESO';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  correo: string;
  limite_presupuesto: number;
  created_at?: string;
}

export interface Categoria {
  idCategoria: number;
  nombre: string;
  tipo: TipoTransaccion;
}

export interface Transaccion {
  idTransaccion: number;
  monto: number;
  descripcion: string | null;
  fecha: string;
  idUsuario: number;
  idCategoria: number;
  categoria?: Categoria;
  CATEGORIA?: Categoria // Relación para join de datos
  created_at?: string;
}

export interface NuevaTransaccionDTO {
  monto: number;
  descripcion: string;
  fecha: string;
  idCategoria: number;
  tipo: TipoTransaccion;
}