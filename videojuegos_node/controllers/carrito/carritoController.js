import PedidoVideojuegos from "../../model/pedido_videojuego.js";
import { Videojuego, Plataforma, Videojuego_plataformas } from "../../model/modelos.js";

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

// Procesa el pago y vacía el carrito
const procesarPago = async (req, res) => {
    try {
        const { numero_en_tarjeta } = req.body;

        if (!numero_en_tarjeta || numero_en_tarjeta.length !== 16 || isNaN(numero_en_tarjeta)) {
            return res.status(400).json({ error: "Número de tarjeta inválido." });
        }

        req.session.carrito = []
        res.redirect("/carrito/carrito")
    } catch (error) {
        console.error("Error al procesar el pago:", error);
        res.status(500).json({ error: "Ocurrió un error al procesar el pago." });
    }
};


export { renderizarCarrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, procesarPago };
