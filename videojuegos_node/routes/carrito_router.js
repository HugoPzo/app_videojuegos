import express from "express";
import { renderizarCarrito, agregarAlCarrito, eliminarDelCarrito, vaciarCarrito, procesarPago } from "../controllers/carrito/carritoController.js";

const router_carrito = express.Router();

router_carrito.get("/carrito", renderizarCarrito);
router_carrito.post("/agregar", agregarAlCarrito); // Agregar al carrito
router_carrito.post("/eliminar", eliminarDelCarrito); // Eliminar un producto
router_carrito.get("/vaciar", vaciarCarrito); // Vaciar el carrito
router_carrito.post("/pago", procesarPago); // Procesar el pago

export default router_carrito;
