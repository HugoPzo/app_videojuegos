import { Sequelize } from "sequelize";

import Videojuego from './videojuego.js';
import Plataforma from './plataforma.js';
import Videojuego_plataformas from './videojuego_plataforma.js';
import Usuario from "./usuario.js"
import Pedido from "./pedido.js"
import PedidoVideojuegos from "./pedido_videojuego.js";
import Pago from "./pago.js"

Usuario.hasMany(Pedido, { foreignKey: "id_usuario" });
Pedido.belongsTo(Usuario, { foreignKey: "id_usuario" });

// Relación de Pago con Pedido
Pago.hasMany(Pedido, { foreignKey: "id_pago" });
Pedido.belongsTo(Pago, { foreignKey: "id_pago" });

// Relación de Pedido con PedidoVideojuegos
Pedido.hasMany(PedidoVideojuegos, { foreignKey: "id_pedido" });
PedidoVideojuegos.belongsTo(Pedido, { foreignKey: "id_pedido" });

// Relación de Videojuego con PedidoVideojuegos
Videojuego.hasMany(PedidoVideojuegos, { foreignKey: "id_videojuego" });
PedidoVideojuegos.belongsTo(Videojuego, { foreignKey: "id_videojuego" });

Plataforma.hasMany(Videojuego_plataformas, { foreignKey: "id_plataforma" });
Videojuego_plataformas.belongsTo(Plataforma, { foreignKey: "id_plataforma" });


Videojuego.hasMany(Videojuego_plataformas, { foreignKey: "id_videojuego" });
Videojuego_plataformas.belongsTo(Videojuego, { foreignKey: "id_videojuego" });

export {Videojuego, Plataforma, Videojuego_plataformas, Usuario, Pago, Pedido, PedidoVideojuegos}