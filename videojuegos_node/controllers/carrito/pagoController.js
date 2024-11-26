import PedidoVideojuegos from "../../model/pedido_videojuego.js";
import Videojuego from "../../model/videojuego.js";
import Pago from "../../model/pago.js";

const crearPago = async (req, res) => {
    console.log("Procesando pago...");
    try {
        const { nombre_en_tarjeta, numero_en_tarjeta, vencimiento, direccion, id_usuario } = req.body;

        // Validaciones simples
        if (!nombre_en_tarjeta || !numero_en_tarjeta || !vencimiento || !direccion || !id_usuario) {
            return res.status(400).json({ message: "Todos los campos son obligatorios." });
        }

        // Validar que el número de tarjeta tenga la longitud adecuada
        if (numero_en_tarjeta.length !== 16 || !/^\d+$/.test(numero_en_tarjeta)) {
            return res.status(400).json({ message: "Número de tarjeta inválido." });
        }

        // Crear el pago
        await Pago.create({
            nombre_en_tarjeta,
            numero_en_tarjeta,
            vencimiento,
            direccion,
            id_usuario,
        });

        // Redirigir al carrito
        res.redirect("/carrito/carrito");
    } catch (error) {
        console.error("Error en crearPago:", error);
        res.status(500).json({ message: "Hubo un error al procesar el pago." });
    }
};


export { crearPago };