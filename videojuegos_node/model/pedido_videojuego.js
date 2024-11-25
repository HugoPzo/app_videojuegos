import { DataTypes } from "sequelize";
import db from "../config/db.js";
import Videojuego from "./videojuego.js"; // Importamos el modelo relacionado

const PedidoVideojuegos = db.define("PedidoVideojuegos", {
    id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    id_videojuego: {
        type: DataTypes.INTEGER,
        primaryKey: true,
    },
    cantidad: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "pedido_videojuegos",
    timestamps: false,
});

// Definir la relación
PedidoVideojuegos.belongsTo(Videojuego, { foreignKey: "id_videojuego" });

export default PedidoVideojuegos;
