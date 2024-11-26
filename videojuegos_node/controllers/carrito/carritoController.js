
import { Videojuego, Pago, Pedido, PedidoVideojuegos } from "../../model/modelos.js";

// Renderiza la página del carrito con los datos del servidor
const renderizarCarrito = async (req, res) => {
    try {
        const itemsCarrito = await PedidoVideojuegos.findAll({
            include: [{
                model: Videojuego,
                attributes: ["titulo", "imagen"],
            }],
        });

        const total = req.session.carrito.reduce((acc, item) => {
            return acc + Number(item.precio) * Number(item.cantidad);
        }, 0);


        const carrito = req.session.carrito;
        console.log(carrito);
        res.render("carrito/carrito", {
            titulo: "Carrito de Compras",
            carrito,
            total,
        });
    } catch (error) {
        console.error("Error al renderizar el carrito:", error);
        res.status(500).send("Ocurrió un error al cargar el carrito.");
    }
};

// Agrega un producto al carrito o incrementa su cantidad
const agregarAlCarrito = (req, res) => {
    try {
        const { id_videojuego, titulo, precio, plataforma, imagen, cantidad } = req.body;


        // Inicializar el carrito si no existe
        if (!req.session.carrito) {
            req.session.carrito = [];
        }

        // Buscar si el producto ya está en el carrito
        const index = req.session.carrito.findIndex(
            item => item.id_videojuego === id_videojuego && item.plataforma === plataforma
        );

        if (index !== -1) {
            // Actualizar cantidad si el producto ya existe
            req.session.carrito[index].cantidad = Number(req.session.carrito[index].cantidad) + 1;
        } else {
            // Agregar nuevo producto
            req.session.carrito.push({ id_videojuego, titulo, precio, plataforma, imagen, cantidad });
        }

        res.redirect(`/consola/${plataforma}`);
    } catch (error) {
        console.error("Error en agregarAlCarrito:", error);
        res.status(500).json({ error: "Ocurrió un error al agregar el producto al carrito." });
    }
};


// Elimina un producto del carrito
const eliminarDelCarrito = async (req, res) => {
    try {
        const { id_videojuego, plataforma } = req.body;

        if (!req.session.carrito) {
            return res.status(404).json({ message: "El carrito está vacío." });
        }

        // Buscar el índice del producto en el carrito
        const index = req.session.carrito.findIndex(
            item => item.id_videojuego === id_videojuego && item.plataforma === plataforma
        );

        if (index !== -1) {
            // Reducir la cantidad si el producto existe
            if (req.session.carrito[index].cantidad > 1) {
                req.session.carrito[index].cantidad =
                    Number(req.session.carrito[index].cantidad) - 1;
            } else {
                // Si la cantidad es 1, eliminar el producto del carrito
                req.session.carrito.splice(index, 1);
            }
            res.redirect("/carrito/carrito")
        }


    } catch (error) {
        console.error("Error al eliminar del carrito:", error);
        res.status(500).json({ error: "No se pudo eliminar el producto del carrito." });
    }
};

// Vacía el carrito completamente
const vaciarCarrito = async (req, res) => {
    try {
        req.session.carrito = []
        res.redirect("/carrito/carrito")
    } catch (error) {
        console.error("Error al vaciar el carrito:", error);
        res.status(500).json({ error: "No se pudo vaciar el carrito." });
    }
};
// Procesa el pago y guarda los productos en la base de datos
const procesarPago = async (req, res) => {
    try {
        const { nombre_en_tarjeta, numero_en_tarjeta, vencimiento, direccion } = req.body;

        // Validación del número de tarjeta
        if (!numero_en_tarjeta || numero_en_tarjeta.length !== 1 || isNaN(numero_en_tarjeta)) {
            return res.status(400).json({ error: "Número de tarjeta inválido." });
        }

        // Guardar cada item del carrito en la base de datos
        const carrito = req.session.carrito;

        if (carrito && carrito.length > 0) {
            // Vamos a suponer que se genera un ID de pedido. (Asegúrate de tener un mecanismo para generar el id_pedido)

            // Crear un nuevo pago en la tabla `pagos`
            const pago = await Pago.create({
                nombre_en_tarjeta, // Cambia esto con el nombre real
                numero_en_tarjeta,
                vencimiento,  // Puedes ajustar la fecha de vencimiento
                direccion,
                id_usuario: 2,
            });

            const total = req.session.carrito.reduce((acc, item) => {
                return acc + Number(item.precio) * Number(item.cantidad);
            }, 0);

            // Crear un nuevo pedido en la tabla `pedidos`
            const id_pedido = generatePedidoId(); // Generar un ID único para el pedido
            const nuevoPedido = await Pedido.create({
                id_pedido,
                fecha: new Date(),
                total,
                id_usuario: 2,
                id_pago: pago.id_pago,
            });

            // Insertar los productos del carrito en la tabla `pedido_videojuegos`
            for (const item of carrito) {
                await PedidoVideojuegos.create({
                    id_pedido: id_pedido,
                    id_videojuego: item.id_videojuego,
                    nombre: item.titulo,
                    precio: parseFloat(item.precio),
                    cantidad: parseInt(item.cantidad),
                });
            }

            // Limpiar el carrito de la sesión después de procesar el pedido
            req.session.carrito = [];
            // Redirigir al usuario a la página de éxito o alguna otra página
            res.redirect("/carrito/carrito");  // Puedes redirigir a una página de confirmación de pago
        } else {
            return res.status(400).json({ error: "El carrito está vacío." });
        }

    } catch (error) {
        console.error("Error al procesar el pago:", error);
        res.status(500).json({ error: "Ocurrió un error al procesar el pago." });
    }
};

const generatePedidoId = () => {
    const fecha = new Date();

    // Obtenemos los componentes de la fecha y hora
    const año = fecha.getFullYear().toString().slice(-2); // Solo los dos últimos dígitos del año
    const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // Mes
    const hora = String(fecha.getHours()).padStart(2, '0'); // Hora
    const minuto = String(fecha.getMinutes()).padStart(2, '0'); // Minuto
    const segundo = String(fecha.getSeconds()).padStart(2, '0'); // Segundo

    // Creamos el ID de pedido con menos dígitos
    const id_pedido = `${año}${mes}${hora}${minuto}${segundo}`;

    return id_pedido;
};





export { renderizarCarrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, procesarPago };
