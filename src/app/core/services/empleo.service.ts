import { Injectable } from '@angular/core';
import { EMPLEOS } from '../../shared/utils/empleos';
import { OptionItem } from '../interfaces/option.interface';

@Injectable({
  providedIn: 'root',
})
export class EmpleoService {
  private empleos = EMPLEOS;

buscarEmpleos(
  palabraClave: string = '',
  ubicacion: string = '',
  filtros: Record<string, OptionItem> = {}
) {
  const keyword = palabraClave.toLowerCase().trim();
  const location = ubicacion.toLowerCase().trim();

  return this.empleos.filter((empleo) => {
    const matchKeyword =
      keyword === '' ||
      empleo.cargo.toLowerCase().includes(keyword) ||
      empleo.empresa.toLowerCase().includes(keyword) ||
      empleo.modalidad.toLowerCase().includes(keyword) ||
      empleo.jornada.toLowerCase().includes(keyword);

    const matchUbicacion =
      location === '' ||
      empleo.ubicacion.ciudad.toLowerCase().includes(location) ||
      empleo.ubicacion.provincia.toLowerCase().includes(location) ||
      empleo.ubicacion.pais.toLowerCase().includes(location);

    const matchFiltros = Object.entries(filtros).every(([filtroNombre, opcion]) => {
      const valor = opcion.value?.toLowerCase() ?? '';
      const texto = opcion.text?.toLowerCase() ?? '';

      switch (filtroNombre.toLowerCase()) {
        case 'modalidad':
          return empleo.modalidad.toLowerCase() === texto;

        case 'jornada':
          return empleo.jornada.toLowerCase() === texto;

        case 'salario': {
          const salarioEmpleo = parseInt(empleo.salario.replace(/[^\d]/g, ''));
          if (valor.startsWith('gt_')) {
            const min = parseInt(valor.replace('gt_', ''));
            return salarioEmpleo > min;
          } else if (valor.startsWith('lt_')) {
            const max = parseInt(valor.replace('lt_', ''));
            return salarioEmpleo >= max;
          } else if (valor.includes('_')) {
            const [min, max] = valor.split('_').map(Number);
            return salarioEmpleo >= min && salarioEmpleo <= max;
          } else {
            const exacto = parseInt(texto.replace(/[^\d]/g, ''));
            return salarioEmpleo === exacto;
          }
        }

        case 'experiencia': {
          const experienciaEmpleo = parseInt(empleo.experiencia.replace(/[^\d]/g, ''));
          if (valor === '3_plus') {
            return experienciaEmpleo > 1;
          } else if (valor === '1_3') {
            return experienciaEmpleo >= 1 && experienciaEmpleo <= 3;
          } else if (valor === 'none') {
            return experienciaEmpleo === 0;
          } else {
            return true;
          }
        }

        case 'ordenar':
          return true;

        default:
          return true;
      }
    });

    return matchKeyword && matchUbicacion && matchFiltros;
  });
}


}
