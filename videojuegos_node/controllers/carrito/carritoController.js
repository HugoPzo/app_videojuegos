import PedidoVideojuegos from "../../model/pedido_videojuego.js";
import Videojuego from "../../model/videojuego.js";
import Pago from "../../model/pago.js";

const renderizarCarrito = async (req, res) => {
    try {
        // Obtener los productos del carrito con la información del videojuego
        const itemsCarrito = await PedidoVideojuegos.findAll({
            include: [{
                model: Videojuego, // Relación con el modelo Videojuego
                attributes: ["titulo", "imagen"], // Datos a incluir
            }],
        });

        // Calcular el total
        const total = itemsCarrito.reduce((acc, item) => {
            return acc + item.cantidad * item.Videojuego.precio;
        }, 0);

        // Renderizar la vista con los datos del carrito
        res.render("consola/carrito", {
            titulo: "Carrito de Compras",
            itemsCarrito,
            total,
        });
    } catch (error) {
        console.error("Error al renderizar el carrito:", error);
        res.status(500).send("Ocurrió un error al cargar el carrito.");
    }
};

const agregarAlCarrito = async (req, res) => {
    try {
        const { id_videojuego, cantidad } = req.body;

        // Verificar si el producto ya está en el carrito
        const pedidoExistente = await PedidoVideojuegos.findOne({ where: { id_videojuego } });

        if (pedidoExistente) {
            // Actualizar cantidad
            pedidoExistente.cantidad += cantidad;
            await pedidoExistente.save();
            res.status(200).json({ message: "Cantidad actualizada en el carrito." });
        } else {
            // Agregar un nuevo producto al carrito
            await PedidoVideojuegos.create({ id_videojuego, cantidad });
            res.status(201).json({ message: "Producto agregado al carrito." });
        }
    } catch (error) {
        console.error("Error en agregarAlCarrito:", error);
        res.status(500).json({ error: "Ocurrió un error al agregar el producto al carrito." });
    }
};

export { renderizarCarrito, agregarAlCarrito };
