document.addEventListener("DOMContentLoaded", () => {
    const botonesAgregarCarrito = document.querySelectorAll(".button.agregar-carrito");
    const tablaCarrito = document.querySelector("tbody");
    const contadorElemento = document.querySelector("#contador-carrito");
    const botonVaciarCarrito = document.querySelector(".boton-vaciar");
    const totalElemento = document.querySelector("tfoot td:nth-child(2)");
    const formularioPago = document.querySelector("#pagoForm");
    let carrito = JSON.parse(localStorage.getItem("carrito")) || [];

    const actualizarContador = () => {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        if (contadorElemento) {
            contadorElemento.textContent = totalItems;
            contadorElemento.style.display = totalItems > 0 ? "block" : "none";
        }
    };

    const calcularTotal = () => {
        return carrito.reduce((acc, item) => acc + item.precio * item.cantidad, 0).toFixed(2);
    };

    const renderizarCarrito = () => {
        if (tablaCarrito) {
            tablaCarrito.innerHTML = "";
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
                            <td>$${(item.precio * item.cantidad).toFixed(2)}</td>
                            <td>
                                <a href="#" class="boton boton-eliminar" data-id="${item.id_videojuego}">Eliminar</a>
                            </td>
                        </tr>`;
                });
            }
            if (totalElemento) {
                totalElemento.textContent = `$${calcularTotal()}`;
            }
        }
    };

    const agregarAlCarrito = (id, titulo, precio, imagen) => {
        const index = carrito.findIndex(item => item.id_videojuego === id);
        if (index !== -1) {
            carrito[index].cantidad++;
        } else {
            carrito.push({ id_videojuego: id, titulo, precio, imagen, cantidad: 1 });
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();
        renderizarCarrito();
        alert("Se agregó al carrito");
    };

    const eliminarDelCarrito = (id) => {
        carrito = carrito.filter(item => item.id_videojuego !== id);
        localStorage.setItem("carrito", JSON.stringify(carrito));
        actualizarContador();
        renderizarCarrito();
    };

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

    if (tablaCarrito) {
        tablaCarrito.addEventListener("click", (e) => {
            if (e.target.classList.contains("boton-eliminar")) {
                e.preventDefault();
                const id = parseInt(e.target.dataset.id);
                eliminarDelCarrito(id);
            }
        });
    }

    if (botonVaciarCarrito) {
        botonVaciarCarrito.addEventListener("click", (e) => {
            e.preventDefault();
            carrito = [];
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarContador();
            renderizarCarrito();
        });
    }

    if (formularioPago) {
        formularioPago.addEventListener("submit", (e) => {
            const numeroTarjeta = document.querySelector("#numero_en_tarjeta").value;

            if (numeroTarjeta.length !== 16 || isNaN(numeroTarjeta)) {
                e.preventDefault();
                alert("El número de tarjeta debe tener 16 dígitos.");
                return;
            }

            // Aquí vaciamos el carrito después de una compra exitosa
            carrito = [];
            localStorage.setItem("carrito", JSON.stringify(carrito));
            actualizarContador();
            renderizarCarrito();
            alert("Compra realizada con éxito. El carrito se ha vaciado.");
        });
    }

    actualizarContador();
    renderizarCarrito();
});
