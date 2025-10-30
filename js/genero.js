/**
 * Clase que representa un genero cinematográfico
 */

export class Genero {

    //propiedad estatica para llevar el control del ultimo id asignado
    static ultimoId = 0;

    /**
     * @param {string} nombre - Nombre del género
     */

    constructor (nombre) {
        this._id = ++Genero.ultimoId; //asignar un id unico autoincremental (no editable por el usuario)
        this.nombre = nombre; //asigna el nombre usando el setter
    }

    /**
     * ID del género (solo lectura)
     * @returns {number} ID del género
     */
    get id() {
        return this._id;
    }

    /**
     * Nombre del género
     * @returns {string} Nombre del género
     */
    get nombre() {
        return this._nombre;
    }

    /*
    *Establece el nombre del género con validación
    * @param {string} valor - Nuevo nombre del género
    */
    set nombre(valor) {
        if (typeof valor !== 'string' || valor.trim().length === 0 || valor.length > 100) {
            throw new Error('El nombre del género debe ser una cadena de texto no vacía con un máximo de 100 caracteres.');
        }
        this._nombre = valor.trim();
    }
}
