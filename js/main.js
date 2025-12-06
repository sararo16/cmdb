import {Pelicula} from './pelicula.js'; //importa clase pelicula
import {Genero} from './genero.js'; //importa clase genero
//importamos funciones para guardar/cargar datos en localStorage
import {
    guardarPeliculas,
    cargarPeliculas,
    guardarGeneros,
    cargarGeneros,
    inicializarDatos
} from './storage.js';

//inicializar datos (cargar por defecto si localStorage esta vacio)
inicializarDatos();
/** @type {Pelicula[]} */
let peliculas = cargarPeliculas();
/** @type {Genero[]} */
let generos = cargarGeneros();

//Asignar eventos de navegación a los botones del menu
document.getElementById('btnGeneros').addEventListener('click', mostrarGeneros);
document.getElementById('btnPeliculas').addEventListener('click', mostrarFormularioPeliculas);
document.getElementById('btnListado').addEventListener('click', mostrarListadoPeliculas);

/**
 * Muestra el formulario para añadir géneros (CRUD)
 * Renderiza el formulario de alta y la lista de generos con opciones de edición y borrado
 * @function
 * @returns {void}
 */
function mostrarGeneros() {
    const main = document.getElementById('contenido');
    main.innerHTML = `
    <h2>Gestión de géneros</h2>
    <form id="form-genero">
        <label for="nombre-genero">Nombre del género:</label>
        <input type="text" id="nombre-genero" maxlength="100" required>
        <button type="submit">Añadir género</button>
    </form>
    <h3>Listado de Géneros</h3>
    <ul id="lista-generos" style="list-style: none; padding: 0;"></ul> `;

    const ul = document.getElementById('lista-generos');
    ul.innerHTML = '';

    generos.forEach(g => {
        const li = document.createElement('li');
        li.style.margin = "10px 0";
        li.style.padding = "10px";
        li.style.backgroundColor = "#333";
        li.style.borderRadius = "5px";

        //texto del genero
        const span = document.createElement('span');
        span.textContent = `${g.id} - ${g.nombre} `;

        // Botón Editar
        const btnEdit = document.createElement('button');
        btnEdit.textContent = '✏️Editar';
        btnEdit.style.marginLeft = "10px";
        btnEdit.onclick = () => editarGenero(g.id);

        // Botón Borrar
        const btnBorrar = document.createElement('button');
        btnBorrar.textContent = 'Borrar';
        btnBorrar.style.marginLeft = "5px";
        btnBorrar.style.borderColor = "#ff4444";
        btnBorrar.style.color = "#ff4444";
        btnBorrar.onclick = () => intentarBorrarGenero(g.id);

        li.appendChild(span);
        li.appendChild(btnEdit);
        li.appendChild(btnBorrar);
        ul.appendChild(li);
    });
    /**
     * Evento para añadir un nuevo genero al enviar el formulario
     * @event submit
     * @param {Event} e - Evento de envío del formulario
     */
    document.getElementById('form-genero').addEventListener('submit',e =>{
        e.preventDefault(); //evita que se recargue la pagina
        try{
            const nombre=document.getElementById('nombre-genero').value.trim(); //lee el valor y lo limpia
            //validaciones vacio y mismo nombre
            if (!nombre) throw new Error('El nombre del género no puede estar vacío');

            const existe=generos.some (g=>g.nombre.toLowerCase()===nombre.toLowerCase());
            if (existe) throw new Error ('Ya existe un género con ese nombre');

            //crea un nuevo objeto (genero), lo añade al array, lo guarda en localstorage y vuelve a llamar la funcion para refrescar la lista
            const nuevo=new Genero (nombre);
            generos.push (nuevo);
            guardarGeneros(generos);
            mostrarGeneros();

        //si hay error se muestra con alert
        }catch(error){
            alert (error.message);
        }
    });
}
    /**
     * Permite editar el nombre de un género existente.
     * Solicita el nuevo nombre mediante prompt y actualiza el almacenamiento.
     * @function
     * @param {number} id - Identificador del género a modificar.
     * @returns {void}
     */
function editarGenero(id) {
    const genero = generos.find(g => g.id === id);
    if (!genero) return;
    
    const nuevoNombre = prompt("Nuevo nombre para el género:", genero.nombre);
    //Si el usuario introduce algo y lo cancela
    if (nuevoNombre && nuevoNombre.trim().length > 0) {
        try {
            // Usamos el setter de la clase para validar
            genero.nombre = nuevoNombre; 
            guardarGeneros(generos);
            mostrarGeneros();
        } catch (e) {
            alert(e.message);
        }
    }
}
    /**
     * Intenta eliminar un género del sistema.
     * Valida que no existan películas asociadas a ese género antes de borrarlo.
     * @function
     * @param {number} id - Identificador del género a eliminar.
     * @returns {void}
     */
function intentarBorrarGenero(id) {
    // REQUISITO: Comprobar si hay películas con este género
    // Buscamos si alguna película tiene este ID en su array de géneros
    const enUso = peliculas.some(p => p.generos.includes(id));

    if (enUso) {
        alert("No se puede eliminar este género porque hay películas asociadas a él. Por favor, elimina el género de las películas antes de borrarlo.");
        return;
    }

    if (confirm("¿Seguro que quieres borrar este género?")) {
        // Filtramos el array para quitar el id seleccionado
        generos = generos.filter(g => g.id !== id);
        guardarGeneros(generos);
        mostrarGeneros();
    }
}


/**
 * Muestra el formulario para añadir una nueva película.
 * Valida los campos, carga el selector de géneros y gestiona el alta evitando duplicados.
 * @function
 * @returns {void}
 */
