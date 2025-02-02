
export interface FilterState {
    indicator: string | null;
    year: number;
    month: string | number;
}

export interface IndicatorData {
    codigo: string;
    nombre: string;
    unidad_medida: string;
    serie: { fecha: string; valor: number }[];
  }