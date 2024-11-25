import express from "express";
import { renderizarCarrito, agregarAlCarrito } from "../controllers/carrito/carritoController.js";

const router_carrito = express.Router();

router_carrito.get("/carrito", renderizarCarrito);
router_carrito.post("/carrito", agregarAlCarrito);

export default router_carrito;
