/** 
 * Modulo para guardar y cargar datos en LocalStorage
 */

const CLAVE_PELICULAS = 'cmdb_peliculas';
const CLAVE_GENEROS = 'cmdb_generos';

/**
 * Guarda un array de películas en LocalStorage
 * @param {Pelicula[]} peliculas - Array de objetos Pelicula
 */

export function guardarPeliculas(peliculas) {
    const json = JSON.stringify(peliculas);
    localStorage.setItem(CLAVE_PELICULAS, json);
}

/**
 * Carga las peliculas desde LocalStorage
 * @returns {Pelicula[]} Array de objetos Pelicula reconstruidos
 */

export function cargarPeliculas() {
    const json = localStorage.getItem(CLAVE_PELICULAS);
    if (!json) return [];
    const datos = JSON.parse(json);
//reconstruir instacias de pelicula
return datos.map(p => {
    const pelicula = new Pelicula(
        p.titulo,
        new Date(p.fechaEstreno),
        p.popularidad,
        p.generos);
    pelicula._id = p._id; //restaurar id
    pelicula._puntuaciones = p._puntuaciones; //restaurar puntuaciones
    return pelicula;
});
}

/**
 * Guarda un array de géneros en LocalStorage
 * @param {Genero[]} generos - Array de objetos Genero
 */

export function guardarGeneros(generos) {
    const json = JSON.stringify(generos);
    localStorage.setItem(CLAVE_GENEROS, json);
}

/**
 * Carga los géneros desde LocalStorage
 * @returns {Genero[]} Array de objetos Genero reconstruidos
 */

export function cargarGeneros() {
    const json = localStorage.getItem(CLAVE_GENEROS);
    if (!json) return [];
    const datos = JSON.parse(json);

    //reconstruir instancias de genero
    return datos.map(g => {
        const genero = new Genero(g.nombre);
        genero._id = g._id; //restaurar id
        return genero;
    });
}
