/**
 * Módulo para guardar y cargar datos en LocalStorage
 */

import { Pelicula } from './pelicula.js';
import { Genero } from './genero.js';

const CLAVE_PELICULAS = 'cmdb_peliculas';
const CLAVE_GENEROS = 'cmdb_generos';

export function inicializarDatos() {
  if (!localStorage.getItem('cmdb_peliculas')) {
    localStorage.setItem('cmdb_peliculas', '[]');
  }
  if (!localStorage.getItem('cmdb_generos')) {
    localStorage.setItem('cmdb_generos', '[]');
  }

  // Si no hay géneros, cargar algunos por defecto
  const generos = JSON.parse(localStorage.getItem('cmdb_generos'));
  if (generos.length === 0) {
    const iniciales = ['Acción', 'Comedia', 'Drama', 'Ciencia Ficción'].map(nombre => {
      const g = new Genero(nombre);
      return { _id: g.id, nombre: g.nombre };
    });
    localStorage.setItem('cmdb_generos', JSON.stringify(iniciales));
  }
}

/**
 * Guarda un array de películas en LocalStorage (solo datos planos)
 * @param {Pelicula[]} peliculas
 */
export function guardarPeliculas(peliculas) {
  const datos = peliculas.map(p => ({
    _id: p.id,
    titulo: p.titulo,
    fechaEstreno: p.fechaEstreno.toISOString(),
    popularidad: p.popularidad,
    generos: p.generos,
    _puntuaciones: p.puntuaciones
  }));
  localStorage.setItem(CLAVE_PELICULAS, JSON.stringify(datos));
}

/**
 * Carga las películas desde LocalStorage y reconstruye instancias
 * @returns {Pelicula[]}
 */
export function cargarPeliculas() {
  const json = localStorage.getItem(CLAVE_PELICULAS);
  if (!json) return [];

  try {
    const datos = JSON.parse(json);

    const reconstruidas = datos.map(p => {
      const pelicula = new Pelicula(
        p.titulo,
        new Date(p.fechaEstreno),
        p.popularidad,
        p.generos
      );
      pelicula._id = p._id;
      pelicula._puntuaciones = p._puntuaciones;
      return pelicula;
    });

    const maxId = Math.max(...datos.map(p => p._id));
    Pelicula.ultimoId = maxId;

    return reconstruidas;
  } catch (error) {
    console.error('Error al cargar películas:', error);
    localStorage.removeItem(CLAVE_PELICULAS);
    return [];
  }
}

/**
 * Guarda un array de géneros en LocalStorage (solo datos planos)
 * @param {Genero[]} generos
 */
export function guardarGeneros(generos) {
  const datos = generos.map(g => ({
    _id: g.id,
    nombre: g.nombre
  }));
  localStorage.setItem(CLAVE_GENEROS, JSON.stringify(datos));
}

/**
 * Carga los géneros desde LocalStorage y reconstruye instancias
 * @returns {Genero[]}
 */
export function cargarGeneros() {
  const json = localStorage.getItem(CLAVE_GENEROS);
  if (!json) return [];

  try {
    const datos = JSON.parse(json);

    const reconstruidos = datos.map(g => {
      const genero = new Genero(g.nombre);
      genero._id = g._id;
      return genero;
    });

    const maxId = Math.max(...datos.map(g => g._id));
    Genero.ultimoId = maxId;

    return reconstruidos;
  } catch (error) {
    console.error('Error al cargar géneros:', error);
    localStorage.removeItem(CLAVE_GENEROS);
    return [];
  }
}
