/**
 * Módulo para guardar y cargar datos en LocalStorage
 */

//importamos las clases necesarias
import { Pelicula } from './pelicula.js';
import { Genero } from './genero.js';

//definimos las claves que se usaran en localstorage para guardar las peliculas y los generos
const CLAVE_PELICULAS = 'cmdb_peliculas';
const CLAVE_GENEROS = 'cmdb_generos';

/**
 * Inicializa los datos en localStorage si estan vacios
 * Carga generos y peliculas por defecto
 * @function
 * @returns {void}
 */
export function inicializarDatos() {
  //lee los generos guardados en localstorage si no hay nada devuelve null
    const generos = JSON.parse(localStorage.getItem('cmdb_generos') || '[]'); 
    if (generos.length === 0) {
      //si no hay nada crea generos iniciales con id y nombre
    const iniciales = ['Acción', 'Comedia', 'Drama', 'Ciencia Ficción'].map(nombre => {
      const g = new Genero(nombre);
      return { _id: g.id, nombre: g.nombre };
    });
    //guarda los generos en localStorage
    localStorage.setItem('cmdb_generos', JSON.stringify(iniciales));
    
  }

  //lee las peliculas guardadas
  const peliculas = JSON.parse(localStorage.getItem('cmdb_peliculas') || '[]');  //si el array esta vacio se cargan las peliculas por defecto
  if (peliculas.length === 0) {
    //creamos loas peliculas con sus generos asociados
    const iniciales = [
      new Pelicula ('Los mundos de Coraline', new Date('2009-02-06'), 8.0, [1, 4]),
      new Pelicula ('8 Mile', new Date('2002-11-08'), 7.1, [2, 3]),
      new Pelicula ('Pulp Fiction', new Date('1994-10-14'), 8.9, [1, 3]),
      new Pelicula ('Desayuno con diamantes', new Date('1961-10-05'), 8.5, [2, 3]),
      new Pelicula ('Eduardo Manostijeras', new Date('1990-12-07'), 7.9, [3, 4])
    ];
    //se guardan en usando la funcion
    guardarPeliculas(iniciales);
  }
}

/**
 * Guarda un array de películas en LocalStorage (solo datos planos)
 * @function
 * @param {Pelicula[]} peliculas
 * @returns {void}
 */
export function guardarPeliculas(peliculas) {
  //convierte cada pelicula en un objeto plano para guardarlo como JSON
  const datos = peliculas.map(p => ({
    _id: p.id,
    titulo: p.titulo,
    fechaEstreno: p.fechaEstreno.toISOString(),
    popularidad: p.popularidad,
    generos: p.generos,
    _puntuaciones: p.puntuaciones
  }));
  //se guardan los datos en localstorage
  localStorage.setItem(CLAVE_PELICULAS, JSON.stringify(datos));
}

/**
 * Carga las películas desde LocalStorage y reconstruye instancias
 * @function
 * @returns {Pelicula[]}
 */
export function cargarPeliculas() {
  const json = localStorage.getItem(CLAVE_PELICULAS);
  //si no hay peliculas devuelve un array vacio
  if (!json) return [];

  //intnenta convertir el JSON en objetos javascript
  try {
    const datos = JSON.parse(json);
    //reconstruye cada pelicula como instancia de la clase pelicula,se asigna manualmente el is y las puntuaciones ya 
    //que el constructor no lo hace
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

    //actualiza el contador global de IDs para evitar duplicados
    const maxId = Math.max(...datos.map(p => p._id));
    Pelicula.ultimoId = maxId;
    
    //si hay error, borra los datos corruptos y devuelve una lista vacia
    return reconstruidas;
  } catch (error) {
    console.error('Error al cargar películas:', error);
    localStorage.removeItem(CLAVE_PELICULAS);
    return [];
  }
}

/**
 * Guarda un array de géneros en LocalStorage (solo datos planos)
 * @function
 * @param {Genero[]} generos
 * @returns {void}
 */
//convierte los generos en datos planos y los guarda en localstorage
export function guardarGeneros(generos) {
  const datos = generos.map(g => ({
    _id: g.id,
    nombre: g.nombre
  }));
  localStorage.setItem(CLAVE_GENEROS, JSON.stringify(datos));
}

/**
 * Carga los géneros desde LocalStorage y reconstruye instancias
 * @function
 * @returns {Genero[]}
 */
//recupera los generos guardados
export function cargarGeneros() {
  const json = localStorage.getItem(CLAVE_GENEROS);
  if (!json) return [];
  //reconstruye cada genero como instancia de la clase genero
  try {
    const datos = JSON.parse(json);

    const reconstruidos = datos.map(g => {
      const genero = new Genero(g.nombre);
      genero._id = g._id;
      return genero;
    });
    //si hay error, borra los datos corruptos y devuelve una lista vacia
    const maxId = Math.max(...datos.map(g => g._id));
    Genero.ultimoId = maxId;

    return reconstruidos;
  } catch (error) {
    console.error('Error al cargar géneros:', error);
    localStorage.removeItem(CLAVE_GENEROS);
    return [];
  }
}
