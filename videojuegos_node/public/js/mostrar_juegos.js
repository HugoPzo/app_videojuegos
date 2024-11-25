// Escuchar los eventos de clic en los botones de consola
document.querySelector('#xbox').addEventListener('click', () => cargarJuegosPorConsola('Xbox'));
document.querySelector('#playstation').addEventListener('click', () => cargarJuegosPorConsola('PlayStation'));
document.querySelector('#nintendo').addEventListener('click', () => cargarJuegosPorConsola('Nintendo'));

// Variables globales
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];

// Función para borrar el contenido actual
function borrar() {
    const contenedor = document.querySelector('.recomendacion-header');
    contenedor.innerHTML = ''; // Limpiar el contenedor
}

// Función para construir las tarjetas de los videojuegos
function construir(data, contenedor) {
    if (data.length > 0) {
        data.forEach(juego => {
            const precio = juego.videojuego_plataformas[0].precio;

            contenedor.innerHTML += `
                <div class="card">
                    <div class="card-img">
                        <img src="${juego.imagen}" alt="${juego.titulo}" id="portada">
                    </div>
                    <div class="card-info">
                        <h4 class="card-title" id="titulo">${juego.titulo}</h4>
                        <img src="image/icons/estrellas.png" alt="estrellas" class="estrellas">
                        <p class="precio" id="precio">$ ${precio}</p>
                        <a href="#" class="button agregar-carrito" data-id="${juego.id_videojuego}">Añadir al carrito</a>
                        <a href="#" class="button mostrar-video" data-link="${juego.trailer}">Review</a>
                    </div>
                </div>
            `;
        });

        // Asignar evento a los botones "Agregar al carrito"
        document.querySelectorAll('.agregar-carrito').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Evitar comportamiento por defecto
                const id = e.target.getAttribute('data-id');
                agregarProductoAlCarrito(id, data);
            });
        });
    } else {
        contenedor.innerHTML = `<p>No hay videojuegos disponibles para esta consola.</p>`;
    }
}

// Función para cargar los videojuegos según la consola seleccionada
function cargarJuegosPorConsola(consola) {
    fetch(`/consola/${consola}`) // Llama a la ruta del backend
        .then(response => response.json())
        .then(data => {
            borrar();
            const contenedor = document.querySelector('.opciones');
            contenedor.innerHTML = ''; // Limpiar el contenedor
            construir(data, contenedor);
        })
        .catch(error => console.error('Error:', error));
}

// Función para agregar un producto al carrito
function agregarProductoAlCarrito(id, juegos) {
    const producto = juegos.find(juego => juego.id_videojuego === parseInt(id));
    if (!producto) return;

    const index = carrito.findIndex(item => item.id === id);
    if (index >= 0) {
        carrito[index].cantidad += 1; // Incrementar la cantidad si ya está en el carrito
    } else {
        carrito.push({
            id: producto.id_videojuego,
            titulo: producto.titulo,
            precio: producto.videojuego_plataformas[0].precio,
            imagen: producto.imagen,
            cantidad: 1,
        });
    }

    guardarCarrito();
    alert(`Producto "${producto.titulo}" añadido al carrito.`);
}

// Guardar el carrito en localStorage
function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}
