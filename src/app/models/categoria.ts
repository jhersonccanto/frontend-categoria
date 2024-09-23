export class Categoria {
    id:number;
    nombre:string;
    estado:string;
    constructor(id: number = 0, nombre: string = '', estado: string = '1') {
      this.id = id;
      this.nombre = nombre;
      this.estado = estado;
    }
}
