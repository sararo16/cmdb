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
let peliculas = cargarPeliculas();
let generos = cargarGeneros();

//Asignar eventos de navegación a los botones del menu
document.getElementById('btnGeneros').addEventListener('click', mostrarGeneros);
document.getElementById('btnPeliculas').addEventListener('click', mostrarFormularioPeliculas);
document.getElementById('btnListado').addEventListener('click', mostrarListadoPeliculas);

/**
 * Muestra el formulario para añadir géneros (CRUD)
 * Valida que el nombre no este vacio ni duplicado
 */
function mostrarGeneros(){
    const main=document.getElementById('contenido');
    main.innerHTML=`
    <h2>Gestión de géneros</h2>
    <form id="form-genero">
        <label for="nombre-genero">Nombre del género:</label>
        <input type="text" id="nombre-genero" maxlength="100" required>
        <button type="submit">Añadir género</button>
    </form>
    <ul id="lista-generos"></ul> `;

    const ul=document.getElementById('lista-generos');
    ul.innerHTML='';

    generos.forEach(g=>{
        const li=document.createElement('li');
        li.textContent=`${g.id} - ${g.nombre}`;
        ul.appendChild(li);
    });

    /**
     * Evento para añadir un nuevo genero al enviar el formulario
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
 * Muestra el formulario para añadir una nueva película
 * Valida los campos y evita títulos duplicados
 */
function mostrarFormularioPeliculas(){
    //funcion que se ejecuta cuadno el usuario quiere añadir una nueva pelicula
    const main=document.getElementById('contenido');
    main.innerHTML=`
    <h2>Añadir nueva película</h2>
    <form id="form-pelicula">
        <label for="titulo">Título:</label>
        <input type="text" id="titulo" maxlength="100" required>

        <label for ="fecha">Fecha de estreno:</label>
        <input type="date" id="fecha" required>

        <label for="popularidad">Popularidad (0-100):</label>
        <input type="number" id="popularidad" min="0" max="100" required>

        <label for="generos">Género:</label>
        <select id="generos" multiple required></select>

        <button type="submit">Añadir película</button>
    </form>`;

    //busca el select en el formulario
    const select=document.getElementById ('generos');
    //recorre el array creando una opcion, pone el id, texto en nombre y se añade
    generos.forEach(g=>{
        const option=document.createElement('option');
        option.value=g.id;
        option.textContent=g.nombre;
        select.appendChild(option);
    });

    /**
     * Evento para añadir una nueva pelicula al formulario
     */
    document.getElementById('form-pelicula').addEventListener('submit', e=>{
        e.preventDefault();//evita que se recargue la pagina

        try{
            const titulo=document.getElementById('titulo').value;
            const fecha=new Date(document.getElementById('fecha').value); //convierte la fecha del input en un objeto date
            const popularidad=parseInt(document.getElementById('popularidad').value);
            const seleccionados=Array.from(select.selectedOptions).map(opt=>parseInt(opt.value)); //los generos seleccionados los comvierte en un array de IDs
            //verifica si ya existe una pelicula con ese titulo
            const existe=peliculas.some(p=>p.titulo.toLowerCase()===titulo.toLowerCase());
            if (existe) throw new Error ('Ya existe una película con ese título');

            //se crea una nueva instancia de la clase pelicula
            const nueva=new Pelicula(titulo, fecha, popularidad, seleccionados);
            //añade la pelicula al array
            peliculas.push(nueva);
            guardarPeliculas(peliculas); //se guarda el array actualizado
            alert('Película añadida correctamente');
            mostrarListadoPeliculas();
        //si ocurre un error se muestra con un alert
        }catch(error){
            alert(error.message);
        }
    });
}

    /**
    * Muestra el listado de películas registradas
    * Permite votar cada pelicula y actualiza la puntuacion media
    */
function mostrarListadoPeliculas(){
    //inserta una tabla en el HTML para mostrar las peliculas
    const main=document.getElementById('contenido');
    main.innerHTML=`
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

    //limpia el cuerpo de la tabla para volver a mostrarlo
    const tbody=document.getElementById('tabla-body');
    tbody.innerHTML='';

    //por cada pelicula crea una fila en la tabla
    peliculas.forEach(p=>{
        const fila=document.createElement('tr');

        //convierte los IDs de generos en nombres legibles, separados por comas
        const nombresGeneros=p.generos.map(id=>{
            const g=generos.find(gen=>gen.id===id);
            return g ? g.nombre : 'Desconocido';
        }).join(', ');

        //se llena la fila con los datos de la pelicula
        fila.innerHTML=`
            <td>${p.id}</td>
            <td>${p.titulo}</td>
            <td>${p.fechaEstreno.toLocaleDateString()}</td>
            <td>${p.popularidad}</td>
            <td>${nombresGeneros}</td>
            <td>${p.puntuacion}</td>
            <td>${p.numeroVotos}</td>
            <td>
            <button class="votar" data-id="${p.id}">Votar</button>
            </td>
        `;

        /**
         * Evento para votar una pelicula y actualizar su puntuacion
         */
        //añade un evento al boton votar
        fila.querySelector('.votar').addEventListener('click', ()=>{
            const voto=prompt(`Introduce tu puntuación (0-10):`);
            const valor=parseInt(voto);
            try{
                //valida que la puntuacion este entre 0 y 10
              if (isNaN(valor) || valor < 0 || valor > 10) {
                throw new Error('Puntuación inválida. Debe ser un número entre 0 y 10.');
              }
              //registra el voto, guarda los cambios y actualiza la tabla
                p.votar(valor);
                guardarPeliculas(peliculas);
                mostrarListadoPeliculas();
            
            //si hay error lo muestra con alert
            }catch(error){
                alert(error.message);
            }
        });
    
    tbody.appendChild(fila);
  });
}

