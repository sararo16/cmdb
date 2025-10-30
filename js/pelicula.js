/* Clase que representa una película en la base de datos */

export class Pelicula {
    //propiedad estatica para llevar el control del ultimo id asignado
    static ultimoId = 0;

    //constructor de la clase Pelicula
    /**
    * @param {string} titulo - Título de la película
    * @param {Date} fechaEstreno - Fecha de estreno
    * @param {number} popularidad - Valor entre 0 y 100
    * @param {number[]} generos - Array de IDs de generos asociados
    */
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

    //id solo lectura
    get id(){
        return this._id;
    }

    //getter y setter del titulo
    get titulo(){
        return this._titulo;
    }

    set titulo(valor){
        if (typeof valor !== 'string' || valor.length > 100) {
            throw new Error('El título debe ser una cadena de texto con un máximo de 100 caracteres.');
        }
        this._titulo = valor.trim(); //elimina espacios en blanco innecesarios
    }

    //getter y setter de la fecha de estreno
    get fechaEstreno(){
        return this._fechaEstreno;
    }   
    set fechaEstreno(fecha){
        const hoy = new Date();
        const limite=new  Date ('1900-01-01');
        //valida que sea una fecha valida y dentro del rango permitido
        if (!(fecha instanceof Date) || fecha<limite || fecha>hoy) {
            throw new Error ('La fecha debe estar entre el 01/01/1900 y la fecha actual.');
        }
        this._fechaEstreno = fecha;
    }

    //getter y setter de la popularidad
    get popularidad(){
        return this._popularidad;
    }
    set popularidad(valor){
        //valida que sea un numero entre 0 y 100
        if (typeof valor !== 'number' || valor < 0 || valor > 100) {
            throw new Error('La popularidad debe ser un número entre 0 y 100.');
        }
        this._popularidad = valor;
    }
    //getter y setter de los generos
    get generos(){
        return this._generos;
    }
    set generos(lista){
        if (!Array.isArray(lista)|| !lista.every(id => Number.isInteger(id) && id > 0)) {
            throw new Error('La lista debe de ser un array de IDs númericos positivos.');
        }
        this._generos = lista;
    }
    //getter para acceder al array de las puntuaciones
    get puntuaciones(){
        return this._puntuaciones;
    }
    //añadimos una puntuacion valida al array
    /** @param {number} valor - Valor de la puntuación entre 0 y 10
     */
    votar (valor){
        if (!Number.isInteger(valor) || valor < 0 || valor > 10) {
            throw new Error('La puntuación debe ser un número entero entre 0 y 10.');
        }
        this._puntuaciones.push(valor);
    }

    //calcula y devuelve la puntuacion media de la pelicula
     /** @returns {number|string } media redondeada o '-'*/

     get puntuacion (){
        if (this._puntuaciones.length === 0) return '-';
        const suma = this._puntuaciones.reduce((a, b) => a + b, 0);
        return Math.round(suma / this._puntuaciones.length);
     }

     //devuelve el numero total de votos
     /** @returns {number} total de puntuaciones registradas */
     get numeroVotos (){
        return this._puntuaciones.length;
     }
}