function mostrarFormularioPeliculas() {
    const main = document.getElementById('contenido');
    
    main.innerHTML = `
    <h2>Añadir nueva película</h2>
    <form id="form-pelicula">
        <label for="titulo">Título:</label>
        <input type="text" id="titulo" maxlength="100" required>

        <label for="fecha">Fecha de estreno:</label>
        <input type="date" id="fecha" required>

        <label for="popularidad">Popularidad (0-100):</label>
        <input type="number" id="popularidad" min="0" max="100" step="0.1" required>

        <label for="generos">Género:</label>
        <select id="generos" multiple required></select>

        <button type="submit">Añadir película</button>
    </form>`;

    // Busca el select en el formulario
    const select = document.getElementById('generos');
    
    // Recorre el array creando una opción por cada género
    generos.forEach(g => {
        const option = document.createElement('option');
        option.value = g.id;
        option.textContent = g.nombre;
        select.appendChild(option);
    });

    /**
     * Evento para procesar el formulario de nueva película
     * @event submit
     * @param {Event} e - Evento de envío del formulario
     */
    document.getElementById('form-pelicula').addEventListener('submit', e => {
        e.preventDefault(); // Evita que se recargue la página

        try {
            const titulo = document.getElementById('titulo').value;
            // Convierte la fecha del input en un objeto Date
            const fecha = new Date(document.getElementById('fecha').value); 
            
            // Usamos parseFloat para admitir decimales
            const popularidad = parseFloat(document.getElementById('popularidad').value);
            
            // Convierte los géneros seleccionados en un array de IDs
            const seleccionados = Array.from(select.selectedOptions).map(opt => parseInt(opt.value)); 
            
            // Verifica si ya existe una película con ese título
            const existe = peliculas.some(p => p.titulo.toLowerCase() === titulo.toLowerCase());
            if (existe) throw new Error('Ya existe una película con ese título');

            // Se crea una nueva instancia de la clase Pelicula
            const nueva = new Pelicula(titulo, fecha, popularidad, seleccionados);
            
            // Añade la película al array y guarda
            peliculas.push(nueva);
            guardarPeliculas(peliculas); 
            
            alert('Película añadida correctamente');
            mostrarListadoPeliculas(); // Redirige al listado

        } catch (error) {
            alert(error.message);
        }
    });
}
/**
 * Renderiza la tabla con el listado completo de películas.
 * Incluye botones para votar y eliminar cada película.
 * CORREGIDO: Usa un div interno para no romper los bordes de la tabla.
 * @function
 * @returns {void}
 */
function mostrarListadoPeliculas() {
    const main = document.getElementById('contenido');
    main.innerHTML = `
    <h2>Listado de películas</h2>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Título</th>
                <th>Fecha</th>
                <th>Popularidad</th>
                <th>Géneros</th>
                <th>Puntuación</th>
                <th>Votos</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody id="tabla-body"></tbody>
    </table>`;

    const tbody = document.getElementById('tabla-body');
    tbody.innerHTML = '';

    peliculas.forEach(p => {
        const fila = document.createElement('tr');

        // Convierte los IDs de géneros en nombres legibles
        const nombresGeneros = p.generos.map(id => {
            const g = generos.find(gen => gen.id === id);
            return g ? g.nombre : 'Desconocido';
        }).join(', ');

        fila.innerHTML = `
            <td>${p.id}</td>
            <td>${p.titulo}</td>
            <td>${p.fechaEstreno.toLocaleDateString()}</td>
            <td>${p.popularidad}</td>
            <td>${nombresGeneros}</td>
            <td>${p.puntuacion}</td>
            <td>${p.numeroVotos}</td>
            <td></td> `;
        
        // Obtenemos la celda vacía
        const celdaAcciones = fila.lastElementChild;

        // Creamos un DIV contenedor para los botones
        const divBotones = document.createElement('div');
        divBotones.style.display = "flex";
        divBotones.style.gap = "5px";

        // --- Botón Votar ---
        const btnVotar = document.createElement('button');
        btnVotar.textContent = '⭐ Votar';
        btnVotar.className = 'votar'; 
        btnVotar.onclick = () => {
            const voto = prompt(`Puntúa "${p.titulo}" (0-10):`);
            const valor = parseInt(voto);
            if (!isNaN(valor) && valor >= 0 && valor <= 10) {
                p.votar(valor);
                guardarPeliculas(peliculas);
                mostrarListadoPeliculas();
            } else {
                alert("Puntuación inválida. Debe ser un número entre 0 y 10.");
            }
        };

        // --- Botón Borrar ---
        const btnBorrar = document.createElement('button');
        btnBorrar.textContent = '🗑️';
        btnBorrar.title = "Eliminar película";
        btnBorrar.style.backgroundColor = "#ff4444";
        btnBorrar.style.color = "white";
        btnBorrar.style.borderColor = "#cc0000";
        btnBorrar.onclick = () => {
            if (confirm(`¿Eliminar la película "${p.titulo}"?`)) {
                eliminarPelicula(p.id);
            }
        };

        // Añadimos botones al DIV, y el DIV a la CELDA
        divBotones.appendChild(btnVotar);
        divBotones.appendChild(btnBorrar);
        celdaAcciones.appendChild(divBotones);
        
        tbody.appendChild(fila);
    });
}
/**
 * Elimina una película del sistema por su ID.
 * Actualiza el array local y el LocalStorage.
 * @function
 * @param {number} id - Identificador de la película a eliminar.
 * @returns {void}
 */
function eliminarPelicula(id) {
    // Filtra las películas excluyendo la que coincide con el ID
    peliculas = peliculas.filter(p => p.id !== id);
    guardarPeliculas(peliculas);
    mostrarListadoPeliculas(); // Refrescar la tabla
}


