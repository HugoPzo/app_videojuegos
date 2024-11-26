import { DataTypes } from "sequelize";
import db from "../config/db.js";

const Pago = db.define("Pago", {
    id_pago: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre_en_tarjeta: {
        type: DataTypes.STRING(30),
        allowNull: false,
    },
    numero_en_tarjeta: {
        type: DataTypes.STRING(19), 
        allowNull: false,
    },
    vencimiento: {
        type: DataTypes.DATE,
        allowNull: false,
    },
    direccion: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    id_usuario: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    tableName: "pagos",
    timestamps: false,
});

export default Pago;
