/**
 * Clase que representa una película en la base de datos
 * Cada pelicula tiene un ID unico, titulo, fecha de estreno, popularidad y generos
 * @class
*/

export class Pelicula {
    /**
     * Propiedad estatica para llevar el control del ultimo ID asignado
     * Se incrementa automaticamente con cada nueva pelicula
     * @type {number}
     */
    static ultimoId = 0;

    
    /**
     * Crea una nueva instancia de pelicula
     * @constructor
    * @param {string} titulo - Título de la película
    * @param {Date} fechaEstreno - Fecha de estreno
    * @param {number} popularidad - Valor entre 0 y 100
    * @param {number[]} generos - Array de IDs de generos asociados
    * @throws {Error} Si algun dato no cumple las validaciones
    */
   //define los datos que se deben proporcionar al crear una pelicula
    constructor (titulo, fechaEstreno, popularidad, generos=[]) {
        this._id = ++Pelicula.ultimoId; //asignar un id unico autoincremental (no editable por el usuario)

        //asgina valores usando los setters
        this.titulo = titulo;
        this.fechaEstreno = fechaEstreno;
        this.popularidad = popularidad;
        this.generos = generos;
    
    //iniciamos el array de puntuaciones vacio
    this._puntuaciones = [];
    }

    /**
     * obtiene el id de la pelicula (solo lectura)
     * @returns {number} ID unico de la pelicula
     */
    get id(){
        return this._id;
    }

    /**
        * Obtiene el título de la película.
        * @returns {string} Título de la película.
    */    
    get titulo(){
        return this._titulo;
    }
    /**
        * Establece el título de la película con validación.
        * @param {string} valor - Título nuevo (máximo 100 caracteres).
        * @throws {Error} Si el título no es válido.
   */
    set titulo(valor){
        //validacion del titulo que sea tecto y no supere los 100 caracteres
        if (typeof valor !== 'string' || valor.length > 100) {
            throw new Error('El título debe ser una cadena de texto con un máximo de 100 caracteres.');
        }
        this._titulo = valor.trim(); //elimina espacios en blanco innecesarios
    }

    /**
        * Obtiene la fecha de estreno.
        * @returns {Date} Fecha de estreno.
   */    
    get fechaEstreno(){
        return this._fechaEstreno;
    }   

    /**
   * Establece la fecha de estreno con validación.
   * @param {Date} fecha - Fecha válida entre 1900 y hoy.
   * @throws {Error} Si la fecha no es válida.
   */
    set fechaEstreno(fecha){
        const hoy = new Date();
        //creamos una constante para determinar el limite de fecha valida
        const limite=new  Date ('1900-01-01');
        //valida que sea una fecha valida y dentro del rango permitido
        if (!(fecha instanceof Date) || fecha<limite || fecha>hoy) {
            throw new Error ('La fecha debe estar entre el 01/01/1900 y la fecha actual.');
        }
        this._fechaEstreno = fecha;
    }

    /**
   * Obtiene la popularidad de la película.
   * @returns {number} Valor entre 0 y 100.
   */
      get popularidad(){
        return this._popularidad;
    }

    /**
   * Establece la popularidad con validación.
   * @param {number} valor - Número entre 0 y 100.
   * @throws {Error} Si el valor no es válido.
   */
    set popularidad(valor){
        //valida que sea un numero entre 0 y 100
        if (typeof valor !== 'number' || valor < 0 || valor > 100) {
            throw new Error('La popularidad debe ser un número entre 0 y 100.');
        }
        this._popularidad = valor;
    }
    /**
   * Obtiene la lista de géneros asociados.
   * @returns {number[]} Array de IDs de géneros.
   */
      get generos(){
        return this._generos;
    }
    /**
   * Establece los géneros con validación.
   * @param {number[]} lista - Array de IDs numéricos positivos.
   * @throws {Error} Si la lista no es válida.
   */
    set generos(lista){
        //validacion que el array sea de numeros enteros positivos
        if (!Array.isArray(lista)|| !lista.every(id => Number.isInteger(id) && id > 0)) {
            throw new Error('La lista debe de ser un array de IDs númericos positivos.');
        }
        this._generos = lista;
    }

    /**
   * Obtiene el array de puntuaciones registradas.
   * @returns {number[]} Array de puntuaciones.
   */
      get puntuaciones(){
        return this._puntuaciones;
    }
    /**
     * añadimos una puntuacion valida a la pelicula
     * @param {number} valor -Numero entero entre 0 y 10
     * @throws {Error} Si la puntuacion no es valida
     */
    votar (valor){
        //validacion de que el numero sea entre 0 y 10
        if (!Number.isInteger(valor) || valor < 0 || valor > 10) {
            throw new Error('La puntuación debe ser un número entero entre 0 y 10.');
        }
        this._puntuaciones.push(valor);
    }

    /**
   * Calcula y devuelve la puntuación media redondeada.
   * @returns {number|string} Media redondeada o '-' si no hay votos.
   */
     get puntuacion (){
        //si no hay votos devuelve '-'
        if (this._puntuaciones.length === 0) return '-';
        const suma = this._puntuaciones.reduce((a, b) => a + b, 0);
        return Math.round(suma / this._puntuaciones.length);
     }

     /**
   * Devuelve el número total de votos registrados.
   * @returns {number} Total de puntuaciones.
   */
     get numeroVotos (){
        return this._puntuaciones.length;
     }
}