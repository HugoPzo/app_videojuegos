import express from "express";
import { crearPago } from "../controllers/carrito/pagoController.js";

const router_pago = express.Router();

router_pago.post("/carrito/pagar", crearPago);
//router_pago.get('/pagos/:id_usuario', obtenerPagos);

export default router_pago;
