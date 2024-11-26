import { DataTypes, Sequelize } from "sequelize";
import db from "../config/db.js";
import Videojuego from "./videojuego.js"; // Importamos el modelo relacionado

const PedidoVideojuegos = db.define("PedidoVideojuegos", {
    id_pedido: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    id_videojuego: {
        type: Sequelize.INTEGER,
        primaryKey: true,
    },
    nombre: {
        type: Sequelize.STRING,
    },
    precio: {
        type: Sequelize.INTEGER,
    },
    cantidad: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "pedido_videojuegos",
    timestamps: false,
});

// Definir la relación
PedidoVideojuegos.belongsTo(Videojuego, { foreignKey: "id_videojuego" });

export default PedidoVideojuegos;
