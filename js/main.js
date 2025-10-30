import {Pelicula} from './pelicula.js';
import {Genero} from './genero.js';
import {
    guardarPeliculas,
    cargarPeliculas,
    guardarGeneros,
    cargarGeneros
} from './storage.js';

let peliculas = cargarPeliculas();
let generos = cargarGeneros();

//Asignar eventos a los botones del menu
document.getElementById('btnGeneros').addEventListener('click', mostrarGeneros);
document.getElementById('btnPeliculas').addEventListener('click', mostrarFormularioPeliculas);
document.getElementById('btnListado').addEventListener('click', mostrarListadoPeliculas);

//mostrar formulario para añadir generos
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

    document.getElementById('form-genero').addEventListener('submit',e =>{
        e.preventDefault();
        try{
            const nombre=document.getElementById('nombre-genero').value;
            const nuevo=new Genero (nombre);
            generos.push (nuevo);
            guardarGeneros(generos);
            mostrarGeneros();
        }catch(error){
            alert (error.message);
        }
    });
}

//mostrar formulario para añadir peliculas
function mostrarFormularioPeliculas(){
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

    const select=document.getElementById ('generos');
    generos.forEach(g=>{
        const option=document.createElement('option');
        option.value=g.id;
        option.textContent=g.nombre;
        select.appendChild(option);
    });

    document.getElementById('form-pelicula').addEventListener('submit', e=>{
        e.preventDefault();
        try{
            const titulo=document.getElementById('titulo').value;
            const fecha=new Date(document.getElementById('fecha').value);
            const popularidad=parseInt(document.getElementById('popularidad').value);
            const seleccionados=Array.from(select.selectedOptions).map(opt=>parseInt(opt.value));
            
            const nueva=new Pelicula(titulo, fecha, popularidad, seleccionados);
            peliculas.push(nueva);
            guardarPeliculas(peliculas);
            alert('Película añadida correctamente');
            mostrarListadoPeliculas();
        }catch(error){
            alert(error.message);
            console.error(error);
        }
    });
}

//mostrar listado de peliculas
function mostrarListadoPeliculas(){
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

    const tbody=document.getElementById('tabla-body');
    tbody.innerHTML='';

    peliculas.forEach(p=>{
        const fila=document.createElement('tr');

        const nombresGeneros=p.generos.map(id=>{
            const g=generos.find(gen=>gen.id===id);
            return g ? g.nombre : 'Desconocido';
        }).join(', ');

        fila.innerHTML=`
            <td>${p.id}</td>
            <td>${p.titulo}</td>
            <td>${p.fecha.toLocaleDateString()}</td>
            <td>${p.popularidad}</td>
            <td>${nombresGeneros}</td>
            <td>${p.puntuacion}</td>
            <td>${p.numeroVotos}</td>
            <td><button data-id="${p.id}">Votar</button></td>
        `;

        fila.querySelector('button').addEventListener('click', ()=>{
            const voto=prompt(`Introduce tu puntuación (0-10):`);
            const valor=parseInt(voto);
            try{
                p.votar(valor);
                guardarPeliculas(peliculas);
                mostrarListadoPeliculas();
            }catch(error){
                alert(error.message);
            }
        });
        tbody.appendChild(fila);
    });
}