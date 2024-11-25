import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Pedido = db.define("Pedido", {
    id_pedido: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    fecha: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    total: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    id_pago: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "pedidos",
    timestamps: false,
});

export default Pedido;
