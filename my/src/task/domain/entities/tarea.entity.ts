export class Tarea {
  private id: number;
  private titulo: string;
  private descripcion: string;
  private estado: string;
  private responsable: string;
  private fechaCreacion: Date;

  constructor(
    id: number,
    titulo: string,
    descripcion: string,
    estado: string,
    responsable: string,
    fechaCreacion: Date,
  ) {
    this.id = id;
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.estado = estado;
    this.responsable = responsable;
    this.fechaCreacion = fechaCreacion;
  }

  static crearNueva(
    titulo: string,
    descripcion: string,
    responsable: string,
  ): Omit<Tarea, 'id'> {
    const fechaCreacion = new Date();
    const estado = 'CREADA';

    return {
      titulo,
      descripcion,
      estado,
      responsable,
      fechaCreacion,
    } as any;
  }

  verificarEstado(estado: string) {
    switch (estado) {
      case 'CREADA':
        return 'CREADA';
      case 'EN_PROGRESO':
        return 'EN_PROGRESO';
      case 'FINALIZADA':
        return 'FINALIZADA';
      case 'BLOQUEADA':
        return 'BLOQUEADA';
      case 'CANCELADA':
        return 'CANCELADA';
      default:
        throw new Error('Estado no válido');
    }
  }

  getId() {
    return this.id;
  }

  getTitulo() {
    return this.titulo;
  }

  getDescripcion() {
    return this.descripcion;
  }

  getEstado() {
    return this.estado;
  }

  getResponsable() {
    return this.responsable;
  }

  getFechaCreacion() {
    return this.fechaCreacion;
  }

  setTitulo(nuevoTitulo: string) {
    this.titulo = nuevoTitulo;
  }

  setDescripcion(nuevaDescripcion: string) {
    this.descripcion = nuevaDescripcion;
  }

  setEstado(nuevoEstado: string) {
    this.estado = nuevoEstado;
  }

  setResponsable(nuevoResponsable: string) {
    this.responsable = nuevoResponsable;
  }
}
