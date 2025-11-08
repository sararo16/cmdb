/**
 * Clase que representa un género cinematográfico
 * Cada género tiene un nombre y un ID único autoincremental.
 */

export class Genero {

    /**
     * Propiedad estatica para llevar el control del ultimo ID asignado.
     * Se incrementa automaticamente cada vez que se crea un nuevo genero
     * @type {number}
     */
    static ultimoId = 0;

    /**
     * Crea una nueva instancia de Genero
     * @param {string} nombre - Nombre del género
     * @throws {Error} Si el nombre no es válido
     */

    constructor (nombre) {
        this._id = ++Genero.ultimoId; //asignar un id unico autoincremental (no editable por el usuario)
        this.nombre = nombre; //asigna el nombre usando el setter
    }

    /**
     * obtiene el ID del género (solo lectura)
     * @returns {number} ID del género
     */
    get id() {
        return this._id; //Es un getter porque el ID no debe cambiar nunca
    }

    /**
     * Obtiene el Nombre del género
     * @returns {string} Nombre del género
     */
    get nombre() {
        return this._nombre;
    }

    /**
     * Establece el nombre del género con validación
     * @param {string} valor - Nuevo nombre del género
     * @throws {Error} Si el nombre no es válido
     */
    set nombre(valor) {
        if (typeof valor !== 'string' || valor.trim().length === 0 || valor.length > 100) {
            throw new Error('El nombre del género debe ser una cadena de texto no vacía con un máximo de 100 caracteres.');
        }
        this._nombre = valor.trim();
    }
}
