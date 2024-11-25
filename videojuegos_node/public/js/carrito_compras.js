document.addEventListener("DOMContentLoaded", () => {
    const botonesAgregarCarrito = document.querySelectorAll(".button.agregar-carrito");
    const tablaCarrito = document.querySelector("tbody");
    const contadorElemento = document.querySelector("#contador-carrito");
    const botonVaciarCarrito = document.querySelector(".boton-vaciar");
    let carrito = JSON.parse(localStorage.getItem("carrito")) || []; // Cargar carrito desde LocalStorage

    // Función para actualizar el contador
    const actualizarContador = () => {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        if (contadorElemento) {
            contadorElemento.textContent = totalItems;
            contadorElemento.style.display = totalItems > 0 ? "block" : "none";
        }
    };

    // Función para renderizar el carrito en la tabla
    const renderizarCarrito = () => {
        if (tablaCarrito) {
            tablaCarrito.innerHTML = ""; // Limpiar tabla
            if (carrito.length === 0) {
                tablaCarrito.innerHTML = `
                    <tr>
                        <td class="text-center" colspan="5">Tu carrito está vacío.</td>
                    </tr>`;
            } else {
                carrito.forEach(item => {
                    tablaCarrito.innerHTML += `
                        <tr>
                            <td><img src="${item.imagen}" alt="${item.titulo}" class="img-producto"></td>
                            <td>${item.titulo}</td>
                            <td>${item.cantidad}</td>
                            <td>$${item.precio}</td>
                            <td>
                                <a href="#" class="boton boton-eliminar" data-id="${item.id_videojuego}">Eliminar</a>
                            </td>
                        </tr>`;
                });
            }
        }
    };

    // Función para agregar un videojuego al carrito
    const agregarAlCarrito = (id, titulo, precio, imagen) => {
        const index = carrito.findIndex(item => item.id_videojuego === id);
        if (index !== -1) {
            carrito[index].cantidad++; // Incrementar cantidad si ya está en el carrito
        } else {
            carrito.push({ id_videojuego: id, titulo, precio, imagen, cantidad: 1 }); // Agregar nuevo producto
        }
        localStorage.setItem("carrito", JSON.stringify(carrito)); // Guardar carrito en LocalStorage
        actualizarContador();
        renderizarCarrito();
    };

    // Función para eliminar un videojuego del carrito
    const eliminarDelCarrito = (id) => {
        carrito = carrito.filter(item => item.id_videojuego !== id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();
        renderizarCarrito();
    };

    // Evento para los botones "Agregar al carrito"
    botonesAgregarCarrito.forEach(boton => {
        boton.addEventListener("click", (e) => {
            e.preventDefault();
            const id = parseInt(boton.dataset.id);
            const titulo = boton.closest(".card-info").querySelector(".card-title").textContent;
            const precio = parseFloat(boton.closest(".card-info").querySelector(".precio").textContent.replace("$", ""));
            const imagen = boton.closest(".card").querySelector("img").src;
            agregarAlCarrito(id, titulo, precio, imagen);
        });
    });

    // Evento para eliminar productos
    if (tablaCarrito) {
        tablaCarrito.addEventListener("click", (e) => {
            if (e.target.classList.contains("boton-eliminar")) {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id);
                eliminarDelCarrito(id);
            }
        });
    }

    // Evento para vaciar el carrito
    if (botonVaciarCarrito) {
        botonVaciarCarrito.addEventListener("click", (e) => {
            e.preventDefault();
            carrito = [];
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarContador();
            renderizarCarrito();
        });
    }

    // Inicializar
    actualizarContador();
    renderizarCarrito();
});
